"use client";

import { Download } from "lucide-react";

import type { EventCourseCreditRow } from "@/lib/queries/registrations";
import { downloadCsv, slugifyFilename } from "@/lib/csv";
import { Button } from "@/components/ui/button";

interface EventCourseExportButtonProps {
  eventName: string;
  rows: EventCourseCreditRow[];
}

const HEADERS = [
  "First name",
  "Last name",
  "Student ID",
  "Email",
  "Major",
  "Course",
  "Status",
  "Registered at",
];

export function EventCourseExportButton({
  eventName,
  rows,
}: EventCourseExportButtonProps) {
  function handleDownload() {
    downloadCsv(
      `${slugifyFilename(eventName)}-course-collab-${new Date().toISOString().slice(0, 10)}.csv`,
      HEADERS,
      rows.map((r) => [
        r.first_name,
        r.last_name,
        r.student_id,
        r.email,
        r.major,
        r.course_name,
        r.status,
        r.registered_at,
      ]),
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={rows.length === 0}
    >
      <Download className="h-4 w-4" strokeWidth={1.75} />
      Export course collab ({rows.length})
    </Button>
  );
}
