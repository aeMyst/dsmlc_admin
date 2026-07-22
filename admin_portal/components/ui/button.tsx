"use client";

import { useFormStatus } from "react-dom";
import type React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline";

const BASE =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand font-normal text-white hover:bg-brand-hover",
  secondary:
    "border border-white/15 font-light text-white/70 hover:bg-white/5 hover:text-white",
  outline:
    "gap-2 border border-white/15 font-light text-white/70 hover:border-white/30 hover:text-white",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(BASE, VARIANTS[variant], className)} {...props} />
  );
}

interface TriggerLabelProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

export function TriggerLabel({
  variant = "primary",
  className,
  children,
}: TriggerLabelProps) {
  return (
    <span className={cn(BASE, VARIANTS[variant], className)}>{children}</span>
  );
}

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: ButtonVariant;
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
