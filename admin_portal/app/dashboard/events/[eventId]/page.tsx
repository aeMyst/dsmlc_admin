import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getEventFeedback,
  getEventRsvpVsAttended,
  getEventsWithStats,
} from "@/lib/dashboard";
import { StatCard } from "@/components/ui/dashboard/stat-card";
import { RsvpTurnoutChart } from "@/components/features/dashboard/rsvp-chart";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;

  const [events, feedback, rsvpVsAttended] = await Promise.all([
    getEventsWithStats(),
    getEventFeedback(eventId),
    getEventRsvpVsAttended(eventId),
  ]);

  const event = events.find((e) => e.event_id === eventId);
  if (!event) notFound();

  return (
    <div>
      <Link
        href="/dashboard/events"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-light text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Events
      </Link>

      <div className="mb-6 flex items-center gap-3">
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

      <h1 className="mb-8 text-2xl font-light text-white">
        {event.event_name}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="RSVPs" value={event.rsvp} />
        <StatCard label="Attended" value={event.attended} />
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
                rsvp: rsvpVsAttended.rsvp,
                attended: rsvpVsAttended.attended,
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
    </div>
  );
}
