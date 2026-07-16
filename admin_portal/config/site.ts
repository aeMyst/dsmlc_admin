export const siteConfig = {
  name: "Analytics Dashboard",
  description: "Beautiful shader experiences.",
  orgSubtitle: "DSMLC UCalgary",
  semesterLabel: "Spring 2026 Semester",
  marketingNav: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#docs" },
  ],
  dashboardNav: [
    { label: "Overview", href: "/dashboard", icon: "layout-dashboard" },
    { label: "Events", href: "/dashboard/events", icon: "calendar" },
    { label: "Attendance", href: "/dashboard/attendance", icon: "user-check" },
    { label: "Sign-up sources", href: "/dashboard/sources", icon: "share-2" },
    { label: "Membership", href: "/dashboard/membership", icon: "users" },
    { label: "Exports", href: "/dashboard/exports", icon: "download" },
  ],
} as const