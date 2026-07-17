import { createClient } from "@/lib/supabase/server"

export interface RegistrationRow {
  registration_id: string
  status: string
  course_name: string | null
  coming_from: string | null
  registered_at: string
  people_id: string
  first_name: string
  last_name: string
  email: string
  student_id: string | null
  major: string | null
  event_id: string
  event_name: string
  event_date: string
  event_type: string
}

export async function getRegistrations(): Promise<RegistrationRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("REGISTRATIONS")
    .select(
      "registration_id, status, course_name, coming_from, registered_at, people_id, event_id, PEOPLE(first_name, last_name, email, student_id, major), EVENTS(event_name, event_date, event_type)"
    )
    .order("registered_at", { ascending: false })

  if (error || !data) return []

  return data
    .map((row: any) => {
      const person = Array.isArray(row.PEOPLE) ? row.PEOPLE[0] : row.PEOPLE
      const event = Array.isArray(row.EVENTS) ? row.EVENTS[0] : row.EVENTS
      if (!person || !event) return null
      return {
        registration_id: row.registration_id,
        status: row.status,
        course_name: row.course_name,
        coming_from: row.coming_from,
        registered_at: row.registered_at,
        people_id: row.people_id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        student_id: person.student_id,
        major: person.major,
        event_id: row.event_id,
        event_name: event.event_name,
        event_date: event.event_date,
        event_type: event.event_type,
      } satisfies RegistrationRow
    })
    .filter((r): r is RegistrationRow => r !== null)
}

export interface PersonOption {
  people_id: string
  first_name: string
  last_name: string
}

export interface EventOption {
  event_id: string
  event_name: string
}

export async function getPeopleOptions(): Promise<PersonOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("PEOPLE")
    .select("people_id, first_name, last_name")
    .order("first_name")
  return data ?? []
}

export async function getEventOptions(): Promise<EventOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("EVENTS")
    .select("event_id, event_name")
    .order("event_date", { ascending: false })
  return data ?? []
}

export interface EventCourseCreditRow {
  registration_id: string
  first_name: string
  last_name: string
  email: string
  student_id: string | null
  major: string | null
  course_name: string
  status: string
  registered_at: string
}

export async function getEventCourseCreditRegistrations(eventId: string): Promise<EventCourseCreditRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("REGISTRATIONS")
    .select(
      "registration_id, course_name, status, registered_at, PEOPLE(first_name, last_name, email, student_id, major)"
    )
    .eq("event_id", eventId)
    .not("course_name", "is", null)
    .order("registered_at", { ascending: false })

  if (error || !data) return []

  return data
    .map((row: any) => {
      const person = Array.isArray(row.PEOPLE) ? row.PEOPLE[0] : row.PEOPLE
      if (!person || !row.course_name) return null
      return {
        registration_id: row.registration_id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        student_id: person.student_id,
        major: person.major,
        course_name: row.course_name,
        status: row.status,
        registered_at: row.registered_at,
      } satisfies EventCourseCreditRow
    })
    .filter((r): r is EventCourseCreditRow => r !== null)
}

const EVENT_PAGE_SIZE = 15

export interface PaginatedRegistrations {
  registrations: RegistrationRow[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getRegistrationsByEvent(
  eventId: string,
  page: number
): Promise<PaginatedRegistrations> {
  const supabase = await createClient()
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * EVENT_PAGE_SIZE
  const to = from + EVENT_PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from("REGISTRATIONS")
    .select(
      "registration_id, status, course_name, coming_from, registered_at, people_id, event_id, PEOPLE(first_name, last_name, email, student_id, major), EVENTS(event_name, event_date, event_type)",
      { count: "exact" }
    )
    .eq("event_id", eventId)
    .order("registered_at", { ascending: false })
    .range(from, to)

  if (error || !data) {
    return { registrations: [], totalCount: 0, page: safePage, pageSize: EVENT_PAGE_SIZE, totalPages: 0 }
  }

  const registrations = data
    .map((row: any) => {
      const person = Array.isArray(row.PEOPLE) ? row.PEOPLE[0] : row.PEOPLE
      const event = Array.isArray(row.EVENTS) ? row.EVENTS[0] : row.EVENTS
      if (!person || !event) return null
      return {
        registration_id: row.registration_id,
        status: row.status,
        course_name: row.course_name,
        coming_from: row.coming_from,
        registered_at: row.registered_at,
        people_id: row.people_id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        student_id: person.student_id,
        major: person.major,
        event_id: row.event_id,
        event_name: event.event_name,
        event_date: event.event_date,
        event_type: event.event_type,
      } satisfies RegistrationRow
    })
    .filter((r): r is RegistrationRow => r !== null)

  const totalCount = count ?? 0
  return {
    registrations,
    totalCount,
    page: safePage,
    pageSize: EVENT_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(totalCount / EVENT_PAGE_SIZE)),
  }
}