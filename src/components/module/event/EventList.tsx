'use client';

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/app/(withCommonLayout)/event/_actions";
import EventCard from "./EventCard";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useMemo } from "react";
import { Pagination } from "../../Common/Pagination";
import { EventListLoading } from "@/app/(withCommonLayout)/event/loading";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;

const EVENT_ALLOWED_QUERY_KEYS = new Set([
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "searchTerm",
]);

const getSanitizedEventQueryString = (queryString: string) => {
  const currentParams = new URLSearchParams(queryString);
  const sanitizedParams = new URLSearchParams();

  currentParams.forEach((value, key) => {
    if (!EVENT_ALLOWED_QUERY_KEYS.has(key)) {
      return;
    }

    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return;
    }

    sanitizedParams.set(key, normalizedValue);
  });

  return sanitizedParams.toString();
};



const EventList = ({ initialQueryString }: { initialQueryString: string }) => {
  const searchParams = useSearchParams();

  const {
    queryStringFromUrl,
    optimisticPaginationState,
    isRouteRefreshPending,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = useMemo(() => {
    return getSanitizedEventQueryString(queryStringFromUrl || initialQueryString);
  }, [initialQueryString, queryStringFromUrl]);

  const { data: eventsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["events", queryString],
    queryFn: () => getEvents(queryString),
  });

  const events = Array.isArray(eventsResponse?.data?.data) ? eventsResponse.data.data : [];
  const meta = eventsResponse?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / (meta.limit || DEFAULT_LIMIT)) : 1;

  // console.log('Events Response:', { eventsResponse, events, meta, totalPages });

  const isBusy = isLoading || isFetching || isRouteRefreshPending;

  return (
    <div className="bg-background py-12">
      <div className="container-max px-6">
        {isBusy && (
          <div className="">
            <EventListLoading />
          </div>
        )}

        {!isBusy && events.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-sm">
            No events found for your current search/filter.
          </div>
        )}

        {!isBusy && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <Pagination
                currentPage={optimisticPaginationState.pageIndex + 1}
                totalPages={totalPages}
                isLoading={isBusy}
                onPageChange={(page) => {
                  handlePaginationChange({
                    pageIndex: page - 1,
                    pageSize: optimisticPaginationState.pageSize,
                  });
                }}
              />

              <p className="text-center text-sm text-muted-foreground">
                Total {meta?.total ?? 0} events
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;