import { getEventsWithStats } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/dashboard/header";
import { EventsTable } from "@/components/features/dashboard/events_table";

export default async function EventsPage() {
  const events = await getEventsWithStats();

  return (
    <div>
      <PageHeader title="Events" />
      <EventsTable events={events} />
    </div>
  );
}
