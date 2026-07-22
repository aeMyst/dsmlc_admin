import { Suspense } from "react";

import { getPeoplePaginated } from "@/lib/queries/people";
import { PeopleTable } from "@/components/features/dashboard/tables/people-table";
import { PeopleSearchInput } from "@/components/features/dashboard/people-search";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function PeoplePage({ searchParams }: PageProps) {
  const { page, q } = await searchParams;
  const currentPage = Number(page ?? "1") || 1;

  const { people, totalPages } = await getPeoplePaginated(currentPage, q);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <PeopleSearchInput />
      </Suspense>

      <PeopleTable
        people={people}
        currentPage={currentPage}
        totalPages={totalPages}
        query={q}
      />
    </div>
  );
}
