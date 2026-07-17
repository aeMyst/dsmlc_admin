"use client";

import type { CourseCreditRow } from "@/lib/queries/people";

interface CourseCreditExportButtonProps {
  rows: CourseCreditRow[];
}

function toCsv(rows: CourseCreditRow[]): string {
  const headers = [
    "First name",
    "Last name",
    "Student ID",
    "Email",
    "Major",
    "Course",
    "Event",
    "Event date",
    "Registered at",
  ];

  const lines = rows.map((r) =>
    [
      r.first_name,
      r.last_name,
      r.student_id ?? "",
      r.email,
      r.major ?? "",
      r.course_name,
      r.event_name,
      r.event_date,
      r.registered_at,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function CourseCreditExportButton({
  rows,
}: CourseCreditExportButtonProps) {
  function handleDownload() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `course-credit-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={rows.length === 0}
      className="cursor-pointer rounded-full bg-[#F86306] px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-[#FF914D] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Download course-credit list ({rows.length})
    </button>
  );
}
