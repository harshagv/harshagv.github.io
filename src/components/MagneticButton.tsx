import React, { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  intensity?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = '', 
  onClick,
  intensity = 0.4 // Global baseline magnetic force
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only map magnetic interpolation onto mouse-driven interfaces (desktop)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const el = containerRef.current;
    if (!el) return;

    // We use a formal QuickTo mapping to hijack the object timeline aggressively, bypassing CSS transition limits
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      
      // Calculate true geometric center of node vs active mouse vector
      const x = (clientX - (left + width / 2)) * intensity;
      const y = (clientY - (top + height / 2)) * intensity;

      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`inline-block cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
