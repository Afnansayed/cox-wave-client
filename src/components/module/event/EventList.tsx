'use client';

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/app/(withCommonLayout)/event/_actions";
import EventCard from "./EventCard";
import { useSearchParams } from "next/navigation";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const Pagination = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
<div className="flex flex-wrap items-center justify-center gap-3 pt-8">
  {/* PREVIOUS BUTTON */}
  <Button
    type="button"
    variant="ghost"
    onClick={() => onPageChange(currentPage - 1)}
    disabled={isLoading || currentPage <= 1}
    className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
  >
    <ChevronLeft size={14} className="mr-1" />
    Prev
  </Button>

  {/* PAGE NUMBERS */}
  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
    {pageNumbers.map((page) => (
      <Button
        key={page}
        type="button"
        variant={page === currentPage ? "default" : "ghost"}
        onClick={() => onPageChange(page)}
        disabled={isLoading}
        className={cn(
          "h-9 w-9 rounded-full text-xs font-black transition-all duration-300",
          page === currentPage 
            ? "bg-primary text-white shadow-lg scale-110" 
            : "text-neutral-500 hover:bg-white hover:text-primary hover:shadow-sm"
        )}
      >
        {page}
      </Button>
    ))}
  </div>

  {/* NEXT BUTTON */}
  <Button
    type="button"
    variant="ghost"
    onClick={() => onPageChange(currentPage + 1)}
    disabled={isLoading || currentPage >= totalPages}
    className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
  >
    Next
    <ChevronRight size={14} className="ml-1" />
  </Button>
</div>
  );
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

  console.log('Events Response:', { eventsResponse, events, meta, totalPages });

  const isBusy = isLoading || isFetching || isRouteRefreshPending;

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container-max px-6">
        {isBusy && (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            Loading events...
          </div>
        )}

        {!isBusy && events.length === 0 && (
          <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
            No events found for your current search/filter.
          </div>
        )}

        {!isBusy && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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