"use client";

import Image from "next/image";
import { LoginForm } from "@/components/features/auth/login-form";

export function AuthCard() {
  return (
    <div className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-[#1e1e1e] backdrop-blur-xl bg-[#0d0d0d]/95 md:grid-cols-2">
      {/* Brand gradient hairline along the top edge */}
      <div
        aria-hidden="true"
        className="absolute left-1 right-1 top-0 h-px rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #ff5a2e, transparent)",
        }}
      />

      {/* logo section */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden border-b border-[#1e1e1e] p-10 md:border-b-0 md:border-r md:p-16">
        <Image
          src="/dsmlc_square_dark_transparent.png"
          alt="Organization logo"
          width={400}
          height={120}
          priority
          className="relative z-10 h-auto w-full max-w-xs md:max-w-sm"
        />

        <p className="relative z-10 mt-6 max-w-xs text-center text-sm font-light leading-relaxed text-[#9a9a9a] md:text-base">
          Event & Membership Analytics Dashboard
        </p>

        <p className="relative z-10 mt-6 text-xs font-light text-[#666]">
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
