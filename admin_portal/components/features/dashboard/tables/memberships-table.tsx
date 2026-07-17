"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/features/dashboard/data-table";
import { MemberFormDialog } from "@/components/features/dashboard/forms/member-form-dialog";
import type { MemberRow } from "@/lib/queries/members";

const columns: DataTableColumn<MemberRow>[] = [
  {
    id: "name",
    header: "Name",
    render: (member) => `${member.first_name} ${member.last_name}`,
  },
  {
    id: "email",
    header: "Email",
    render: (member) => member.email,
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "student_id",
    header: "Student ID",
    render: (member) => member.student_id ?? "—",
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "type",
    header: "Type",
    render: (member) => member.membership_type,
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "mailing",
    header: "Mailing",
    render: (member) => (
      <span
        className={
          member.mailing
            ? "rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400"
            : "rounded-full bg-white/5 px-2 py-1 text-xs text-white/40"
        }
      >
        {member.mailing ? "Subscribed" : "Not subscribed"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    render: (member) => (
      <MemberFormDialog
        mode="edit"
        member={member}
        trigger={
          <span className="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white">
            Edit
          </span>
        }
      />
    ),
    className: "px-6 py-4 text-right",
  },
];

interface MembershipsTableProps {
  members: MemberRow[];
}

export function MembershipsTable({ members }: MembershipsTableProps) {
  return (
    <DataTable
      data={members}
      columns={columns}
      getRowKey={(member) => member.membership_id}
      minWidth="720px"
      emptyMessage="No members yet."
    />
  );
}
