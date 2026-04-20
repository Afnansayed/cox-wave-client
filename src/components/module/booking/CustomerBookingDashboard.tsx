"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Calendar, 
  Users, 
  RotateCcw,
  LayoutGrid,
  ArrowRight,
  Hash,
  Filter
} from "lucide-react";
import { getBooking } from "@/components/services/booking.services";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { Pagination } from "@/components/Common/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const BOOKING_ALLOWED_QUERY_KEYS = new Set([
  "page", "limit", "sortBy", "sortOrder", "searchTerm", "status",
]);

const getSanitizedBookingQueryString = (queryString: string) => {
  const currentParams = new URLSearchParams(queryString);
  const sanitizedParams = new URLSearchParams();
  currentParams.forEach((value, key) => {
    if (!BOOKING_ALLOWED_QUERY_KEYS.has(key)) return;
    const normalizedValue = value.trim();
    if (!normalizedValue) return;
    sanitizedParams.set(key, normalizedValue);
  });
  return sanitizedParams.toString();
};

type CustomerBookingDashboardProps = {
  basePath?: string;
};

const CustomerBookingDashboard = ({
  basePath = "/customer-dashboard/booking",
}: CustomerBookingDashboardProps) => {
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

  const rows = Array.isArray(bookingResponse?.data?.data) ? bookingResponse.data.data : [];
  const meta = bookingResponse?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / (meta.limit || DEFAULT_LIMIT)) : 1;
  const isBusy = isLoading || isFetching || isRouteRefreshPending;

  const currentStatus = searchParams.get("status") || "ALL";
  const sortValue = optimisticSortingState[0]
    ? `${optimisticSortingState[0].id}:${optimisticSortingState[0].desc ? "desc" : "asc"}`
    : "default";

  const handleSearch = () => updateParams({ searchTerm: searchInput.trim() || undefined, page: "1" });
  const handleStatusChange = (value: string) => updateParams({ status: value === "ALL" ? undefined : value, page: "1" });
  const handleSortChange = (value: string) => {
    if (value === "default") { handleSortingChange([]); return; }
    const [sortBy, sortOrder] = value.split(":");
    handleSortingChange([{ id: sortBy, desc: sortOrder === "desc" }]);
  };
  const clearAll = () => {
    setSearchInput("");
    updateParams({ searchTerm: undefined, status: undefined, sortBy: undefined, sortOrder: undefined, limit: String(DEFAULT_LIMIT), page: "1" }, false);
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      <section className="container-max mx-auto space-y-6 md:space-y-8 p-4 md:p-8">
        
        {/* Header Section - Stacks on mobile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.25em]">
              <LayoutGrid size={14} />
              Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-text-primary leading-none">My Bookings</h1>
            <p className="text-text-secondary text-xs md:text-sm font-medium">Manage your reservations and view updates.</p>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4 bg-white/50 p-2 rounded-2xl md:rounded-[2rem] border border-secondary/20 shadow-sm">
            <div className="px-4 md:px-6 py-1 md:py-2">
               <p className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-widest leading-tight">Total</p>
               <p className="text-xl md:text-2xl font-black text-text-primary leading-tight">{meta?.total ?? 0}</p>
            </div>
            <Button asChild className="bg-primary hover:opacity-90 transition-opacity rounded-xl md:rounded-2xl h-10  px-6 md:px-8 shadow-lg shadow-primary/20 flex-shrink-0">
                <Link href="/events" className="font-black text-[10px] md:text-xs uppercase tracking-widest text-white">Book Now</Link>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar - Horizontal scroll on very small screens, wraps on mobile */}
        <div className="bg-white rounded-2xl md:rounded-[2rem] border border-secondary/10 p-2 md:p-3 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search bookings..."
              className="h-11 md:h-12 pl-12 pr-20 bg-primary/5 border-none rounded-xl md:rounded-2xl text-sm font-medium placeholder:text-text-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
              disabled={isBusy}
            />
            <Button size="sm" onClick={handleSearch} disabled={isBusy} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-text-primary hover:bg-primary h-8 text-[9px] uppercase font-black tracking-widest">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-11 md:h-12 px-3 md:px-4 bg-white border border-secondary/20 rounded-xl md:rounded-2xl text-[10px] font-black text-text-secondary uppercase tracking-widest cursor-pointer hover:border-primary transition-colors outline-none flex-shrink-0"
            >
              <option value="ALL">Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PROCESSING">Processing</option>
              <option value="CONFIRMED">Confirmed</option>
            </select>

            <select
              value={sortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-11 md:h-12 px-3 md:px-4 bg-white border border-secondary/20 rounded-xl md:rounded-2xl text-[10px] font-black text-text-secondary uppercase tracking-widest cursor-pointer hover:border-primary transition-colors outline-none flex-shrink-0"
            >
              <option value="default">Sort</option>
              <option value="createdAt:desc">Newest</option>
              <option value="total_amount:desc">Amount</option>
            </select>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={clearAll} 
              className="rounded-xl md:rounded-2xl h-11 md:h-12 w-11 md:w-12 border-secondary/20 text-text-secondary hover:text-primary hover:border-primary transition-all flex-shrink-0"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>

        {/* Data Table - Selective columns on mobile */}
        <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-secondary/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-secondary/10">
                  <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Ref ID</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Event Details</th>
                  <th className="hidden sm:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary text-center">Guests</th>
                  <th className="px-4 md:px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary text-center md:text-left">Status</th>
                  <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Amount</th>
                  <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {isBusy ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-8 bg-primary/5" />
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 md:py-32 text-center">
                      <p className="text-text-secondary font-black uppercase text-[10px] md:text-xs tracking-[0.3em]">No Bookings Found</p>
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="hover:bg-primary/5 transition-colors group">
                      {/* Ref ID - Hidden on Mobile */}
                      <td className="hidden md:table-cell px-8 py-6">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-black text-text-secondary/60 group-hover:text-primary transition-colors">
                          <Hash size={12} /> {row.id.slice(-6).toUpperCase()}
                        </div>
                      </td>
                      
                      {/* Event Details - Main column */}
                      <td className="px-6 md:px-8 py-4 md:py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-text-primary text-sm md:text-base leading-tight line-clamp-1">{row.event?.title}</span>
                          <span className="text-[9px] md:text-[10px] text-text-secondary font-black flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                            <Calendar size={10} className="text-primary" /> 
                            {new Date(row.createdAt).toLocaleDateString()}
                          </span>
                          {/* Mobile-only guest count */}
                          <span className="sm:hidden text-[9px] text-text-secondary/60 font-black flex items-center gap-1.5 uppercase mt-0.5 tracking-tighter">
                            <Users size={10} /> {row.seats} Seats
                          </span>
                        </div>
                      </td>

                      {/* Guests - Hidden on Mobile */}
                      <td className="hidden sm:table-cell px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-1.5 font-black text-text-primary text-sm">
                           <Users size={14} className="text-text-secondary" /> {row.seats}
                        </div>
                      </td>

                      {/* Status - Icons/Badges */}
                      <td className="px-4 md:px-8 py-4 md:py-6 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start gap-1">
                          <Badge className={cn(
                            "w-fit text-[8px] md:text-[10px] font-black uppercase px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-sm",
                            row.status === "CONFIRMED" ? "bg-primary text-white" : "bg-secondary text-text-primary"
                          )}>
                            {row.status}
                          </Badge>
                          <span className="hidden md:block text-[9px] font-black text-text-secondary uppercase tracking-widest pl-1">{row.payment_status}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 md:px-8 py-4 md:py-6">
                        <span className="font-black text-text-primary text-sm md:text-lg tracking-tighter">৳{row.total_amount.toLocaleString()}</span>
                      </td>

                      {/* Action - Simplified for mobile */}
                      <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                        <Button asChild variant="ghost" className="rounded-full  h-8  px-3 md:px-6 hover:bg-primary hover:text-white transition-all group/btn">
                          <Link href={`${basePath}/${row.id}`} className="flex items-center gap-1 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">
                            <span className="hidden sm:inline">Details</span> <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer - Stacks on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">
            Displaying {rows.length} records
          </p>
          <div className="w-full sm:w-auto">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerBookingDashboard;