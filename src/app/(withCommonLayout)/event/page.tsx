import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getEvents } from "./_actions";
import EventList from "@/components/module/event/EventList";
import EventBanner from "@/components/module/event/EventBanner";


const EventPage = async () => {
  
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  return <div>
    <HydrationBoundary  state={dehydrate(queryClient)}>
      <EventBanner />
      <EventList/>
    </HydrationBoundary>
     </div>;
};

export default EventPage;