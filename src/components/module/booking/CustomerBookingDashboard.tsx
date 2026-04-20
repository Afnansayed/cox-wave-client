"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { getBooking } from "@/components/services/booking.services";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { Pagination } from "@/components/Common/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IBookingListItem } from "@/types/booking.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const BOOKING_ALLOWED_QUERY_KEYS = new Set([
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "searchTerm",
  "status",
]);

const getSanitizedBookingQueryString = (queryString: string) => {
  const currentParams = new URLSearchParams(queryString);
  const sanitizedParams = new URLSearchParams();

  currentParams.forEach((value, key) => {
    if (!BOOKING_ALLOWED_QUERY_KEYS.has(key)) {
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

const CustomerBookingDashboard = () => {
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") || "");

  const {
    queryStringFromUrl,
    optimisticPaginationState,
    optimisticSortingState,
    isRouteRefreshPending,
    updateParams,
    handlePaginationChange,
    handleSortingChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = useMemo(() => {
    return getSanitizedBookingQueryString(queryStringFromUrl);
  }, [queryStringFromUrl]);

  const { data: bookingResponse, isLoading, isFetching } = useQuery({
    queryKey: ["bookings", queryString],
    queryFn: () => getBooking(queryString),
  });

  const rows = Array.isArray(bookingResponse?.data?.data)
    ? bookingResponse.data.data
    : [];

  const meta = bookingResponse?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / (meta.limit || DEFAULT_LIMIT)) : 1;
  const isBusy = isLoading || isFetching || isRouteRefreshPending;

  const currentStatus = searchParams.get("status") || "ALL";
  const currentLimit = searchParams.get("limit") || String(DEFAULT_LIMIT);
  const sortValue = optimisticSortingState[0]
    ? `${optimisticSortingState[0].id}:${optimisticSortingState[0].desc ? "desc" : "asc"}`
    : "default";

  const handleSearch = () => {
    const normalizedValue = searchInput.trim();
    updateParams({ searchTerm: normalizedValue || undefined, page: "1" });
  };

  const handleStatusChange = (value: string) => {
    updateParams({ status: value === "ALL" ? undefined : value, page: "1" });
  };

  const handleSortChange = (value: string) => {
    if (value === "default") {
      handleSortingChange([]);
      return;
    }

    const [sortBy, sortOrder] = value.split(":");
    handleSortingChange([{ id: sortBy, desc: sortOrder === "desc" }]);
  };

  const handleLimitChange = (value: string) => {
    updateParams({ limit: value, page: "1" }, false);
  };

  const clearAll = () => {
    setSearchInput("");
    updateParams(
      {
        searchTerm: undefined,
        status: undefined,
        sortBy: undefined,
        sortOrder: undefined,
        limit: String(DEFAULT_LIMIT),
        page: "1",
      },
      false,
    );
  };

  const getPaymentBadge = (row: IBookingListItem) => {
    if (row.payment_status === "PAID") {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">PAID</Badge>;
    }
    return <Badge variant="secondary">{row.payment_status}</Badge>;
  };

  return (
    <section className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Filter and track your bookings with pagination, sorting, and search.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-xl border px-3 py-2">
            <Search size={16} className="text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by event title..."
              className="border-0 p-0 shadow-none focus-visible:ring-0"
              disabled={isBusy}
            />
            <Button type="button" size="sm" onClick={handleSearch} disabled={isBusy}>
              Search
            </Button>
          </div>

          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-9 rounded-md border bg-white px-3 text-sm"
            disabled={isBusy}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-9 rounded-md border bg-white px-3 text-sm"
            disabled={isBusy}
          >
            <option value="default">Default Sort</option>
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="total_amount:desc">Amount High-Low</option>
            <option value="total_amount:asc">Amount Low-High</option>
            <option value="seats:desc">Seats High-Low</option>
            <option value="seats:asc">Seats Low-High</option>
          </select>

          <select
            value={currentLimit}
            onChange={(e) => handleLimitChange(e.target.value)}
            className="h-9 rounded-md border bg-white px-3 text-sm"
            disabled={isBusy}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>

          <Button type="button" variant="outline" onClick={clearAll} disabled={isBusy}>
            Clear All
          </Button>
        </div>
      </div>

      {isBusy && (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">Loading bookings...</div>
      )}

      {!isBusy && rows.length === 0 && (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          No bookings found for current filters.
        </div>
      )}

      {!isBusy && rows.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {rows.map((row) => (
              <article key={row.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking ID</p>
                    <p className="font-medium">{row.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{row.status}</Badge>
                    {getPaymentBadge(row)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Event</p>
                    <p className="font-medium">{row.event?.title || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{row.event?.location || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <p className="font-medium">{row.seats}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-medium">৳{row.total_amount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium">{new Date(row.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/customer-dashboard/booking/${row.id}`}>View Details</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>

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
            Total {meta?.total ?? 0} bookings
          </p>
        </div>
      )}
    </section>
  );
};

export default CustomerBookingDashboard;
