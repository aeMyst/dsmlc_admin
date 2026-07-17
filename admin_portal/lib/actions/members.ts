"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export interface ActionState {
  error?: string
  success?: boolean
}

function getNextSeptemberFourth(from: Date = new Date()): string {
  const year = from.getUTCFullYear()
  const septFourthThisYear = Date.UTC(year, 8, 4) // month is 0-indexed: 8 = September
  const targetYear = from.getTime() < septFourthThisYear ? year : year + 1
  return new Date(Date.UTC(targetYear, 8, 4)).toISOString().slice(0, 10)
}

export async function createMember(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    const first_name = String(formData.get("first_name") ?? "").trim()
    const last_name = String(formData.get("last_name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const student_id = String(formData.get("student_id") ?? "").trim() || null
    const major = String(formData.get("major") ?? "").trim() || null
    const membership_type = String(formData.get("membership_type") ?? "Standard").trim()
    const mailing = formData.get("mailing") === "on"

    if (!first_name || !last_name || !email) {
      throw new Error("First name, last name, and email are required.")
    }

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
      const { data: person, error: personError } = await supabase
        .from("PEOPLE")
        .insert({ first_name, last_name, email, student_id, major })
        .select("people_id")
        .single()

      if (personError || !person) {
        throw new Error(personError?.message ?? "Failed to create person record.")
      }

      people_id = person.people_id
    }

    const { error: membershipError } = await supabase.from("MEMBERSHIP").insert({
      people_id,
      membership_type,
      mailing,
      expires_at: getNextSeptemberFourth(),
    })

    if (membershipError) {
      throw new Error(membershipError.message)
    }

    revalidatePath("/dashboard/memberships")
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." }
  }
}

export async function updateMember(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    const people_id = String(formData.get("people_id") ?? "")
    const membership_id = String(formData.get("membership_id") ?? "")
    if (!people_id || !membership_id) throw new Error("Missing member reference.")

    const first_name = String(formData.get("first_name") ?? "").trim()
    const last_name = String(formData.get("last_name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const student_id = String(formData.get("student_id") ?? "").trim() || null
    const major = String(formData.get("major") ?? "").trim() || null
    const membership_type = String(formData.get("membership_type") ?? "Standard").trim()
    const mailing = formData.get("mailing") === "on"

    if (!first_name || !last_name || !email) {
      throw new Error("First name, last name, and email are required.")
    }

    const { error: personError } = await supabase
      .from("PEOPLE")
      .update({ first_name, last_name, email, student_id, major })
      .eq("people_id", people_id)

    if (personError) throw new Error(personError.message)

    const { error: membershipError } = await supabase
      .from("MEMBERSHIP")
      .update({ membership_type, mailing })
      .eq("membership_id", membership_id)

    if (membershipError) throw new Error(membershipError.message)

    revalidatePath("/dashboard/memberships")
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." }
  }
}