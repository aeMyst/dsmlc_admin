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
import { StatCard } from "@/components/ui/dashboard/stat-card";
import { RsvpTurnoutChart } from "@/components/features/dashboard/graphs/rsvp-chart";
import { CourseRetentionChart } from "@/components/features/dashboard/graphs/course-retention-chart";
import { RegistrationFormDialog } from "@/components/features/dashboard/forms/registration-form-dialog";
import { EventCourseExportButton } from "@/components/features/dashboard/event-course-button";
import { PaginationControls } from "@/components/ui/pagination";
import { CopyableId } from "@/components/ui/dashboard/event-id";

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
              {new Date(event.event_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
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
        <StatCard label="Turnout Rate" value={`${event.turnoutRate}%`} />
        <StatCard
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
                  <span className="text-[#FF914D]">★</span>
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
                <span className="flex cursor-pointer items-center justify-center rounded-full bg-[#F86306] px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-[#FF914D] sm:inline-flex">
                  + Add registration
                </span>
              }
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th scope="col" className="px-6 py-3 font-light">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-light">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 font-light">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-light">
                    Course credit
                  </th>
                  <th scope="col" className="px-6 py-3 font-light">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 font-light" />
                </tr>
              </thead>
              <tbody>
                {registrationsPage.registrations.map((r) => (
                  <tr
                    key={r.registration_id}
                    className="border-b border-white/5 text-white/80 last:border-0"
                  >
                    <td className="px-6 py-4">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="px-6 py-4 text-white/50">{r.email}</td>
                    <td className="px-6 py-4 text-white/50 capitalize">
                      {r.status.replace("-", " ")}
                    </td>
                    <td className="px-6 py-4 text-white/50">
                      {r.course_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-white/50">
                      {r.coming_from ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RegistrationFormDialog
                        mode="edit"
                        eventId={event.event_id}
                        registration={r}
                        trigger={
                          <span className="inline-flex min-h-[36px] cursor-pointer items-center rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                            Edit
                          </span>
                        }
                      />
                    </td>
                  </tr>
                ))}
                {registrationsPage.registrations.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-white/40"
                    >
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={registrationsPage.page}
            totalPages={registrationsPage.totalPages}
            basePath={`/dashboard/events/${event.event_id}`}
          />
        </div>
      </div>
    </div>
  );
}
