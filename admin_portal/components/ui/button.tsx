"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useFormStatus } from "react-dom";
import type React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline";

const BASE =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "accent-gradient font-bold text-white shadow-[0_0px_15px_-2px_rgba(255,90,46,0.65)]",
  secondary:
    "border border-[#2a2a2a] font-light text-[#c0c0c0] hover:bg-white/5 hover:text-white",
  outline:
    "gap-2 border border-[#2a2a2a] font-light text-[#c0c0c0] hover:border-white/30 hover:text-white",
};

type OmittedForMotion =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  OmittedForMotion
> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(BASE, VARIANTS[variant], className)}
      {...props}
    />
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(BASE, VARIANTS[variant], className)}
    >
      {children}
    </motion.span>
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
