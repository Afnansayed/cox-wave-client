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
  ArrowRight,
  Hash,
  ChevronRight,
  Ticket
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

const CustomerBookingDashboard = ({
  basePath = "/customer-dashboard/booking",
}) => {
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
    <div className="w-full  mx-auto space-y-8">
      
      {/* 1. HERO SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm">Review your history and active reservations.</p>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm md:w-64">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900">{meta?.total ?? 0}</p>
          </div>
         {
          basePath === "/customer-dashboard/booking" && (
           <Button asChild size="sm" className="rounded-xl h-10 px-5 shadow-sm">
            <Link href="/events">Book New</Link>
          </Button>)
         }
        </div>
      </div>

      {/* 2. FILTER TOOLBAR */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search bookings..."
            className="h-12 pl-11 pr-24 bg-white border-slate-200 rounded-2xl focus-visible:ring-primary/10 shadow-sm"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 lg:col-span-6">
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary/5 transition-all appearance-none"
          >
            <option value="ALL">Status: All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
          </select>

          <select
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary/5 transition-all appearance-none"
          >
            <option value="default">Sort By</option>
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="total_amount:desc">Highest Price</option>
            <option value="total_amount:asc">Lowest Price</option>
          </select>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearAll} 
            className="h-12 w-12 rounded-2xl border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex-shrink-0"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>

      {/* 3. CONTENT AREA: MOBILE CARDS / DESKTOP TABLE */}
      <div className="relative min-h-[400px]">
        {isBusy && (
          <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
             <RotateCcw className="animate-spin text-primary" />
          </div>
        )}

        {/* MOBILE LIST (Visible only on < 768px) */}
        <div className="flex flex-col gap-4 md:hidden">
          {rows.length === 0 && !isBusy ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 text-sm">No bookings found</p>
            </div>
          ) : (
            rows.map((row) => (
              <Link 
                key={row.id} 
                href={`${basePath}/${row.id}`}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className={cn(
                    "rounded-lg px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                    row.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600"
                  )}>
                    {row.status}
                  </Badge>
                  <span className="text-lg font-bold text-slate-900">৳{row.total_amount.toLocaleString()}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{row.event?.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(row.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} /> {row.seats} Guests</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-mono tracking-tighter">ID: {row.id.slice(-8).toUpperCase()}</span>
                  <span className="text-[10px] font-medium flex items-center gap-1">Details <ChevronRight size={12} /></span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* DESKTOP TABLE (Visible only on >= 768px) */}
        <div className="hidden md:block bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="pl-8 py-5 text-xs font-semibold text-slate-500 text-left">Event & Ref</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-center">Status</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-center">Guests</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-left">Amount</th>
                <th className="pr-8 py-5 text-xs font-semibold text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="pl-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{row.event?.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">#{row.id.slice(-8).toUpperCase()} • {new Date(row.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-1">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-medium",
                        row.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {row.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-sm font-medium text-slate-700">{row.seats} Guests</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-base font-bold text-slate-900">৳{row.total_amount.toLocaleString()}</span>
                  </td>
                  <td className="pr-8 py-6 text-right">
                    <Button asChild variant="ghost" size="sm" className="rounded-xl hover:bg-slate-100">
                      <Link href={`${basePath}/${row.id}`} className="flex items-center gap-2">
                        View <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. FOOTER / PAGINATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
        <p className="text-xs font-medium text-slate-400">
          Showing {rows.length} of {meta?.total ?? 0} results
        </p>
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
  );
};

export default CustomerBookingDashboard;