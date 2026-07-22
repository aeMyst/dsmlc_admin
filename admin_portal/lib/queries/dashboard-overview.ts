import { createClient } from "@/lib/supabase/server"
import { getEventsWithStats } from "@/lib/queries/events"

function round(value: number, decimals = 0) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export interface OverviewStats {
  totalEvents: number
  totalAttendees: number
  avgTurnoutRate: number
  avgRating: number
}

export interface AttendancePoint {
  date: string
  attended: number
  label: string
}

export interface RsvpPoint {
  date: string
  eventName: string
  rsvp: number
  attended: number
  atDoor: number
}

export interface DashboardOverview {
  stats: OverviewStats
  attendanceOverTime: AttendancePoint[]
  rsvpSeries: RsvpPoint[]
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const events = await getEventsWithStats()

  const totalEvents = events.length
  const totalAttendees = events.reduce((sum, e) => sum + e.attended, 0)
  const avgTurnoutRate =
    totalEvents > 0
      ? round(events.reduce((sum, e) => sum + e.turnoutRate, 0) / totalEvents)
      : 0

  const ratedEvents = events.filter((e) => e.avgRating !== null)
  const avgRating =
    ratedEvents.length > 0
      ? round(
          ratedEvents.reduce((sum, e) => sum + (e.avgRating ?? 0), 0) / ratedEvents.length,
          1
        )
      : 0

  const chronological = [...events].sort((a, b) => (a.event_date < b.event_date ? -1 : 1))

  return {
    stats: { totalEvents, totalAttendees, avgTurnoutRate, avgRating },
    attendanceOverTime: chronological.map((e) => ({
      date: e.event_date,
      attended: e.attended,
      label: e.event_name,
    })),
    rsvpSeries: chronological.map((e) => ({
      date: e.event_date,
      eventName: e.event_name,
      rsvp: e.rsvp,
      attended: e.attended,
      atDoor: e.atDoor,
    })),
  }
}

export interface CategoryRating {
  category: string
  avgRating: number
}

export async function getCategoryRatings(): Promise<CategoryRating[]> {
  const supabase = await createClient()

  const [{ data: events }, { data: feedback }] = await Promise.all([
    supabase.from("EVENTS").select("event_id, event_type"),
    supabase.from("FEEDBACK").select("event_id, rating"),
  ])

  const eventTypeById = new Map((events ?? []).map((e) => [e.event_id, e.event_type]))

  const sums = new Map<string, { total: number; count: number }>()
  for (const f of feedback ?? []) {
    const category = eventTypeById.get(f.event_id)
    if (!category) continue
    const entry = sums.get(category) ?? { total: 0, count: 0 }
    entry.total += f.rating
    entry.count += 1
    sums.set(category, entry)
  }

  return Array.from(sums, ([category, { total, count }]) => ({
    category,
    avgRating: round(total / count, 1),
  })).sort((a, b) => b.avgRating - a.avgRating)
}

export interface SignupSource {
  source: string
  count: number
}

export async function getSignupSourceBreakdown(): Promise<SignupSource[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("REGISTRATIONS").select("coming_from")

  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    const key = row.coming_from?.trim() || "Unknown"
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts, ([source, count]) => ({ source, count })).sort(
    (a, b) => b.count - a.count
  )
}