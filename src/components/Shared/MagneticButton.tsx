import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export const MagneticButton = ({ 
  children, 
  className = '', 
  onClick,
  strength = 30 
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    
    x.set(xPct * strength);
    y.set(yPct * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: maskImage,
        maskImage: maskImage,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};
