/* eslint-disable react/no-unknown-property */
import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import type { RigidBodyProps } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from './card.glb';
import lanyard from './lanyard.png';
import cardImage from '../../sections/Frame 2352.png';

import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

/** Ensures camera x/y/z + fov track props (Canvas `camera` alone can miss non-z updates). */
function SyncCameraFromProps({ position, fov }: { position: [number, number, number]; fov: number }) {
  const camera = useThree((s: any) => s.camera);
  useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    const pCam = camera as THREE.PerspectiveCamera;
    if (pCam.isPerspectiveCamera) {
      pCam.fov = fov;
      pCam.updateProjectionMatrix();
    }
    camera.updateMatrixWorld();
  }, [camera, position[0], position[1], position[2], fov]);
  return null;
}

export const CARD_SUBSTRATE_HEX = '#292929';

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  sceneBackground?: string;
  subjectZoom?: number;
  eventSource?: RefObject<HTMLElement>;
  rigPosition?: [number, number, number];
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  sceneBackground,
  subjectZoom = 1,
  eventSource,
  rigPosition = [0, 0, 0]
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const useSceneFill = typeof sceneBackground === 'string' && sceneBackground.trim() !== '';
  const glTransparent = useSceneFill ? false : transparent;

  const cameraConfig = useMemo(() => {
    const zoom = Math.max(0.75, Math.min(subjectZoom, 2.75));
    return {
      position: [position[0], position[1], position[2] / zoom] as [number, number, number],
      fov,
    };
  }, [position[0], position[1], position[2], fov, subjectZoom]);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper relative z-0 w-full h-screen flex justify-center items-center">
      <Canvas
        camera={cameraConfig}
        dpr={[2, isMobile ? 3.25 : 4]}
        {...(eventSource ? { eventSource } : {})}
        gl={{
          alpha: glTransparent,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={(state: any) => {
          const { gl, setEvents } = state;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
          gl.toneMappingExposure = 1;
          if (useSceneFill) {
            gl.setClearColor(new THREE.Color(sceneBackground!.trim()), 1);
          } else if (transparent) {
            gl.setClearColor(new THREE.Color(0x000000), 0);
          } else {
            gl.setClearColor(new THREE.Color(0x000000), 1);
          }
          if (eventSource) {
            setEvents({
              compute: (event: any, st: any) => {
                const r = gl.domElement.getBoundingClientRect();
                if (r.width <= 0 || r.height <= 0) return;
                st.pointer.set(
                  ((event.clientX - r.left) / r.width) * 2 - 1,
                  -((event.clientY - r.top) / r.height) * 2 + 1
                );
                st.raycaster.setFromCamera(st.pointer, st.camera);
              }
            });
          }
        }}
      >
        <SyncCameraFromProps position={cameraConfig.position} fov={cameraConfig.fov} />
        {useSceneFill ? <color attach="background" args={[sceneBackground!.trim()]} /> : null}
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} rigPosition={rigPosition} />
        </Physics>
        <Environment blur={0.75} environmentIntensity={0.55}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  rigPosition?: [number, number, number];
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, rigPosition = [0, 0, 0] }: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyard);
  const cardTexture = useTexture(cardImage);

  const { gl } = useThree();

  useLayoutEffect(() => {
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.flipY = false;
    cardTexture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
    cardTexture.needsUpdate = true;
  }, [cardTexture, gl]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state: any, delta: number) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2, j3].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
        );
      });
      curve.points[0].copy(j3.current.lerped);
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={rigPosition}>
        <group position={[0, 4, 0]}>
          <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
          <RigidBody position={[0, -0.5, 0]} ref={j1} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[0, -1, 0]} ref={j2} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[0, -1.5, 0]} ref={j3} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody
            position={[0, -2.95, 0]}
            ref={card}
            {...segmentProps}
            type={dragged ? 'kinematicPosition' : 'dynamic'}
          >
            <CuboidCollider args={[0.8, 1.125, 0.01]} />
            <group
              scale={2.25}
              position={[0, -1.2, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e: any) => {
                e.target.releasePointerCapture(e.pointerId);
                drag(false);
              }}
              onPointerDown={(e: any) => {
                e.target.setPointerCapture(e.pointerId);
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              }}
            >
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardTexture}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </RigidBody>
        </group>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
