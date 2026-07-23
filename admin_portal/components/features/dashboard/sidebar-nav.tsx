"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { NAV_ICONS } from "@/lib/nav-icons";

interface SidebarNavProps {
  instanceId?: string;
}

export function SidebarNav({ instanceId = "desktop" }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {siteConfig.dashboardNav.map((item) => {
        const Icon = NAV_ICONS[item.icon];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "relative flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-white"
                : "relative flex items-center gap-3 rounded-full px-4 py-3 text-sm font-light text-[#9a9a9a] transition-colors hover:bg-white/5 hover:text-white"
            }
          >
            {isActive && (
              <motion.span
                layoutId={`sidebar-active-pill-${instanceId}`}
                className="accent-gradient accent-glow absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
              />
            )}
            {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
