import {
  getOverviewStats,
  getAttendanceOverTime,
  getRsvpVsAttendedSeries,
  getCategoryBreakdown,
  getCategoryRatings,
} from "@/lib/dashboard";

import { PageHeader } from "@/components/ui/dashboard/header";
import { StatCard } from "@/components/ui/dashboard/stat-card";
import { AttendanceLineChart } from "@/components/features/dashboard/attendance-chart";
import { RsvpTurnoutChart } from "@/components/features/dashboard/rsvp-chart";
import { CategoryBreakdown } from "@/components/features/dashboard/category-breakdown";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const [stats, attendanceOverTime, rsvpSeries, categories, categoryRatings] =
    await Promise.all([
      getOverviewStats(),
      getAttendanceOverTime(),
      getRsvpVsAttendedSeries(),
      getCategoryBreakdown(),
      getCategoryRatings(),
    ]);

  const rsvpChartData = rsvpSeries.map((d) => ({
    label: formatShortDate(d.date),
    rsvp: d.rsvp,
    attended: d.attended,
  }));

  const maxCategoryCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of club event performance this semester"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          caption="This semester"
        />
        <StatCard
          label="Total Attendees"
          value={stats.totalAttendees}
          caption="Across all events"
        />
        <StatCard
          label="Avg. Turnout Rate"
          value={`${stats.avgTurnoutRate}%`}
          caption={
            stats.avgTurnoutRate >= 75 ? "Strong turnout" : "Room to grow"
          }
        />
        <StatCard
          label="Avg. Rating"
          value={`★ ${stats.avgRating}`}
          caption="Out of 5.0"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-sm font-light text-white/70">
            Attendance Over Time
          </h2>
          <AttendanceLineChart data={attendanceOverTime} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-sm font-light text-white/70">
            RSVP vs. Actual Turnout
          </h2>
          <RsvpTurnoutChart data={rsvpChartData} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdown
          title="Events by Category"
          items={categories.map((c) => ({
            label: c.category,
            percent: (c.count / maxCategoryCount) * 100,
            display: `${c.count} · ${c.percent}%`,
          }))}
        />

        <CategoryBreakdown
          title="Avg Rating by Category"
          items={categoryRatings.map((c) => ({
            label: c.category,
            percent: (c.avgRating / 5) * 100,
            display: `★ ${c.avgRating}`,
          }))}
        />
      </div>
    </div>
  );
}
