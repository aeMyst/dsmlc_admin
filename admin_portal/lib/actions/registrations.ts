"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import type { ActionState } from "@/lib/actions/types"

export type { ActionState }

export async function createRegistration(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    const event_id = String(formData.get("event_id") ?? "")
    const first_name = String(formData.get("first_name") ?? "").trim()
    const last_name = String(formData.get("last_name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const student_id = String(formData.get("student_id") ?? "").trim() || null
    const major = String(formData.get("major") ?? "").trim() || null
    const status = String(formData.get("status") ?? "registered")
    const course_name = String(formData.get("course_name") ?? "").trim() || null
    const coming_from = String(formData.get("coming_from") ?? "").trim() || null

    if (!event_id) throw new Error("Missing event reference.")
    if (!first_name || !last_name || !email) {
      throw new Error("First name, last name, and email are required.")
    }

    // Check whether this person already exists — match on email first
    // (the most reliable identity key), falling back to student ID if no
    // email match was found. Only create a new PEOPLE row if neither hits.
    let people_id: string | null = null

    const { data: byEmail } = await supabase
      .from("PEOPLE")
      .select("people_id")
      .eq("email", email)
      .maybeSingle()

    if (byEmail) {
      people_id = byEmail.people_id
    } else if (student_id) {
      const { data: byStudentId } = await supabase
        .from("PEOPLE")
        .select("people_id")
        .eq("student_id", student_id)
        .maybeSingle()

      if (byStudentId) people_id = byStudentId.people_id
    }

    if (!people_id) {
      const { data: newPerson, error: personError } = await supabase
        .from("PEOPLE")
        .insert({ first_name, last_name, email, student_id, major })
        .select("people_id")
        .single()

      if (personError || !newPerson) {
        throw new Error(personError?.message ?? "Failed to create person record.")
      }

      people_id = newPerson.people_id
    }

    const { error: regError } = await supabase.from("REGISTRATIONS").insert({
      event_id,
      people_id,
      status,
      course_name,
      coming_from,
      registered_at: new Date().toISOString(),
    })

    if (regError) throw new Error(regError.message)

    revalidatePath(`/dashboard/events/${event_id}`)
    revalidatePath("/dashboard/events")
    revalidatePath("/dashboard/people")
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." }
  }
}

export async function updateRegistration(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    const registration_id = String(formData.get("registration_id") ?? "")
    const event_id = String(formData.get("event_id") ?? "")
    if (!registration_id) throw new Error("Missing registration reference.")

    const status = String(formData.get("status") ?? "registered")
    const course_name = String(formData.get("course_name") ?? "").trim() || null
    const coming_from = String(formData.get("coming_from") ?? "").trim() || null

    const { error } = await supabase
      .from("REGISTRATIONS")
      .update({ status, course_name, coming_from })
      .eq("registration_id", registration_id)

    if (error) throw new Error(error.message)

    if (event_id) revalidatePath(`/dashboard/events/${event_id}`)
    revalidatePath("/dashboard/events")
    revalidatePath("/dashboard/people")
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." }
  }
}