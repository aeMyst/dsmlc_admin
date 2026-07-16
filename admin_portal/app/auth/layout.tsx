import type React from "react";
import { ShaderBackground } from "@/components/ui/hero/hero_section";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShaderBackground>{children}</ShaderBackground>;
}
