"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/features/dashboard/sidebar-nav";
import { AccountFooter } from "@/components/features/dashboard/navbar-footer";
import type { CurrentAdmin } from "@/lib/queries/admin-profile";

interface MobileNavProps {
  admin: CurrentAdmin | null;
}

export function MobileNav({ admin }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2a2a2a] text-[#c0c0c0] transition-colors hover:text-white"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div
        className={`fixed inset-0 z-50 overflow-hidden md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col justify-between border-l border-[#1e1e1e] bg-[#0a0a0a] p-6 transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg">
                  <Image
                    src="/dsmlc_square_light_gradient_logo_transparent.png"
                    alt="Club logo"
                    width={26}
                    height={26}
                    className="h-[26px] w-[26px] object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-[#f2f2f2]">
                    {siteConfig.name}
                  </p>
                  <p className="text-xs font-light leading-tight text-[#8a8a8a]">
                    {siteConfig.orgSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                tabIndex={open ? 0 : -1}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#8a8a8a] transition-colors hover:text-white"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <SidebarNav instanceId="mobile" />
          </div>

          <AccountFooter
            firstName={admin?.firstName ?? null}
            lastName={admin?.lastName ?? null}
            email={admin?.email ?? ""}
          />
        </div>
      </div>
    </>
  );
}
