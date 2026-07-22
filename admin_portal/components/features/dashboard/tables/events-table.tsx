"use client";

import Link from "next/link";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/dashboard/data-table";

interface EventRow {
  event_id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  rsvp: number;
  attended: number;
  atDoor: number;
  turnoutRate: number;
  avgRating: number | null;
}

interface EventsTableProps {
  events: EventRow[];
}

const columns: DataTableColumn<EventRow>[] = [
  {
    id: "event",
    header: "Event",
    width: "26%",
    render: (event) => (
      <Link
        href={`/dashboard/events/${event.event_id}`}
        className="text-white transition-colors hover:text-brand-hover"
      >
        {event.event_name}
      </Link>
    ),
  },
  {
    id: "category",
    header: "Category",
    width: "14%",
    render: (event) => (
      <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/70">
        {event.event_type}
      </span>
    ),
  },
  {
    id: "date",
    header: "Date",
    width: "12%",
    render: (event) =>
      new Date(event.event_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "rsvp_atdoor_att",
    header: "RSVP / At-door / ATT.",
    width: "20%",
    render: (event) =>
      `${event.rsvp} / ${event.atDoor ?? 0} / ${event.attended}`,
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "turnout",
    header: "Turnout",
    width: "14%",
    render: (event) => `${event.turnoutRate}%`,
    className: "px-6 py-4 text-white/50",
  },
  {
    id: "rating",
    header: "Rating",
    width: "14%",
    render: (event) =>
      event.avgRating !== null ? `★ ${event.avgRating}` : "—",
    className: "px-6 py-4 text-white/50",
  },
];

export function EventsTable({ events }: EventsTableProps) {
  return (
    <DataTable
      data={events}
      columns={columns}
      getRowKey={(event) => event.event_id}
      minWidth="760px"
      emptyMessage="No events match your search."
      search={{
        placeholder: "Search events...",
        filterFn: (event, query) =>
          event.event_name.toLowerCase().includes(query.toLowerCase()),
      }}
      categoryFilter={{ getValue: (event) => event.event_type }}
    />
  );
}
