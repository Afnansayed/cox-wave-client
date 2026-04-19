



import BookingForm from '@/components/module/booking/BookingForm';

const BookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedParams = await searchParams;

  const rawEventId = resolvedParams.event_id;
  const eventId = Array.isArray(rawEventId)
    ? (rawEventId[0] ?? '')
    : (rawEventId ?? '');

  return (
    <section className="min-h-[70vh] bg-neutral-50 py-12">
      <div className="container-max px-6">
        <BookingForm defaultEventId={eventId} />
      </div>
    </section>
  );
};

export default BookingPage;