"use client";

import Image from "next/image";
import { LoginForm } from "@/components/features/auth/login-form";

export function AuthCard() {
  return (
    <div className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl bg-black/90 md:grid-cols-2">
      <div className="absolute left-1 right-1 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* logo section */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden border-b border-white/10 p-10 md:border-b-0 md:border-r md:p-16">
        <Image
          src="/dsmlc_square_dark_transparent.png"
          alt="Organization logo"
          width={400}
          height={120}
          priority
          className="relative z-10 h-auto w-full max-w-xs md:max-w-sm"
        />

        <p className="relative z-10 mt-6 max-w-xs text-center text-sm font-light leading-relaxed text-white/50 md:text-base">
          Event & Membership Analytics Dashboard
        </p>

        <p className="relative z-10 mt-6 text-xs font-light text-white/30">
          DSMLC © {new Date().getFullYear()} — All rights reserved
        </p>
      </div>

      {/* login section */}
      <div className="flex items-center p-10 md:p-16">
        <LoginForm />
      </div>
    </div>
  );
}
