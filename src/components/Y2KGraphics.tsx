import React from 'react';
import { motion } from 'motion/react';

export const Starburst = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path
      d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"
      fill="currentColor"
    />
  </svg>
);

export const CDIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-spin-slow opacity-50 blur-sm" />
    <div className="absolute inset-0 rounded-full border-2 border-white/20" />
    <div className="absolute inset-[35%] rounded-full border border-white/40 bg-zinc-900" />
  </div>
);

export const PixelBox = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative p-4 border-2 border-white/20 ${className}`}>
    <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400" />
    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400" />
    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400" />
    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400" />
    {children}
  </div>
);

export const FloatingGraphics = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] right-[15%] text-cyan-400/20 w-32 h-32"
      >
        <Starburst />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -40, 0],
          rotate: -15,
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[10%] text-pink-500/20 w-48 h-48"
      >
        <Starburst />
      </motion.div>

      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[5%] w-64 h-64"
      >
        <CDIcon className="w-full h-full" />
      </motion.div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
      <div className="absolute top-0 right-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-pink-500/10 to-transparent" />
    </div>
  );
};
