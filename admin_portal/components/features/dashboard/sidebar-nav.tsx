"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { NAV_ICONS } from "@/lib/nav-icons";

export function SidebarNav() {
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
                ? "flex items-center gap-3 rounded-lg bg-[#F86306] px-4 py-3 text-base font-normal text-white"
                : "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-light text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            }
          >
            {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
