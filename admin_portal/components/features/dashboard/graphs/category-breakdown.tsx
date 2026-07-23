"use client";

import { motion, useReducedMotion } from "framer-motion";

import { barGradient, colorForIndex } from "@/lib/palette";

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
    <div className="rounded-[14px] border border-[#1e1e1e] bg-[#111111] p-6">
      <h2 className="mb-5 text-sm font-light text-[#9a9a9a]">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-light text-[#d0d0d0]">{item.label}</span>
              <span className="font-light text-[#8a8a8a]">{item.display}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1e1e1e]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundImage: barGradient(colorForIndex(index)) }}
                initial={shouldReduceMotion ? false : { width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{
                  duration: 0.9,
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
