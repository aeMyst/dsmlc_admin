"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/features/dashboard/data-table";
import type { PersonRow } from "@/lib/queries/people";

const columns: DataTableColumn<PersonRow>[] = [
  {
    id: "name",
    header: "Name",
    render: (person) => `${person.first_name} ${person.last_name}`,
  },
  {
    id: "email",
    header: "Email",
    render: (person) => person.email,
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "student_id",
    header: "Student ID",
    render: (person) => person.student_id ?? "—",
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "major",
    header: "Major",
    render: (person) => person.major ?? "—",
    className: "px-6 py-4 text-white/50",
  },
];

interface PeopleTableProps {
  people: PersonRow[];
  currentPage: number;
  totalPages: number;
}

export function PeopleTable({
  people,
  currentPage,
  totalPages,
}: PeopleTableProps) {
  return (
    <DataTable
      data={people}
      columns={columns}
      getRowKey={(person) => person.people_id}
      minWidth="560px"
      emptyMessage="No people yet."
      pagination={{ currentPage, totalPages, basePath: "/dashboard/people" }}
    />
  );
}
