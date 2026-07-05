import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OdometerProps {
  value: number;
}

const Odometer: React.FC<OdometerProps> = ({ value }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const columns = containerRef.current.querySelectorAll('.digit-column');
    const formatted = value.toString().padStart(2, '0');
    
    columns.forEach((column, index) => {
      const targetDigit = parseInt(formatted[index]);
      const stack = column.querySelector('.digit-stack') as HTMLElement;
      
      if (!stack) return;

      gsap.fromTo(stack, 
        { y: '0%' },
        {
          y: `-${targetDigit * 10}%`,
          duration: 1.5 + (index * 0.3), // Stagger rolling between digits
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, [value]);

  return (
    <div ref={containerRef} className="flex overflow-hidden h-[1.2em] relative leading-[1.2em] font-mono mr-4 font-bold text-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
      
      {/* Tens Column */}
      <div className="digit-column relative h-full">
        <div className="digit-stack flex flex-col absolute top-0 left-0">
          {[0,1,2,3,4,5,6,7,8,9].map(num => (
            <div key={`tens-${num}`} className="digit h-[1.2em] flex items-center justify-center">{num}</div>
          ))}
        </div>
        {/* Invisible spacer bounding box to lock CSS width */}
        <div className="opacity-0">0</div>
      </div>
      
      {/* Units Column */}
      <div className="digit-column relative h-full">
        <div className="digit-stack flex flex-col absolute top-0 left-0">
          {[0,1,2,3,4,5,6,7,8,9].map(num => (
            <div key={`units-${num}`} className="digit h-[1.2em] flex items-center justify-center">{num}</div>
          ))}
        </div>
        {/* Invisible spacer bounding box to lock CSS width */}
        <div className="opacity-0">0</div>
      </div>

      <span className="ml-[1px]">.</span>
    </div>
  );
};

export default Odometer;
