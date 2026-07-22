import type React from "react";

import { cn } from "@/lib/utils";

const LABEL_CLASS = "mb-1.5 block text-xs font-light text-white/60";

const CONTROL_CLASS =
  "min-h-[44px] w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40";

const OPTION_CLASS = "bg-white text-black";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({
  label,
  className,
  id,
  name,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        className={cn(CONTROL_CLASS, className)}
        {...props}
      />
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({
  label,
  options,
  placeholder,
  className,
  id,
  name,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        id={fieldId}
        name={name}
        className={cn(CONTROL_CLASS, className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className={OPTION_CLASS}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={OPTION_CLASS}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
