"use client";

import { motion, useReducedMotion } from "framer-motion";

import { colorForIndex } from "@/lib/palette";

interface BreakdownItem {
  label: string;
  percent: number;
  display: string;
}

interface CategoryBreakdownProps {
  title: string;
  items: BreakdownItem[];
}

export function CategoryBreakdown({ title, items }: CategoryBreakdownProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-5 text-sm font-light text-white/70">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-light text-white/80">{item.label}</span>
              <span className="font-light text-white/50">{item.display}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colorForIndex(index) }}
                initial={shouldReduceMotion ? false : { width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(index, 6) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
