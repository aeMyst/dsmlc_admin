"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { NAV_ICONS } from "@/lib/nav-icons";

interface SidebarNavProps {
  /**
   * Distinguishes the desktop sidebar from the mobile drawer instance so
   * their sliding active-pill layout animations don't collide — both can be
   * mounted in the DOM at once (the drawer is only hidden via CSS/transform).
   */
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
                ? "relative flex items-center gap-3 rounded-lg px-4 py-3 text-base font-normal text-white"
                : "relative flex items-center gap-3 rounded-lg px-4 py-3 text-base font-light text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            }
          >
            {isActive && (
              <motion.span
                layoutId={`sidebar-active-pill-${instanceId}`}
                className="absolute inset-0 -z-10 rounded-lg bg-brand"
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
