import { createClient } from "@/lib/supabase/server"

export interface EventWithStats {
  event_id: string
  event_name: string
  event_date: string
  event_type: string
  rsvp: number
  attended: number
  atDoor: number
  turnoutRate: number
  avgRating: number | null
}

function isAttendedStatus(status: string) {
  return status === "attended" || status === "at-door"
}

export async function getEventsWithStats(): Promise<EventWithStats[]> {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from("EVENTS")
    .select("event_id, event_name, event_date, event_type")
    .order("event_date", { ascending: false })

  if (error || !events) return []

  const { data: registrations } = await supabase.from("REGISTRATIONS").select("event_id, status")
  const { data: feedback } = await supabase.from("FEEDBACK").select("event_id, rating")

  return events.map((event) => {
    const eventRegs = (registrations ?? []).filter((r) => r.event_id === event.event_id)

    const atDoor = eventRegs.filter((r) => r.status === "at-door").length
    const attendedFromRsvp = eventRegs.filter((r) => r.status === "attended").length
    const attended = attendedFromRsvp + atDoor
    const rsvp = eventRegs.length - atDoor

    const eventFeedback = (feedback ?? []).filter((f) => f.event_id === event.event_id)
    const avgRating =
      eventFeedback.length > 0
        ? Math.round((eventFeedback.reduce((sum, f) => sum + f.rating, 0) / eventFeedback.length) * 10) / 10
        : null

    return {
      ...event,
      rsvp,
      attended,
      atDoor,
      turnoutRate: rsvp > 0 ? Math.round((attendedFromRsvp / rsvp) * 100) : 0,
      avgRating,
    }
  })
}

export async function getEventDetail(eventId: string): Promise<EventWithStats | null> {
  const events = await getEventsWithStats()
  return events.find((e) => e.event_id === eventId) ?? null
}

export interface FeedbackRow {
  feedback_id: string
  rating: number
  comment: string | null
  created_at: string
}

export async function getEventFeedback(eventId: string): Promise<FeedbackRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("FEEDBACK")
    .select("feedback_id, rating, comment, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
  return data ?? []
}

export interface RetentionGroup {
  total: number
  attended: number
  rate: number
}

export interface CourseRetentionStats {
  courseGroup: RetentionGroup
  generalGroup: RetentionGroup
}

export async function getCourseRetention(eventId: string): Promise<CourseRetentionStats> {
  const supabase = await createClient()
  const { data } = await supabase.from("REGISTRATIONS").select("status, course_name").eq("event_id", eventId)

  const rows = data ?? []
  const courseRows = rows.filter((r) => r.course_name !== null)
  const generalRows = rows.filter((r) => r.course_name === null)

  function summarize(group: typeof rows): RetentionGroup {
    const total = group.length
    const attended = group.filter((r) => isAttendedStatus(r.status)).length
    return { total, attended, rate: total > 0 ? Math.round((attended / total) * 100) : 0 }
  }

  return {
    courseGroup: summarize(courseRows),
    generalGroup: summarize(generalRows),
  }
}