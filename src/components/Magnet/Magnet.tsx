import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  className = ''
}) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) { setPosition({ x: 0, y: 0 }); return; }
    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);
      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        setPosition({ x: (e.clientX - centerX) / magnetStrength, y: (e.clientY - centerY) / magnetStrength });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, disabled, magnetStrength]);

  return (
    <div ref={magnetRef} className={className} style={{
      position: 'relative',
      display: 'inline-block',
      transition: isActive ? 'transform 0.3s ease-out' : 'transform 0.5s ease-in-out',
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`
    }}>
      {children}
    </div>
  );
};

export default Magnet;
