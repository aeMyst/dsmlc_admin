import {
  getPeoplePaginated,
  getCourseCreditRegistrations,
} from "@/lib/queries/people";
import { PeopleTable } from "@/components/features/dashboard/tables/people-table";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PeoplePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page ?? "1") || 1;

  const [{ people, totalPages }] = await Promise.all([
    getPeoplePaginated(currentPage),
  ]);

  return (
    <div className="space-y-6">
      <PeopleTable
        people={people}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
