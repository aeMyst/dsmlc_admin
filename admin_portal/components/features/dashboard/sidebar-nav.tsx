"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Download,
  LayoutDashboard,
  Share2,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { siteConfig } from "@/config/site";

const ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  calendar: Calendar,
  "user-check": UserCheck,
  "share-2": Share2,
  users: Users,
  download: Download,
};

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {siteConfig.dashboardNav.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "flex items-center gap-2.5 rounded-lg bg-[#F86306] px-3 py-2 text-sm font-normal text-white"
                : "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-light text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            }
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
