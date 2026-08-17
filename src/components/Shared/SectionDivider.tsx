import { motion } from 'motion/react';

interface SectionDividerProps {
  className?: string;
}

export const SectionDivider = ({ className = '' }: SectionDividerProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6366F1]"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        animate={{ 
          boxShadow: ['0 0 10px #6366F1', '0 0 20px #6366F1', '0 0 10px #6366F1']
        }}
      />
    </div>
  );
};

export const AnimatedGradientDivider = ({ className = '' }: SectionDividerProps) => {
  return (
    <div className={`relative h-px ${className}`}>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#10B981]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#10B981]"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ backgroundSize: '200% 100%' }}
      />
    </div>
  );
};
