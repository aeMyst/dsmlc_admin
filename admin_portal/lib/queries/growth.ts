import { createClient } from "@/lib/supabase/server"

export interface MemberGrowthRow {
  month: string
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
    const month = row.created_at.slice(0, 7)
    buckets.set(month, (buckets.get(month) ?? 0) + 1)
  }

  const sortedMonths = Array.from(buckets.keys()).sort()
  let cumulative = 0
  return sortedMonths.map((month) => {
    const newMembers = buckets.get(month) ?? 0
    cumulative += newMembers
    return { month, newMembers, cumulativeMembers: cumulative }
  })
}