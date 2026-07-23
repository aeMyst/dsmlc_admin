"use client";

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
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div>
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
            {revealed ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
