"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useId } from "react";
import type React from "react";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { BRAND } from "@/lib/palette";

interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  index?: number;
  icon?: React.ReactNode;
  trend?: number[];
}

function Sparkline({ points, delay }: { points: number[]; delay: number }) {
  const shouldReduceMotion = useReducedMotion();
  const gradientId = useId();

  if (points.length < 2) return null;

  const w = 100;
  const h = 30;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * w,
    h - 3 - ((p - min) / range) * (h - 6),
  ]);
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
      initial={shouldReduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.45" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon points={area} fill={`url(#${gradientId})`} />

        <polyline
          points={line}
          fill="none"
          stroke={BRAND}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  caption,
  index = 0,
  icon,
  trend,
}: StatCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const delay = Math.min(index, 5) * 0.06;
  const hasTrend = Boolean(trend && trend.length > 1);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-[14px] border border-[#1e1e1e] bg-[#111111] px-5 pt-5 ${
        hasTrend ? "pb-14" : "pb-5"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(255,90,46,0.35) 0%, rgba(255,90,46,0) 70%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-brand">{label}</p>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[rgba(255,90,46,0.12)] text-brand">
          {icon ?? <BarChart3 className="h-3.5 w-3.5" strokeWidth={2} />}
        </div>
      </div>

      <p className="relative mt-2 text-[30px] font-extrabold leading-none text-[#f2f2f2]">
        <AnimatedNumber value={value} duration={0.9} delay={delay + 0.1} />
      </p>

      {caption && (
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
          className="relative mt-2 text-xs font-light text-[#8a8a8a]"
        >
          {caption}
        </motion.p>
      )}

      {hasTrend && <Sparkline points={trend!} delay={delay + 0.2} />}
    </motion.div>
  );
}
