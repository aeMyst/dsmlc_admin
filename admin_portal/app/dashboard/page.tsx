import {
  getDashboardOverview,
  getCategoryRatings,
  getSignupSourceBreakdown,
} from "@/lib/queries/dashboard-overview";
import { getMemberGrowth } from "@/lib/queries/growth";

import { StatCard } from "@/components/ui/dashboard/stat-card";
import { AttendanceLineChart } from "@/components/features/dashboard/graphs/attendance-chart";
import { RsvpTurnoutChart } from "@/components/features/dashboard/graphs/rsvp-chart";
import { CategoryBreakdown } from "@/components/features/dashboard/graphs/category-breakdown";
import { SignupSourceChart } from "@/components/features/dashboard/graphs/signup-chart";
import { MemberGrowthChart } from "@/components/features/dashboard/graphs/member-chart";

export default async function DashboardPage() {
  const [
    { stats, attendanceOverTime, rsvpSeries },
    categoryRatings,
    sources,
    memberGrowth,
  ] = await Promise.all([
    getDashboardOverview(),
    getCategoryRatings(),
    getSignupSourceBreakdown(),
    getMemberGrowth(),
  ]);

  const rsvpChartData = rsvpSeries.map((d) => ({
    label: d.eventName,
    rsvp: d.rsvp,
    attended: d.attended,
    atDoor: d.atDoor,
  }));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Total Events"
          value={stats.totalEvents}
          caption="This semester"
        />
        <StatCard
          index={1}
          label="Total Attendees"
          value={stats.totalAttendees}
          caption="Across all events"
        />
        <StatCard
          index={2}
          label="Avg. Turnout Rate"
          value={`${stats.avgTurnoutRate}%`}
          caption={
            stats.avgTurnoutRate >= 75 ? "Strong turnout" : "Room to grow"
          }
        />
        <StatCard
          index={3}
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
          title="Avg Rating by Category"
          items={categoryRatings.map((c) => ({
            label: c.category,
            percent: (c.avgRating / 5) * 100,
            display: `★ ${c.avgRating}`,
          }))}
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-sm font-light text-white/70">
            Member Growth
          </h2>
          <MemberGrowthChart data={memberGrowth} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-sm font-light text-white/70">
          Sign-up Source
        </h2>
        <SignupSourceChart data={sources} />
      </div>
    </div>
  );
}
