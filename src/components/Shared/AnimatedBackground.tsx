import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  theme?: 'dark' | 'light';
}

export const AnimatedBackground = ({ theme = 'dark' }: AnimatedBackgroundProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform">
      {/* Primary gradient orb */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#6366F1]/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Secondary gradient orb */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#A855F7]/20 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Tertiary gradient orb */}
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#10B981]/15 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Accent gradient orb */}
      <motion.div
        className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-[#F59E0B]/15 rounded-full blur-[70px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Subtle mesh overlay - theme-aware */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        theme === 'dark' 
          ? 'from-transparent via-[#050505]/50 to-[#050505]' 
          : 'from-transparent via-[rgba(248,249,252,0.3)] to-[rgba(248,249,252,0.6)]'
      }`} />
    </div>
  );
};

export const GradientMesh = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 will-change-transform">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#gradient1)"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: 'opacity' }}
        />
      </svg>
    </div>
  );
};
