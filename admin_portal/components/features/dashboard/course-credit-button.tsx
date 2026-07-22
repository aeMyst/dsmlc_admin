"use client";

import type { CourseCreditRow } from "@/lib/queries/people";
import { downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";

interface CourseCreditExportButtonProps {
  rows: CourseCreditRow[];
}

const HEADERS = [
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

export function CourseCreditExportButton({
  rows,
}: CourseCreditExportButtonProps) {
  function handleDownload() {
    downloadCsv(
      `course-credit-registrations-${new Date().toISOString().slice(0, 10)}.csv`,
      HEADERS,
      rows.map((r) => [
        r.first_name,
        r.last_name,
        r.student_id,
        r.email,
        r.major,
        r.course_name,
        r.event_name,
        r.event_date,
        r.registered_at,
      ]),
    );
  }

  return (
    <Button
      variant="primary"
      onClick={handleDownload}
      disabled={rows.length === 0}
    >
      Download course-credit list ({rows.length})
    </Button>
  );
}
