"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: string | number;
  /** Seconds. Kept short per UX guidance (micro-interactions ~0.2-0.8s). */
  duration?: number;
  /** Optional stagger delay in seconds. */
  delay?: number;
}

/**
 * Renders a value like "82%", "★ 4.8", or 128 and animates the numeric
 * portion from 0 -> target on mount, keeping any prefix/suffix text static.
 * Falls back to a static render when the value has no numeric part, or when
 * the user has requested reduced motion.
 */
export function AnimatedNumber({ value, duration = 0.8, delay = 0 }: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const strValue = String(value);
  const match = strValue.match(/-?\d+(\.\d+)?/);

  const prefix = match ? strValue.slice(0, match.index) : strValue;
  const suffix = match ? strValue.slice((match.index ?? 0) + match[0].length) : "";
  const target = match ? parseFloat(match[0]) : null;
  const decimals = match && match[0].includes(".") ? match[0].split(".")[1].length : 0;

  useEffect(() => {
    if (target === null || !spanRef.current) return;

    const node = spanRef.current;

    if (shouldReduceMotion) {
      node.textContent = target.toFixed(decimals);
      return;
    }

    node.textContent = (0).toFixed(decimals);
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = latest.toFixed(decimals);
      },
    });

    return () => controls.stop();
  }, [target, decimals, duration, delay, shouldReduceMotion]);

  if (target === null) {
    return <>{strValue}</>;
  }

  return (
    <>
      {prefix}
      <span ref={spanRef}>0</span>
      {suffix}
    </>
  );
}
