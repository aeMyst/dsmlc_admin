"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export interface EventActionState {
  error?: string
  success?: boolean
  eventId?: string
}

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("You must be signed in to create an event.")

    const event_name = String(formData.get("event_name") ?? "").trim()
    const event_date = String(formData.get("event_date") ?? "").trim()
    const event_type = String(formData.get("event_type") ?? "").trim()

    if (!event_name || !event_date || !event_type) {
      throw new Error("Event name, date, and category are all required.")
    }

    const { data, error } = await supabase
      .from("EVENTS")
      .insert({
        event_name,
        event_date,
        event_type,
        admin_id: user.id,
      })
      .select("event_id")
      .single()

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to create event.")
    }

    revalidatePath("/dashboard/events")
    return { success: true, eventId: data.event_id }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." }
  }
}