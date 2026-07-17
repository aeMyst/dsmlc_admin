import { getMembers } from "@/lib/queries/members";
import { MemberFormDialog } from "@/components/features/dashboard/forms/member-form-dialog";
import { MembershipsTable } from "@/components/features/dashboard/tables/memberships-table";
import { CategoryBreakdown } from "@/components/features/dashboard/graphs/category-breakdown";

export default async function MembershipsPage() {
  const members = await getMembers();

  const majorCounts = new Map<string, number>();
  for (const member of members) {
    const major = member.major?.trim() || "Unspecified";
    majorCounts.set(major, (majorCounts.get(major) ?? 0) + 1);
  }

  const totalMembers = members.length;
  const majors = Array.from(majorCounts, ([major, count]) => ({
    major,
    count,
  })).sort((a, b) => b.count - a.count);
  const maxMajorCount = Math.max(...majors.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <MemberFormDialog
          mode="create"
          trigger={
            <span className="cursor-pointer rounded-full bg-[#F86306] px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-[#FF914D]">
              + Add member
            </span>
          }
        />
      </div>

      <MembershipsTable members={members} />

      <CategoryBreakdown
        title="Memberships by Major"
        items={majors.map((m) => ({
          label: m.major,
          percent: (m.count / maxMajorCount) * 100,
          display:
            totalMembers > 0
              ? `${m.count} · ${Math.round((m.count / totalMembers) * 100)}%`
              : `${m.count}`,
        }))}
      />
    </div>
  );
}
