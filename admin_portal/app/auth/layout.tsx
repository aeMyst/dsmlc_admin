import type React from "react";
import { ShaderBackground } from "@/components/ui/hero/hero-section";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShaderBackground>{children}</ShaderBackground>;
}
