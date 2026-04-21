"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Hash, ImageOff, MapPin, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Common/Pagination";
import { getOwnerEvents } from "@/components/services/event.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventStatus } from "@/types/event.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const EventDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") || "");

  const page = Number(searchParams.get("page") || DEFAULT_PAGE);
  const limit = Number(searchParams.get("limit") || DEFAULT_LIMIT);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const status = searchParams.get("status") || "ALL";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    if (searchParams.get("searchTerm")) {
      params.set("searchTerm", searchParams.get("searchTerm") as string);
    }

    if (status !== "ALL") {
      params.set("status", status);
    }

    return params.toString();
  }, [page, limit, searchParams, sortBy, sortOrder, status]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["owner-events", queryString],
    queryFn: () => getOwnerEvents(queryString),
  });

  const events = Array.isArray(data?.data?.data) ? data.data.data : [];
  const meta = data?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / (meta.limit || DEFAULT_LIMIT)) : 1;
  const isBusy = isLoading || isFetching;

  const setParam = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleSearch = () => {
    setParam({ searchTerm: searchInput.trim() || undefined, page: "1" });
  };

  const handleStatus = (value: string) => {
    setParam({ status: value === "ALL" ? undefined : value, page: "1" });
  };

  const handleSort = (value: string) => {
    if (value === "default") {
      setParam({ sortBy: undefined, sortOrder: undefined, page: "1" });
      return;
    }

    const [nextSortBy, nextSortOrder] = value.split(":");
    setParam({ sortBy: nextSortBy, sortOrder: nextSortOrder, page: "1" });
  };

  const handlePage = (nextPage: number) => {
    setParam({ page: String(nextPage) });
  };

  const clearAll = () => {
    setSearchInput("");
    setParam({
      searchTerm: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      page: "1",
      limit: String(DEFAULT_LIMIT),
    });
  };

  const statusClass = (eventStatus: EventStatus) => {
    switch (eventStatus) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const sortValue = `${sortBy}:${sortOrder}`;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Events</h1>
          <p className="text-sm text-muted-foreground">Total Events: {meta?.total ?? 0}</p>
        </div>
      </div>

      <div>
        <Button asChild>
          <Link href="/owner-dashboard/event/create">
            <CalendarDays className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>
      <div className="rounded-2xl border bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by event title"
              className="pl-9"
              disabled={isBusy}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={handleSearch} disabled={isBusy}>Search</Button>

            <select
              value={status}
              onChange={(e) => handleStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={sortValue}
              onChange={(e) => handleSort(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="createdAt:desc">Newest</option>
              <option value="createdAt:asc">Oldest</option>
              <option value="per_person_price:desc">Price High</option>
              <option value="per_person_price:asc">Price Low</option>
              <option value="capacity:desc">Capacity High</option>
              <option value="capacity:asc">Capacity Low</option>
            </select>

            <Button type="button" variant="outline" onClick={clearAll} disabled={isBusy}>Clear</Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Event</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Location</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Price</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Capacity</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Created</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isBusy ? (
                [...Array(4)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-4" colSpan={7}>
                      <div className="h-10 animate-pulse rounded bg-muted/40" />
                    </td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-sm text-muted-foreground" colSpan={7}>
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-t align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded border bg-muted">
                          {event.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={event.images[0]} alt={event.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ImageOff className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {event.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold">${event.per_person_price}</td>
                    <td className="px-4 py-4 text-sm">{event.remaining_seats}/{event.capacity}</td>
                    <td className="px-4 py-4">
                      <Badge className={statusClass(event.status)}>{event.status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/owner-dashboard/event/${event.id}`}>
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/owner-dashboard/event/${event.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Showing {events.length} records
        </p>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          isLoading={isBusy}
          onPageChange={handlePage}
        />
      </div>
    </section>
  );
};

export default EventDashboard;
