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
  const camera = useThree((s) => s.camera);
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

/** Card substrate behind decal — design file matte #292929 */
export const CARD_SUBSTRATE_HEX = '#292929';

/**
 * CSS aspect ratio (width÷height) matching `card` mesh POSITION bounds in exported GLB
 * (accessor min/max: ΔX/ΔY ≈ 0.716418). Keeps WebGL buffer aspect aligned with Blender viewport.
 */
export const LANYARD_VIEWPORT_WH_NUM = 358209;
export const LANYARD_VIEWPORT_WH_DEN = 500000;

const DEFAULT_RIG_POSITION: [number, number, number] = [0, 0, 0];

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  /** When false, clears to opaque black. Ignored when `sceneBackground` is set. */
  transparent?: boolean;
  /**
   * Solid fill behind the 3D content (THREE scene background).
   * When set, the GL context uses `alpha: false` — CSS on the wrapper/canvas won't replace this.
   */
  sceneBackground?: string;
  /**
   * Moves the perspective camera closer on Z so the badge reads larger in the SAME canvas box.
   * Does not resize the DOM or the About grid — only the 3D framing. Typical ~1.2–1.45 for a bolder card.
   */
  subjectZoom?: number;
  /**
   * Listen for pointers on this element instead of blocking the fullscreen canvas overlay.
   * Raycasting uses the WebGL canvas bounds + client coords so the badge can overlap HTML underneath.
   */
  eventSource?: RefObject<HTMLElement>;
  /** World-space offset for rope + badge + lanyard line (easiest way to shift X/Y vs the camera). */
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
  rigPosition = DEFAULT_RIG_POSITION
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const useSceneFill = typeof sceneBackground === 'string' && sceneBackground.trim() !== '';
  const glTransparent = useSceneFill ? false : transparent;

  // Depends on xyz scalars, not `position` by reference, so edits to x/y/z (including same-array mutation) refresh the camera.
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
    <div className="lanyard-wrapper">
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
        onCreated={(state) => {
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
              compute: (event, st) => {
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
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
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

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, rigPosition = DEFAULT_RIG_POSITION }: BandProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const band = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixed = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j1 = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j2 = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j3 = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyard);
  const cardTexture = useTexture(cardImage);

  const { gl } = useThree();

  useLayoutEffect(() => {
    const maxAniso = Math.min(16, gl.capabilities.getMaxAnisotropy());
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.flipY = false;
    cardTexture.generateMipmaps = true;
    cardTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardTexture.magFilter = THREE.LinearFilter;
    cardTexture.anisotropy = maxAniso;
    cardTexture.wrapS = THREE.ClampToEdgeWrapping;
    cardTexture.wrapT = THREE.ClampToEdgeWrapping;
    cardTexture.needsUpdate = true;
  }, [gl, cardTexture]);

  useLayoutEffect(() => {
    const maxAniso = Math.min(16, gl.capabilities.getMaxAnisotropy());
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = maxAniso;
    texture.needsUpdate = true;
  }, [gl, texture]);

  const cardBackMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(CARD_SUBSTRATE_HEX),
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    []
  );

  const cardSurfaceMaterial = useMemo(() => {
    const raw = nodes.card.material as THREE.Material | THREE.Material[];
    const base = Array.isArray(raw) ? raw[0] : raw;
    const m = base.clone() as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
    m.map = cardTexture;
    m.color.set(0xffffff);
    if ('envMapIntensity' in m) {
      (m as THREE.MeshStandardMaterial).envMapIntensity = 0.62;
    }
    m.transparent = false;
    m.alphaTest = 0.42;
    m.depthWrite = true;
    if (isMobile && 'clearcoat' in m && typeof (m as THREE.MeshPhysicalMaterial).clearcoat === 'number') {
      (m as THREE.MeshPhysicalMaterial).clearcoat = 0;
    }
    m.needsUpdate = true;
    return m;
  }, [nodes.card, cardTexture, isMobile]);

  useEffect(() => {
    const mat = cardSurfaceMaterial;
    return () => mat.dispose();
  }, [cardSurfaceMaterial]);

  useEffect(() => {
    const m = cardBackMaterial;
    return () => m.dispose();
  }, [cardBackMaterial]);

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

  useFrame((state, delta) => {
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
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
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

  const { width: canvasW, height: canvasH } = useThree((s) => s.size);

  return (
    <>
      <group position={rigPosition}>
        <group position={[0, 4, 0]}>
          <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
          <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody
            position={[2, 0, 0]}
            ref={card}
            {...segmentProps}
            type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
          >
            <CuboidCollider args={[0.8, 1.125, 0.01]} />
            <group
              scale={2.25}
              position={[0, -1.2, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e) => {
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                drag(false);
              }}
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              }}
            >
              <mesh geometry={nodes.card.geometry} material={cardBackMaterial} position={[0, 0, -0.016]} renderOrder={-1} />
              <mesh geometry={nodes.card.geometry} material={cardSurfaceMaterial} />
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </RigidBody>
        </group>
      </group>
      {/*
        Band stays OUTSIDE rigPosition: curve points come from Rapier in world coords.
        Nesting mesh under rigPosition doubled the transform and hid/off-screened the strap.
      */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#c9d4e8"
          depthTest={false}
          transparent
          opacity={1}
          resolution={[canvasW || 512, canvasH || 512]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={Math.max(isMobile ? 2.75 : 2.25, 1.75)}
        />
      </mesh>
    </>
  );
}
