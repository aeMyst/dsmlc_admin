"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
  delay?: number;
}

export function AnimatedNumber({
  value,
  duration = 2,
  delay = 5,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const strValue = String(value);
  const match = strValue.match(/-?\d+(\.\d+)?/);

  const prefix = match ? strValue.slice(0, match.index) : strValue;
  const suffix = match
    ? strValue.slice((match.index ?? 0) + match[0].length)
    : "";
  const target = match ? parseFloat(match[0]) : null;
  const decimals =
    match && match[0].includes(".") ? match[0].split(".")[1].length : 0;

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
