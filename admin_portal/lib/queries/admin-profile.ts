import { createClient } from "@/lib/supabase/server"

export interface CurrentAdmin {
  firstName: string | null
  lastName: string | null
  email: string
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: admin } = await supabase
    .from("ADMINS")
    .select("first_name, last_name, email")
    .eq("admin_id", user.id)
    .single()

  if (!admin) return null

  return {
    firstName: admin.first_name || null,
    lastName: admin.last_name || null,
    email: admin.email,
  }
}