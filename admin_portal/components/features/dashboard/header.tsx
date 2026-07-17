"use client";

import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { NAV_ICONS } from "@/lib/nav-icons";

const DESCRIPTIONS: Record<string, string> = {
  "/dashboard": "Overview of club event performance this semester",
  "/dashboard/events":
    "Browse events, view details, and export registration data",
  "/dashboard/memberships": "Manage club members and mailing list subscribers",
  "/dashboard/people": "Everyone on record, plus course-credit exports",
};

function resolveTitle(pathname: string) {
  const exactMatch = siteConfig.dashboardNav.find(
    (item) => item.href === pathname,
  );
  if (exactMatch) {
    return {
      title: exactMatch.label,
      description: DESCRIPTIONS[pathname],
      Icon: NAV_ICONS[exactMatch.icon],
    };
  }

  if (pathname.startsWith("/dashboard/events/")) {
    return {
      title: "Event Details",
      description: "Attendance, turnout, and feedback for this event",
      Icon: NAV_ICONS.calendar,
    };
  }

  return {
    title: "Dashboard",
    description: undefined,
    Icon: NAV_ICONS["layout-dashboard"],
  };
}

export function TopBarTitle() {
  const pathname = usePathname();
  const { title, description, Icon } = resolveTitle(pathname);

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {Icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 md:h-12 md:w-12">
          <Icon
            className="h-5 w-5 text-[#F86306] md:h-6 md:w-6"
            strokeWidth={1.75}
          />
        </span>
      )}
      <div>
        <h1 className="text-lg font-normal leading-tight text-white md:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-xs font-light leading-tight text-white/40 md:text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
