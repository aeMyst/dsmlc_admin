import { getEventsWithStats } from "@/lib/queries/events";
import { EventsTable } from "@/components/features/dashboard/tables/events-table";
import { EventFormDialog } from "@/components/features/dashboard/forms/event-form-dialog";
import { CategoryBreakdown } from "@/components/features/dashboard/graphs/category-breakdown";
import { TriggerLabel } from "@/components/ui/button";

export default async function EventsPage() {
  const events = await getEventsWithStats();

  const categoryCounts = new Map<string, number>();
  for (const event of events) {
    categoryCounts.set(
      event.event_type,
      (categoryCounts.get(event.event_type) ?? 0) + 1,
    );
  }

  const totalEvents = events.length;
  const categories = Array.from(categoryCounts, ([category, count]) => ({
    category,
    count,
  })).sort((a, b) => b.count - a.count);
  const maxCategoryCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <EventFormDialog
          trigger={<TriggerLabel variant="primary">+ Add event</TriggerLabel>}
        />
      </div>

      <EventsTable events={events} />

      <CategoryBreakdown
        title="Events by Category"
        items={categories.map((c) => ({
          label: c.category,
          percent: (c.count / maxCategoryCount) * 100,
          display:
            totalEvents > 0
              ? `${c.count} · ${Math.round((c.count / totalEvents) * 100)}%`
              : `${c.count}`,
        }))}
      />
    </div>
  );
}
