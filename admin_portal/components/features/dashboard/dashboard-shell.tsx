import type React from "react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/features/dashboard/sidebar-nav";
import { MobileNav } from "@/components/features/dashboard/mobile-nav";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-black">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-white/10 bg-neutral-950 p-6 md:flex">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F86306]">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <div>
              <p className="text-sm font-medium leading-tight text-white">
                {siteConfig.name}
              </p>
              <p className="text-xs font-light leading-tight text-white/40">
                {siteConfig.orgSubtitle}
              </p>
            </div>
          </div>

          <SidebarNav />
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
            AD
          </span>
          <div>
            <p className="text-sm font-light text-white">Admin</p>
            <Link
              href="/"
              className="text-xs font-light text-white/40 transition-colors hover:text-white/70"
            >
              Log out
            </Link>
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-neutral-950 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F86306]">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <p className="text-sm font-medium text-white">{siteConfig.name}</p>
        </div>
        <MobileNav />
      </div>

      <div className="md:pl-64">
        <div className="hidden items-center justify-end border-b border-white/10 px-8 py-4 md:flex">
          <span className="text-xs font-light text-white/40">
            {siteConfig.semesterLabel}
          </span>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
