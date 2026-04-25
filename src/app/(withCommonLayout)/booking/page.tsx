



import BookingForm from '@/components/module/booking/BookingForm';
import { getEventsById } from '../event/_actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const BookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedParams = await searchParams;

  const rawEventId = resolvedParams.event_id;
  const rawGuestCount = resolvedParams.no_of_guests;

  const guestCount = Array.isArray(rawGuestCount)
    ? parseInt(rawGuestCount[0] ?? '1')
    : parseInt(rawGuestCount ?? '1');

  const eventId = Array.isArray(rawEventId)
    ? (rawEventId[0] ?? '')
    : (rawEventId ?? '');


  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventsById(eventId),
  });
  return (
    <section className="bg-neutral-50 py-12">
      <div className="container-max px-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
        <BookingForm defaultEventId={eventId} defaultGuestCount={guestCount} />
        </HydrationBoundary>
      </div>
    </section>
  );
};

export default BookingPage;