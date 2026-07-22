"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/dashboard/data-table";
import { RegistrationFormDialog } from "@/components/features/dashboard/forms/registration-form-dialog";
import { TriggerLabel } from "@/components/ui/button";
import type { RegistrationRow } from "@/lib/queries/registrations";

interface RegistrationsTableProps {
  eventId: string;
  registrations: RegistrationRow[];
  currentPage: number;
  totalPages: number;
}

export function RegistrationsTable({
  eventId,
  registrations,
  currentPage,
  totalPages,
}: RegistrationsTableProps) {
  const columns: DataTableColumn<RegistrationRow>[] = [
    {
      id: "name",
      header: "Name",
      render: (r) => `${r.first_name} ${r.last_name}`,
    },
    {
      id: "email",
      header: "Email",
      render: (r) => r.email,
      className: "px-6 py-4 text-white/50",
    },
    {
      id: "status",
      header: "Status",
      render: (r) => r.status.replace("-", " "),
      className: "px-6 py-4 text-white/50 capitalize",
    },
    {
      id: "course_credit",
      header: "Course credit",
      render: (r) => r.course_name ?? "—",
      className: "px-6 py-4 text-white/50",
    },
    {
      id: "source",
      header: "Source",
      render: (r) => r.coming_from ?? "—",
      className: "px-6 py-4 text-white/50",
    },
    {
      id: "actions",
      header: "",
      render: (r) => (
        <RegistrationFormDialog
          mode="edit"
          eventId={eventId}
          registration={r}
          trigger={
            <TriggerLabel variant="secondary" className="px-4 py-1.5 text-xs">
              Edit
            </TriggerLabel>
          }
        />
      ),
      className: "px-6 py-4 text-right",
    },
  ];

  return (
    <DataTable
      data={registrations}
      columns={columns}
      getRowKey={(r) => r.registration_id}
      minWidth="640px"
      emptyMessage="No registrations match your search."
      search={{
        placeholder: "Search registrations...",
        filterFn: (r, query) => {
          const q = query.toLowerCase();
          const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
          return (
            fullName.includes(q) ||
            r.first_name.toLowerCase().includes(q) ||
            r.last_name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q)
          );
        },
      }}
      filters={[
        {
          id: "status",
          label: "Status",
          getValue: (r) => r.status.replace("-", " "),
        },
        {
          id: "course_credit",
          label: "Course",
          getValue: (r) => r.course_name ?? "No course credit",
        },
        {
          id: "source",
          label: "Source",
          getValue: (r) => r.coming_from ?? "Unknown",
        },
      ]}
      pagination={{
        currentPage,
        totalPages,
        basePath: `/dashboard/events/${eventId}`,
      }}
    />
  );
}
