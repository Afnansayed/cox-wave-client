import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getEvents } from "./_actions";
import EventList from "@/components/module/event/EventList";
import EventBanner from "@/components/module/event/EventBanner";

const EVENT_ALLOWED_QUERY_KEYS = new Set([
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "searchTerm",
]);

const EventPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const normalizedQueryParams = new URLSearchParams();

  Object.keys(queryParamsObjects).forEach((key) => {
    if (!EVENT_ALLOWED_QUERY_KEYS.has(key)) {
      return;
    }

    const rawValue = queryParamsObjects[key];
    if (rawValue === undefined) {
      return;
    }

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        const normalizedValue = value.trim();
        if (normalizedValue) {
          normalizedQueryParams.append(key, normalizedValue);
        }
      });
      return;
    }

    const normalizedValue = rawValue.trim();
    if (normalizedValue) {
      normalizedQueryParams.set(key, normalizedValue);
    }
  });

  const queryString = normalizedQueryParams.toString();
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', queryString],
    queryFn: () => getEvents(queryString),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
  })

  return <div>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventBanner />
      <EventList initialQueryString={queryString} />
    </HydrationBoundary>
  </div>;
};

export default EventPage;