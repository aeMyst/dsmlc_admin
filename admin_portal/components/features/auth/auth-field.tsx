"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type React from "react";

interface AuthFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  labelAction?: React.ReactNode;
  minLength?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  index?: number;
}

export function AuthField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
  autoComplete,
  icon,
  labelAction,
  minLength,
  onChange,
  index = 0,
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index, 5) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={name} className="text-xs font-medium text-[#c0c0c0]">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a]">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          minLength={minLength}
          onChange={onChange}
          className={`min-h-[46px] w-full rounded-full border border-[#262626] bg-[#141414] py-2.5 text-sm text-[#f2f2f2] outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-brand ${
            icon ? "pl-11" : "pl-4"
          } ${isPassword ? "pr-11" : "pr-4"}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a] transition-colors hover:text-[#f2f2f2]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {revealed ? (
                <motion.span
                  key="hide"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.6 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6 }
                  }
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex"
                >
                  <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="show"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.6 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6 }
                  }
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex"
                >
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </motion.div>
  );
}
