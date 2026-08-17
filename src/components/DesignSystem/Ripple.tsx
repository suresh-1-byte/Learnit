import React, { useState, useRef, useEffect } from 'react';

export interface RippleProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 600
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, duration);
  };

  return (
    <div
      ref={buttonRef}
      onMouseDown={addRipple}
      className="relative overflow-hidden"
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animation: `ripple ${duration}ms ease-out forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
