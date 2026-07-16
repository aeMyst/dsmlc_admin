"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface EventRow {
  event_id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  rsvp: number;
  attended: number;
  turnoutRate: number;
  avgRating: number | null;
}

interface EventsTableProps {
  events: EventRow[];
}

export function EventsTable({ events }: EventsTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(events.map((e) => e.event_type)))],
    [events],
  );

  const filtered = events
    .filter((e) => (category === "All" ? true : e.event_type === category))
    .filter((e) => e.event_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={
                cat === category
                  ? "rounded-full bg-[#F86306] px-4 py-2 text-xs font-normal text-white"
                  : "rounded-full border border-white/15 px-4 py-2 text-xs font-light text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th scope="col" className="px-6 py-3 font-light">
                Event
              </th>
              <th scope="col" className="px-6 py-3 font-light">
                Category
              </th>
              <th scope="col" className="px-6 py-3 font-light">
                Date
              </th>
              <th scope="col" className="px-6 py-3 font-light">
                RSVP / ATT.
              </th>
              <th scope="col" className="px-6 py-3 font-light">
                Turnout
              </th>
              <th scope="col" className="px-6 py-3 font-light">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr
                key={event.event_id}
                className="border-b border-white/5 text-white/80 last:border-0"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/events/${event.event_id}`}
                    className="text-white transition-colors hover:text-[#FF914D]"
                  >
                    {event.event_name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/70">
                    {event.event_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/50">
                  {new Date(event.event_date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-white/50">
                  {event.rsvp} / {event.attended}
                </td>
                <td className="px-6 py-4 text-white/50">
                  {event.turnoutRate}%
                </td>
                <td className="px-6 py-4 text-white/50">
                  {event.avgRating !== null ? `★ ${event.avgRating}` : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/40">
                  No events match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
