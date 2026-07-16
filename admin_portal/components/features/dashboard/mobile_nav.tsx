"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/features/dashboard/sidebar_nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

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
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:text-white"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col justify-between border-r border-white/10 bg-neutral-950 p-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
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

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>

              <SidebarNav />
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 pt-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
                AD
              </span>
              <div>
                <p className="text-sm font-light text-white">Admin</p>
                <a
                  href="/"
                  className="text-xs font-light text-white/40 transition-colors hover:text-white/70"
                >
                  Log out
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
