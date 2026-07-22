"use client";

import { motion, useReducedMotion } from "framer-motion";

import { AnimatedNumber } from "@/components/motion/animated-number";

interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  /** Position in a row of stat cards, used to stagger the entrance. */
  index?: number;
}

export function StatCard({ label, value, caption, index = 0 }: StatCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const delay = Math.min(index, 5) * 0.06;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <p className="text-xs font-light text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-light text-white">
        <AnimatedNumber value={value} delay={delay + 0.1} />
      </p>
      {caption && (
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
          className="mt-1 text-xs font-light text-white/40"
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
