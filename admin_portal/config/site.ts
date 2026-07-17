export const siteConfig = {
  name: "Analytics Dashboard",
  description: "Beautiful shader experiences.",
  orgSubtitle: "DSMLC UCalgary",
  dashboardNav: [
    { label: "Overview", href: "/dashboard", icon: "layout-dashboard" },
    { label: "Events", href: "/dashboard/events", icon: "calendar" },
    { label: "Memberships", href: "/dashboard/memberships", icon: "users" },
    { label: "People", href: "/dashboard/people", icon: "id-card" },
  ],
} as const