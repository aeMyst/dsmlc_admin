import {
  getPeoplePaginated,
  getCourseCreditRegistrations,
} from "@/lib/queries/people";
import { CourseCreditExportButton } from "@/components/features/dashboard/course-credit-button";
import { PeopleTable } from "@/components/features/dashboard/tables/people-table";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PeoplePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page ?? "1") || 1;

  const [{ people, totalPages }, courseCreditRows] = await Promise.all([
    getPeoplePaginated(currentPage),
    getCourseCreditRegistrations(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CourseCreditExportButton rows={courseCreditRows} />
      </div>

      <PeopleTable
        people={people}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
