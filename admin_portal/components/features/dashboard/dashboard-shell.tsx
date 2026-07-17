import type React from "react";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/features/dashboard/sidebar-nav";
import { MobileNav } from "@/components/features/dashboard/mobile-nav";
import { AccountFooter } from "@/components/features/dashboard/navbar-footer";
import { getCurrentAdmin } from "@/lib/queries/admin-profile";
import { TopBarTitle } from "@/components/features/dashboard/header";

interface DashboardShellProps {
  children: React.ReactNode;
}

export async function DashboardShell({ children }: DashboardShellProps) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-black">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-white/10 bg-neutral-950 p-6 md:flex">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/dsmlc_square_light_gradient_logo_transparent.png"
              alt="Club logo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
            />
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

        <AccountFooter
          firstName={admin?.firstName ?? null}
          lastName={admin?.lastName ?? null}
          email={admin?.email ?? ""}
        />
      </aside>

      <div className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/dsmlc_square_dark_transparent.png"
              alt="Club logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg object-contain"
            />
            <p className="text-sm font-medium text-white">{siteConfig.name}</p>
          </div>
          <MobileNav admin={admin} />
        </div>

        <div className="border-t border-white/10 px-4 py-3">
          <TopBarTitle />
        </div>
      </div>

      <div className="overflow-x-hidden md:pl-64">
        <div className="hidden items-center border-b border-white/10 px-8 py-4 md:flex">
          <TopBarTitle />
        </div>

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
