"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  RotateCcw,
  ArrowRight,
  ChevronRight,
  ImageOff,
  Users,
  LayoutGrid
} from "lucide-react";
import { getOwnerEvents } from "@/components/services/event.service";
import { Pagination } from "@/components/Common/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EventStatus } from "@/types/event.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const EventDashboard = ({ basePath }: { basePath: string }) => {
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
    if (searchParams.get("searchTerm")) params.set("searchTerm", searchParams.get("searchTerm") as string);
    if (status !== "ALL") params.set("status", status);
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
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleSearch = () => setParam({ searchTerm: searchInput.trim() || undefined, page: "1" });
  const handleStatus = (value: string) => setParam({ status: value === "ALL" ? undefined : value, page: "1" });
  const handleSort = (value: string) => {
    const [nextSortBy, nextSortOrder] = value.split(":");
    setParam({ sortBy: nextSortBy, sortOrder: nextSortOrder, page: "1" });
  };
  const handlePage = (nextPage: number) => setParam({ page: String(nextPage) });
  const clearAll = () => {
    setSearchInput("");
    setParam({ searchTerm: undefined, status: undefined, sortBy: undefined, sortOrder: undefined, page: "1" });
  };

  const statusStyles = (eventStatus: EventStatus) => {
    switch (eventStatus) {
      case "APPROVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  // Reusable Select Style for Mobile and Desktop
  const selectTriggerClass = "flex-1 min-w-[140px] h-12 px-4 bg-white border border-slate-200 rounded-2xl text-base md:text-sm font-medium text-slate-700 outline-none hover:border-slate-300 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 shadow-sm";

  return (
    <div className="w-full mx-auto space-y-6 md:space-y-8 p-4 md:p-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-widest mb-1">
            <LayoutGrid size={14} />
            Management
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Events</h1>
          <p className="text-slate-500 text-sm">Organize, track, and manage your event listings.</p>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm md:w-64">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Hosted</p>
            <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{meta?.total ?? 0}</p>
          </div>
          {/* <Button asChild className="rounded-xl h-10 px-5 bg-primary hover:opacity-90">
            <Link href={`${basePath}/create`} className="text-xs font-semibold">Create Event</Link>
          </Button> */}
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="relative lg:col-span-5 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search event title..."
            className="h-12 pl-11 pr-24 bg-white border-slate-200 rounded-2xl text-base md:text-sm focus-visible:ring-primary/10 shadow-sm"
            disabled={isBusy}
          />
          <Button 
            size="sm" 
            onClick={handleSearch} 
            disabled={isBusy} 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 bg-black text-white hover:bg-black/90 rounded-xl text-xs font-medium"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-row gap-2 lg:col-span-7 w-full">
          <select
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            className={selectTriggerClass}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => handleSort(e.target.value)}
            className={selectTriggerClass}
          >
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="per_person_price:desc">Price ↑</option>
            <option value="per_person_price:asc">Price ↓</option>
            <option value="capacity:desc">Capacity ↑</option>
            <option value="capacity:asc">Capacity ↓</option>
          </select>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearAll} 
            className="h-12 w-12 rounded-2xl border-slate-200 text-slate-400 hover:text-primary transition-all flex-shrink-0"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative">
        {/* MOBILE CARDS */}
        <div className="flex flex-col gap-4 md:hidden">
          {isBusy && events.length === 0 ? (
            <div className="h-40 w-full animate-pulse bg-slate-50 rounded-3xl" />
          ) : events.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 text-sm font-medium">No events found</p>
            </div>
          ) : (
            events.map((event) => (
              <Link 
                key={event.id} 
                href={`${basePath}/${event.id}`}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                    {event.images?.[0] ? (
                      <img src={event.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300"><ImageOff size={20} /></div>
                    )}
                  </div>
                  <Badge className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border", statusStyles(event.status))}>
                    {event.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={14} className="text-slate-400" /> {event.location || "Online"}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-400" /> {event.remaining_seats}/{event.capacity}</span>
                    <span className="font-bold text-slate-900 text-sm">৳{event.per_person_price}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">#{event.id.slice(-6).toUpperCase()}</span>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">Details <ChevronRight size={14} /></span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="pl-8 py-5 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Event Details</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Location</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-center uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-center uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Price</th>
                <th className="pr-8 py-5 text-xs font-semibold text-slate-500 text-right uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isBusy && events.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/30" /></tr>
                ))
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center text-slate-400 text-sm font-medium">No events found</td></tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                           {event.images?.[0] ? (
                            <img src={event.images[0]} alt="" className="h-full w-full object-cover" />
                           ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300"><ImageOff size={18} /></div>
                           )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-1">{event.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-1">#{event.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="truncate max-w-[150px]">{event.location || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-sm font-semibold text-slate-700">{event.remaining_seats} / {event.capacity}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Badge className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter border", statusStyles(event.status))}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-base font-bold text-slate-900 tracking-tight">৳{event.per_person_price.toLocaleString()}</span>
                    </td>
                    <td className="pr-8 py-6 text-right">
                      <Button asChild variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-primary hover:text-white transition-all group/btn">
                        <Link href={`${basePath}/${event.id}`} className="flex items-center gap-2 text-xs font-semibold">
                          Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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

      {/* FOOTER / PAGINATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-t border-slate-100 pt-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Showing {events.length} records
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          isLoading={isBusy}
          onPageChange={handlePage}
        />
      </div>
    </div>
  );
};

export default EventDashboard;