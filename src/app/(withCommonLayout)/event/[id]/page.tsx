import EventDetails from "@/components/module/event/EventDetails";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getEventsById } from "../_actions";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["event", id],
    queryFn: () => getEventsById(id),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EventDetails id={id} />
      </HydrationBoundary>
    </div>
  );
}