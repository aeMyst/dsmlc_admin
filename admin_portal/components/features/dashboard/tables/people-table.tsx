"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/dashboard/data-table";
import type { PersonRow } from "@/lib/queries/people";

const columns: DataTableColumn<PersonRow>[] = [
  {
    id: "name",
    header: "Name",
    width: "26%",
    render: (person) => `${person.first_name} ${person.last_name}`,
  },
  {
    id: "email",
    header: "Email",
    width: "32%",
    render: (person) => person.email,
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "student_id",
    header: "Student ID",
    width: "20%",
    render: (person) => person.student_id ?? "—",
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "major",
    header: "Major",
    width: "22%",
    render: (person) => person.major ?? "—",
    className: "px-6 py-4 text-white/50",
  },
];

interface PeopleTableProps {
  people: PersonRow[];
  currentPage: number;
  totalPages: number;
  query?: string;
}

export function PeopleTable({
  people,
  currentPage,
  totalPages,
  query,
}: PeopleTableProps) {
  return (
    <DataTable
      data={people}
      columns={columns}
      getRowKey={(person) => person.people_id}
      minWidth="560px"
      emptyMessage={query ? "No people match your search." : "No people yet."}
      pagination={{
        currentPage,
        totalPages,
        basePath: "/dashboard/people",
        extraParams: query ? { q: query } : undefined,
      }}
    />
  );
}
