import { Calendar, Star, TrendingUp, Users } from "lucide-react";

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
    { stats, attendanceOverTime, rsvpSeries, trends },
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
          icon={<Calendar className="h-3.5 w-3.5" strokeWidth={2} />}
          trend={trends.events}
        />
        <StatCard
          index={1}
          label="Total Attendees"
          value={stats.totalAttendees}
          caption="Across all events"
          icon={<Users className="h-3.5 w-3.5" strokeWidth={2} />}
          trend={trends.attendees}
        />
        <StatCard
          index={2}
          label="Avg. Turnout Rate"
          value={`${stats.avgTurnoutRate}%`}
          caption={
            stats.avgTurnoutRate >= 75 ? "Strong turnout" : "Room to grow"
          }
          icon={<TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />}
          trend={trends.turnout}
        />
        <StatCard
          index={3}
          label="Avg. Rating"
          value={`★ ${stats.avgRating}`}
          caption="Out of 5.0"
          icon={<Star className="h-3.5 w-3.5" strokeWidth={2} />}
          trend={trends.rating}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-[#1e1e1e] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-light text-[#9a9a9a]">
            Attendance Over Time
          </h2>
          <AttendanceLineChart data={attendanceOverTime} />
        </div>

        <div className="rounded-[14px] border border-[#1e1e1e] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-light text-[#9a9a9a]">
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

        <div className="rounded-[14px] border border-[#1e1e1e] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-light text-[#9a9a9a]">
            Member Growth
          </h2>
          <MemberGrowthChart data={memberGrowth} />
        </div>
      </div>

      <div className="mt-6 rounded-[14px] border border-[#1e1e1e] bg-[#111111] p-6">
        <h2 className="mb-4 text-sm font-light text-[#9a9a9a]">
          Sign-up Source
        </h2>
        <SignupSourceChart data={sources} />
      </div>
    </div>
  );
}
