import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getCourseRetention,
  getEventDetail,
  getEventFeedback,
} from "@/lib/queries/events";
import {
  getEventCourseCreditRegistrations,
  getRegistrationsByEvent,
} from "@/lib/queries/registrations";
import { formatDate } from "@/lib/date";
import { StatCard } from "@/components/ui/dashboard/stat-card";
import { RsvpTurnoutChart } from "@/components/features/dashboard/graphs/rsvp-chart";
import { CourseRetentionChart } from "@/components/features/dashboard/graphs/course-retention-chart";
import { RegistrationFormDialog } from "@/components/features/dashboard/forms/registration-form-dialog";
import { EventCourseExportButton } from "@/components/features/dashboard/event-course-button";
import { CopyableId } from "@/components/ui/dashboard/event-id";
import { RegistrationsTable } from "@/components/features/dashboard/tables/registrations-table";
import { TriggerLabel } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function EventDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { eventId } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page ?? "1") || 1;

  const [
    event,
    feedback,
    registrationsPage,
    courseRetention,
    courseCreditRows,
  ] = await Promise.all([
    getEventDetail(eventId),
    getEventFeedback(eventId),
    getRegistrationsByEvent(eventId, currentPage),
    getCourseRetention(eventId),
    getEventCourseCreditRegistrations(eventId),
  ]);

  if (!event) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-col items-start gap-4">
        <Link
          href="/dashboard/events"
          aria-label="Back to events"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>

        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/70">
              {event.event_type}
            </span>
            <span className="text-xs font-light text-white/40">
              {formatDate(event.event_date)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-light text-white">
              {event.event_name}
            </h1>
            <CopyableId value={event.event_id} label="event_id" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          index={0}
          label="Turnout Rate"
          value={`${event.turnoutRate}%`}
        />
        <StatCard
          index={1}
          label="Avg. Rating"
          value={event.avgRating !== null ? `★ ${event.avgRating}` : "—"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-sm font-light text-white/70">
            RSVP vs. Actual
          </h2>
          <RsvpTurnoutChart
            data={[
              {
                label: event.event_name,
                rsvp: event.rsvp,
                attended: event.attended,
                atDoor: event.atDoor,
              },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-sm font-light text-white/70">
            Feedback ({feedback.length} responses)
          </h2>
          <div className="max-h-[260px] space-y-4 overflow-y-auto pr-1">
            {feedback.map((f) => (
              <div
                key={f.feedback_id}
                className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="mb-1 flex items-center gap-2 text-sm text-white">
                  <span className="text-brand">★</span>
                  {f.rating}
                </div>
                {f.comment && (
                  <p className="text-sm font-light text-white/60">
                    &ldquo;{f.comment}&rdquo;
                  </p>
                )}
              </div>
            ))}
            {feedback.length === 0 && (
              <p className="text-sm font-light text-white/40">
                No feedback submitted for this event yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {courseRetention.courseGroup.total > 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-1 text-sm font-light text-white/70">
            Course Collab Retention
          </h2>
          <p className="mb-4 text-xs font-light text-white/40">
            Attendance rate for registrants who signed up for course credit vs.
            everyone else.
          </p>
          <CourseRetentionChart
            courseGroup={courseRetention.courseGroup}
            generalGroup={courseRetention.generalGroup}
          />
        </div>
      )}

      <div className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-light text-white/70">Registrations</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <EventCourseExportButton
              eventName={event.event_name}
              rows={courseCreditRows}
            />
            <RegistrationFormDialog
              mode="create"
              eventId={event.event_id}
              trigger={
                <TriggerLabel variant="primary">
                  + Add registration
                </TriggerLabel>
              }
            />
          </div>
        </div>

        {/* RegistrationsTable is a Client Component that owns its own
            columns/getRowKey definitions — this page only ever hands it
            plain, serializable data (the registrations array + two
            numbers), never functions. */}
        <RegistrationsTable
          eventId={event.event_id}
          registrations={registrationsPage.registrations}
          currentPage={registrationsPage.page}
          totalPages={registrationsPage.totalPages}
        />
      </div>
    </div>
  );
}
