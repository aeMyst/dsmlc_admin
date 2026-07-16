"use client";

import { PulsingBorder, MeshGradient } from "@paper-design/shaders-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

const GRADIENT_COLORS = ["#1A1A1A", "#8B4513", "#1A1A1A", "#FFFFFF", "#1A1A1A"];

export function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* SVG Filters */}
      <svg className="absolute inset-0 h-0 w-0">
        <defs>
          <filter
            id="glass-effect"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders */}
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={GRADIENT_COLORS}
        speed={0.3}
      />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-60"
        colors={[...GRADIENT_COLORS].reverse()}
        speed={0.2}
        distortion={0.8}
      />

      {children}
    </div>
  );
}

export function Header() {
  return (
    <header className="relative z-10 flex items-center p-6">
      <Image
        src="/dsmlc_long_dark_transparent.png"
        alt="Organization logo"
        width={250}
        height={250}
        priority
      />
    </header>
  );
}
