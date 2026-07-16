import type React from "react";

import { DashboardShell } from "@/components/features/dashboard/dashboard_shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
