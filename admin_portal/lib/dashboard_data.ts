import type { Event, Feedback, Membership, Person, Registration } from "@/types/database"

export const mockEvents: Event[] = [
  { event_id: "evt_1", event_name: "Welcome Back Mixer", event_date: "2026-01-15", event_type: "Social", created_at: "2026-01-01", admin_id: "adm_1" },
  { event_id: "evt_2", event_name: "Resume & LinkedIn Workshop", event_date: "2026-01-22", event_type: "Workshop", created_at: "2026-01-05", admin_id: "adm_1" },
  { event_id: "evt_3", event_name: "Alumni Speaker: Career Paths in Tech", event_date: "2026-01-29", event_type: "Speaker", created_at: "2026-01-10", admin_id: "adm_1" },
  { event_id: "evt_4", event_name: "Community Food Bank Volunteer Day", event_date: "2026-02-05", event_type: "Volunteer", created_at: "2026-01-15", admin_id: "adm_1" },
  { event_id: "evt_5", event_name: "Trivia Night Fundraiser", event_date: "2026-02-12", event_type: "Fundraiser", created_at: "2026-01-20", admin_id: "adm_1" },
  { event_id: "evt_6", event_name: "Intramural Basketball Kickoff", event_date: "2026-02-19", event_type: "Sports", created_at: "2026-01-25", admin_id: "adm_1" },
  { event_id: "evt_7", event_name: "Public Speaking Workshop", event_date: "2026-02-26", event_type: "Workshop", created_at: "2026-02-01", admin_id: "adm_1" },
  { event_id: "evt_8", event_name: "Spring Formal", event_date: "2026-05-07", event_type: "Social", created_at: "2026-04-01", admin_id: "adm_1" },
]

export const mockPeople: Person[] = [
  { people_id: "ppl_1", first_name: "Amara", last_name: "Osei", student_id: "S1001", email: "amara@school.edu", major: "Statistics" },
  { people_id: "ppl_2", first_name: "Ben", last_name: "Chu", student_id: "S1002", email: "ben@school.edu", major: "Computer Science" },
  { people_id: "ppl_3", first_name: "Carla", last_name: "Nunez", student_id: null, email: "carla@gmail.com", major: null },
  { people_id: "ppl_4", first_name: "Devon", last_name: "Price", student_id: "S1004", email: "devon@school.edu", major: "Economics" },
  { people_id: "ppl_5", first_name: "Elin", last_name: "Farah", student_id: "S1005", email: "elin@school.edu", major: "Data Science" },
  { people_id: "ppl_6", first_name: "Faisal", last_name: "Rahman", student_id: null, email: "faisal@outlook.com", major: null },
  { people_id: "ppl_7", first_name: "Grace", last_name: "Kim", student_id: "S1007", email: "grace@school.edu", major: "Statistics" },
  { people_id: "ppl_8", first_name: "Hana", last_name: "Ito", student_id: "S1008", email: "hana@school.edu", major: "Computer Science" },
  { people_id: "ppl_9", first_name: "Ivan", last_name: "Petrov", student_id: "S1009", email: "ivan@school.edu", major: "Marketing" },
  { people_id: "ppl_10", first_name: "Jasmine", last_name: "Lee", student_id: null, email: "jasmine@gmail.com", major: null },
]

const CHANNELS = ["Instagram", "LinkedIn", "Email", "Friend", "Walk-in"] as const
const COURSES = ["STAT 301", "DSCI 100", "CPSC 330", "ECON 210"] as const

function buildRegistrations(
  eventId: string,
  rsvpCount: number,
  attendedCount: number,
  startDate: string
): Registration[] {
  const rows: Registration[] = []
  for (let i = 0; i < rsvpCount; i++) {
    const attended = i < attendedCount
    rows.push({
      registration_id: `reg_${eventId}_${i}`,
      event_id: eventId,
      people_id: mockPeople[i % mockPeople.length].people_id,
      status: attended ? "attended" : "no-show",
      course_name: i % 6 === 0 ? COURSES[i % COURSES.length] : null,
      coming_from: CHANNELS[i % CHANNELS.length],
      registered_at: startDate,
    })
  }
  return rows
}

