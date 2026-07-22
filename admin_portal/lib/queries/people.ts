import { createClient } from "@/lib/supabase/server"

export interface PersonRow {
  people_id: string
  first_name: string
  last_name: string
  email: string
  student_id: string | null
  major: string | null
}

const PAGE_SIZE = 20

export interface PaginatedPeople {
  people: PersonRow[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getPeoplePaginated(page: number, query?: string): Promise<PaginatedPeople> {
  const supabase = await createClient()
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let request = supabase
    .from("PEOPLE")
    .select("people_id, first_name, last_name, email, student_id, major", { count: "exact" })

  const trimmedQuery = query?.trim()
  if (trimmedQuery) {
    const words = trimmedQuery.split(/\s+/).filter(Boolean)
    for (const word of words) {
      const escaped = word.replace(/[%_]/g, "\\$&")
      request = request.or(`first_name.ilike.%${escaped}%,last_name.ilike.%${escaped}%,email.ilike.%${escaped}%`)
    }
  }

  const { data, count, error } = await request.order("last_name", { ascending: true }).range(from, to)

  if (error || !data) {
    return { people: [], totalCount: 0, page: safePage, pageSize: PAGE_SIZE, totalPages: 0 }
  }

  const totalCount = count ?? 0
  return {
    people: data,
    totalCount,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
  }
}

export interface CourseCreditRow {
  registration_id: string
  first_name: string
  last_name: string
  email: string
  student_id: string | null
  major: string | null
  course_name: string
  event_name: string
  event_date: string
  registered_at: string
}

export async function getCourseCreditRegistrations(): Promise<CourseCreditRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("REGISTRATIONS")
    .select(
      "registration_id, course_name, registered_at, PEOPLE(first_name, last_name, email, student_id, major), EVENTS(event_name, event_date)"
    )
    .not("course_name", "is", null)
    .order("registered_at", { ascending: false })

  if (error || !data) return []

  return data
    .map((row: any) => {
      const person = Array.isArray(row.PEOPLE) ? row.PEOPLE[0] : row.PEOPLE
      const event = Array.isArray(row.EVENTS) ? row.EVENTS[0] : row.EVENTS
      if (!person || !event || !row.course_name) return null
      return {
        registration_id: row.registration_id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        student_id: person.student_id,
        major: person.major,
        course_name: row.course_name,
        event_name: event.event_name,
        event_date: event.event_date,
        registered_at: row.registered_at,
      } satisfies CourseCreditRow
    })
    .filter((r): r is CourseCreditRow => r !== null)
}