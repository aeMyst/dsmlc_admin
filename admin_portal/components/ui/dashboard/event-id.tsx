"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyableIdProps {
  value: string;
  label?: string;
}

export function CopyableId({ value, label }: CopyableIdProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-light text-white/60 transition-colors hover:border-white/30 hover:text-white"
    >
      {label && <span className="shrink-0 text-white/40">{label}</span>}
      <span className="max-w-[96px] truncate font-mono sm:max-w-none">
        {value}
      </span>
      {copied ? (
        <Check
          className="h-3.5 w-3.5 shrink-0 text-green-400"
          strokeWidth={2}
        />
      ) : (
        <Copy
          className="h-3.5 w-3.5 shrink-0 text-white/40 transition-colors group-hover:text-white/70"
          strokeWidth={1.75}
        />
      )}
    </button>
  );
}
