import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getEvents } from "./_actions";
import EventList from "@/components/module/event/EventList";


const EventPage = async () => {
  
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  return <div>
    <HydrationBoundary  state={dehydrate(queryClient)}>
      <EventList/>
    </HydrationBoundary>
     </div>;
};

export default EventPage;