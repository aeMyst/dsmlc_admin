import {
  mockEvents,
  mockFeedback,
  mockMemberships,
  mockPeople,
  mockRegistrations,
} from "@/lib/dashboard_data"

function findPerson(peopleId: string) {
  const person = mockPeople.find((p) => p.people_id === peopleId)
  if (!person) throw new Error(`Unknown person: ${peopleId}`)
  return person
}

function findEvent(eventId: string) {
  const event = mockEvents.find((e) => e.event_id === eventId)
  if (!event) throw new Error(`Unknown event: ${eventId}`)
  return event
}

function round(value: number, decimals = 0) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/** Q1 — Who attended a given event */
export async function getEventAttendees(eventId: string) {
  return mockRegistrations
    .filter((r) => r.event_id === eventId)
    .map((r) => ({ ...r, people: findPerson(r.people_id) }))
}

/** Q2 — Feedback for a given event (anonymous — no attendee link) */
export async function getEventFeedback(eventId: string) {
  return mockFeedback
    .filter((f) => f.event_id === eventId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
}

/** All events, most recent first */
export async function getEvents() {
  return [...mockEvents].sort((a, b) => (a.event_date < b.event_date ? 1 : -1))
}

/** Events enriched with RSVP/attended/turnout/rating — powers the Events table */
export async function getEventsWithStats() {
  const events = [...mockEvents].sort((a, b) => (a.event_date < b.event_date ? 1 : -1))

  return events.map((event) => {
    const registrations = mockRegistrations.filter((r) => r.event_id === event.event_id)
    const attended = registrations.filter((r) => r.status === "attended").length
    const rsvp = registrations.length
    const feedback = mockFeedback.filter((f) => f.event_id === event.event_id)
    const avgRating =
      feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : null

    return {
      ...event,
      rsvp,
      attended,
      turnoutRate: rsvp > 0 ? round((attended / rsvp) * 100) : 0,
      avgRating: avgRating !== null ? round(avgRating, 1) : null,
    }
  })
}

/** Top-level KPI cards for the Overview page */
export async function getOverviewStats() {
  const eventsWithStats = await getEventsWithStats()

  const totalEvents = eventsWithStats.length
  const totalAttendees = eventsWithStats.reduce((sum, e) => sum + e.attended, 0)
  const avgTurnoutRate =
    totalEvents > 0
      ? round(eventsWithStats.reduce((sum, e) => sum + e.turnoutRate, 0) / totalEvents)
      : 0
  const ratedEvents = eventsWithStats.filter((e) => e.avgRating !== null)
  const avgRating =
    ratedEvents.length > 0
      ? round(ratedEvents.reduce((sum, e) => sum + (e.avgRating ?? 0), 0) / ratedEvents.length, 1)
      : 0

  return { totalEvents, totalAttendees, avgTurnoutRate, avgRating }
}

/** Attendance over time — one point per event, in date order */
export async function getAttendanceOverTime() {
  const eventsWithStats = await getEventsWithStats()
  return [...eventsWithStats]
    .sort((a, b) => (a.event_date < b.event_date ? -1 : 1))
    .map((e) => ({ date: e.event_date, attended: e.attended, label: e.event_name }))
}

/** RSVP vs Attended per event, in date order — powers the grouped bar chart */
export async function getRsvpVsAttendedSeries() {
  const eventsWithStats = await getEventsWithStats()
  return [...eventsWithStats]
    .sort((a, b) => (a.event_date < b.event_date ? -1 : 1))
    .map((e) => ({ date: e.event_date, rsvp: e.rsvp, attended: e.attended }))
}

/** RSVP vs Attended for a single event — powers the Event Detail chart */
export async function getEventRsvpVsAttended(eventId: string) {
  const registrations = mockRegistrations.filter((r) => r.event_id === eventId)
  const attended = registrations.filter((r) => r.status === "attended").length
  return { rsvp: registrations.length, attended }
}

/** Events grouped by category — count + share of total events */
export async function getCategoryBreakdown() {
  const total = mockEvents.length
  const counts = new Map<string, number>()
  for (const event of mockEvents) {
    counts.set(event.event_type, (counts.get(event.event_type) ?? 0) + 1)
  }

  return Array.from(counts, ([category, count]) => ({
    category,
    count,
    percent: total > 0 ? round((count / total) * 100) : 0,
  })).sort((a, b) => b.count - a.count)
}

/** Average feedback rating grouped by event category */
export async function getCategoryRatings() {
  const sums = new Map<string, { total: number; count: number }>()

  for (const feedback of mockFeedback) {
    const event = mockEvents.find((e) => e.event_id === feedback.event_id)
    if (!event) continue
    const entry = sums.get(event.event_type) ?? { total: 0, count: 0 }
    entry.total += feedback.rating
    entry.count += 1
    sums.set(event.event_type, entry)
  }

  return Array.from(sums, ([category, { total, count }]) => ({
    category,
    avgRating: round(total / count, 1),
  })).sort((a, b) => b.avgRating - a.avgRating)
}

/** Q3 — Students attending for course-collaboration bonus marks */
export async function getCourseCreditAttendance() {
  return mockRegistrations
    .filter((r) => r.course_name !== null)
    .map((r) => ({
      ...r,
      people: findPerson(r.people_id),
      events: findEvent(r.event_id),
    }))
    .sort((a, b) => (a.registered_at < b.registered_at ? 1 : -1))
}

/** Q4/5 — Sign-up source breakdown (Instagram, LinkedIn, other, ...) */
export async function getSignupSourceBreakdown() {
  const counts = new Map<string, number>()
  for (const row of mockRegistrations) {
    const key = row.coming_from?.trim() || "Unknown"
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts, ([source, count]) => ({ source, count })).sort(
    (a, b) => b.count - a.count
  )
}

/** Q5 — Mailing list size */
export async function getMailingListStats() {
  const total = mockMemberships.length
  const subscribed = mockMemberships.filter((m) => m.mailing).length
  return { total, subscribed }
}

/** Q6 — Registration trends over time, bucketed by month */
export async function getRegistrationTrends() {
  const buckets = new Map<string, number>()
  for (const row of mockRegistrations) {
    const month = row.registered_at.slice(0, 7)
    buckets.set(month, (buckets.get(month) ?? 0) + 1)
  }

  return Array.from(buckets, ([month, registrations]) => ({ month, registrations })).sort(
    (a, b) => (a.month < b.month ? -1 : 1)
  )
}

/** Q7 — Rows for the export page; filters applied by the caller */
export async function getExportableRegistrations(filters?: {
  eventId?: string
  courseOnly?: boolean
}) {
  return mockRegistrations
    .filter((r) => (filters?.eventId ? r.event_id === filters.eventId : true))
    .filter((r) => (filters?.courseOnly ? r.course_name !== null : true))
    .map((r) => ({
      ...r,
      people: findPerson(r.people_id),
      events: findEvent(r.event_id),
    }))
}