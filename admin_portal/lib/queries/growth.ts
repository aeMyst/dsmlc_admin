import { createClient } from "@/lib/supabase/server"

export interface MemberGrowthRow {
  date: string
  newMembers: number
  cumulativeMembers: number
}

export async function getMemberGrowth(): Promise<MemberGrowthRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("MEMBERSHIP")
    .select("created_at")
    .order("created_at", { ascending: true })

  const rows = data ?? []
  const buckets = new Map<string, number>()
  for (const row of rows) {
    const day = row.created_at.slice(0, 10)
    buckets.set(day, (buckets.get(day) ?? 0) + 1)
  }

  const sortedDays = Array.from(buckets.keys()).sort()
  let cumulative = 0
  return sortedDays.map((date) => {
    const newMembers = buckets.get(date) ?? 0
    cumulative += newMembers
    return { date, newMembers, cumulativeMembers: cumulative }
  })
}