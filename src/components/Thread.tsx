"use client";

import { motion } from "framer-motion";

export function Thread({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 220 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="threadGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--purple)" />
          <stop offset="100%" stopColor="var(--emerald)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d="M 20 55 Q 110 10, 200 55"
        stroke="url(#threadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      <motion.circle
        cx="20"
        cy="55"
        r="7"
        fill="var(--purple)"
        filter="url(#glow)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.circle
        cx="200"
        cy="55"
        r="7"
        fill="var(--emerald)"
        filter="url(#glow)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />

      <motion.circle
        r="4"
        fill="white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, delay: 1.2, repeat: Infinity, repeatDelay: 1.4 }}
      >
        <animateMotion
          dur="1.6s"
          begin="1.2s"
          repeatCount="indefinite"
          path="M 20 55 Q 110 10, 200 55"
        />
      </motion.circle>
    </svg>
  );
}
