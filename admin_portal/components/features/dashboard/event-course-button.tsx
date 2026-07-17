"use client";

import { Download } from "lucide-react";

import type { EventCourseCreditRow } from "@/lib/queries/registrations";

interface EventCourseExportButtonProps {
  eventName: string;
  rows: EventCourseCreditRow[];
}

function toCsv(rows: EventCourseCreditRow[]): string {
  const headers = [
    "First name",
    "Last name",
    "Student ID",
    "Email",
    "Major",
    "Course",
    "Status",
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
      r.status,
      r.registered_at,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function EventCourseExportButton({
  eventName,
  rows,
}: EventCourseExportButtonProps) {
  function handleDownload() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    const safeName = eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    link.download = `${safeName}-course-collab-${new Date().toISOString().slice(0, 10)}.csv`;
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
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-light text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Download className="h-4 w-4" strokeWidth={1.75} />
      Export course collab ({rows.length})
    </button>
  );
}
