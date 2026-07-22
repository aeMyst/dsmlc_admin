"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full min-h-[44px] rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40 sm:w-64",
        className,
      )}
      {...props}
    />
  );
}