export const mockRegistrations: Registration[] = [
  // Welcome Back Mixer — 120 RSVP / 98 attended (82%)
  ...buildRegistrations("evt_1", 120, 98, "2026-01-10"),
  // Resume & LinkedIn Workshop — 60 / 47 (78%)
  ...buildRegistrations("evt_2", 60, 47, "2026-01-18"),
  // Alumni Speaker — 95 / 71 (75%)
  ...buildRegistrations("evt_3", 95, 71, "2026-01-25"),
  // Community Food Bank Volunteer Day — 45 / 40 (89%)
  ...buildRegistrations("evt_4", 45, 40, "2026-02-01"),
  // Trivia Night Fundraiser — 80 / 66 (83%)
  ...buildRegistrations("evt_5", 80, 66, "2026-02-08"),
  // Intramural Basketball Kickoff — 55 / 52 (95%)
  ...buildRegistrations("evt_6", 55, 52, "2026-02-15"),
  // Public Speaking Workshop — 50 / 33 (66%)
  ...buildRegistrations("evt_7", 50, 33, "2026-02-22"),
  // Spring Formal — 150 / 141 (94%)
  ...buildRegistrations("evt_8", 150, 141, "2026-05-01"),
]

export const mockFeedback: Feedback[] = [
  { feedback_id: "fb_1", event_id: "evt_1", rating: 5, comment: "Great energy, loved the live music.", created_at: "2026-01-15" },
  { feedback_id: "fb_2", event_id: "evt_1", rating: 4, comment: "Food ran out a bit early but still fun.", created_at: "2026-01-15" },
  { feedback_id: "fb_3", event_id: "evt_2", rating: 4, comment: "Really useful LinkedIn tips.", created_at: "2026-01-22" },
  { feedback_id: "fb_4", event_id: "evt_3", rating: 5, comment: "Great panelists, very honest advice.", created_at: "2026-01-29" },
  { feedback_id: "fb_5", event_id: "evt_4", rating: 5, comment: "Well organized, felt genuinely helpful.", created_at: "2026-02-05" },
  { feedback_id: "fb_6", event_id: "evt_5", rating: 4, comment: null, created_at: "2026-02-12" },
  { feedback_id: "fb_7", event_id: "evt_6", rating: 4, comment: "Fun kickoff, would join again.", created_at: "2026-02-19" },
  { feedback_id: "fb_8", event_id: "evt_7", rating: 3, comment: "A bit fast-paced for beginners.", created_at: "2026-02-26" },
  { feedback_id: "fb_9", event_id: "evt_8", rating: 5, comment: "Best event of the semester.", created_at: "2026-05-07" },
]

export const mockMemberships: Membership[] = [
  { membership_id: "mem_1", people_id: "ppl_1", membership_type: "Standard", created_at: "2026-01-10", expires_at: "2027-01-10", mailing: true },
  { membership_id: "mem_2", people_id: "ppl_2", membership_type: "Standard", created_at: "2026-01-12", expires_at: "2027-01-12", mailing: true },
  { membership_id: "mem_3", people_id: "ppl_3", membership_type: "Guest", created_at: "2026-02-05", expires_at: null, mailing: false },
  { membership_id: "mem_4", people_id: "ppl_4", membership_type: "Standard", created_at: "2026-02-14", expires_at: "2027-02-14", mailing: true },
  { membership_id: "mem_5", people_id: "ppl_5", membership_type: "Standard", created_at: "2026-03-01", expires_at: "2027-03-01", mailing: false },
  { membership_id: "mem_6", people_id: "ppl_7", membership_type: "Standard", created_at: "2026-03-15", expires_at: "2027-03-15", mailing: true },
]