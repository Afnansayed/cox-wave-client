"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  CalendarDays, 
  Hash, 
  ImageOff, 
  MapPin, 
  Search, 
  RotateCcw, 
  Plus, 
  ChevronRight, 
  Users, 
  ArrowRight,
  LayoutGrid
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Common/Pagination";
import { getOwnerEvents } from "@/components/services/event.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventStatus } from "@/types/event.types";
import { cn } from "@/lib/utils";

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
    setParam({
      searchTerm: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      page: "1",
      limit: String(DEFAULT_LIMIT),
    });
  };

  const statusStyles = (eventStatus: EventStatus) => {
    switch (eventStatus) {
      case "APPROVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const selectTriggerClass = "flex-1 min-w-[140px] h-12 px-4 bg-card border border-border rounded-2xl text-base md:text-sm font-medium text-foreground outline-none hover:border-primary transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 shadow-sm";

  return (
    <div className="w-full mx-auto space-y-6 md:space-y-8 p-4 md:p-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-widest mb-1">
            <LayoutGrid size={14} />
            Management
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Events</h1>
          <p className="text-muted-foreground text-sm">Organize and track your hosting schedule.</p>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border shadow-sm md:w-64">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Hosted</p>
            <p className="text-2xl font-bold text-foreground leading-none mt-1">{meta?.total ?? 0}</p>
          </div>
          <Button asChild className="rounded-xl h-10 px-5 bg-primary hover:opacity-90">
            <Link href="/owner-dashboard/event/create" className="text-xs font-semibold flex items-center gap-2 text-white">
              <Plus size={14} /> Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="relative lg:col-span-5 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search event title..."
            className="h-12 pl-11 pr-24 bg-card border-border rounded-2xl text-base md:text-sm focus-visible:ring-primary/10 shadow-sm text-foreground"
            disabled={isBusy}
          />
          <Button 
            size="sm" 
            onClick={handleSearch} 
            disabled={isBusy} 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-medium"
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
            <option value="ALL" className="bg-card">All Status</option>
            <option value="PENDING" className="bg-card">Pending</option>
            <option value="APPROVED" className="bg-card">Approved</option>
            <option value="REJECTED" className="bg-card">Rejected</option>
          </select>

          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => handleSort(e.target.value)}
            className={selectTriggerClass}
          >
            <option value="createdAt:desc" className="bg-card">Newest</option>
            <option value="createdAt:asc" className="bg-card">Oldest</option>
            <option value="per_person_price:desc" className="bg-card">Price ↑</option>
            <option value="per_person_price:asc" className="bg-card">Price ↓</option>
            <option value="capacity:desc" className="bg-card">Capacity ↑</option>
            <option value="capacity:asc" className="bg-card">Capacity ↓</option>
          </select>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearAll} 
            className="h-12 w-12 rounded-2xl border-border text-muted-foreground hover:text-primary transition-all flex-shrink-0"
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
            [...Array(3)].map((_, i) => <div key={i} className="h-40 w-full animate-pulse bg-muted rounded-[2rem]" />)
          ) : events.length === 0 ? (
            <div className="py-20 text-center bg-muted rounded-3xl border border-dashed border-border">
               <p className="text-muted-foreground text-sm font-medium">No events found</p>
            </div>
          ) : (
            events.map((event) => (
              <Link 
                key={event.id} 
                href={`/owner-dashboard/event/${event.id}`}
                className="bg-card p-5 rounded-[2rem] border border-border shadow-sm active:scale-[0.98] transition-all block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border bg-muted">
                    {event.images?.[0] ? (
                      <img src={event.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground"><ImageOff size={20} /></div>
                    )}
                  </div>
                  <Badge className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border", statusStyles(event.status))}>
                    {event.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin size={14} className="text-muted-foreground" /> {event.location || "Online"}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-muted-foreground" /> {event.remaining_seats}/{event.capacity}</span>
                    <span className="font-bold text-foreground text-sm">৳{event.per_person_price}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">#{event.id.slice(-6).toUpperCase()}</span>
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold px-2 text-foreground">
                       <Link href={`/owner-dashboard/event/${event.id}/edit`}>Edit</Link>
                    </Button>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">Details <ChevronRight size={14} /></span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="pl-8 py-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Details</th>
                <th className="px-6 py-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-6 py-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-5 text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Status</th>
                <th className="pr-8 py-5 text-xs font-semibold text-muted-foreground text-right uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isBusy && events.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={6} className="px-8 py-6 h-20 bg-muted/30" /></tr>
                ))
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center text-muted-foreground text-sm font-medium">No events found</td></tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0">
                           {event.images?.[0] ? (
                            <img src={event.images[0]} alt="" className="h-full w-full object-cover" />
                           ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground"><ImageOff size={18} /></div>
                           )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">{event.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-1">
                            <Hash size={10} /> {event.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{event.location || "Online"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-foreground tracking-tight">৳{event.per_person_price}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-semibold text-foreground">{event.remaining_seats} / {event.capacity}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Badge className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter border", statusStyles(event.status))}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="pr-8 py-6 text-right">
                      <div className="flex justify-end gap-2  transition-opacity">
                         <Button asChild variant="outline" size="sm" className="rounded-xl h-9 text-xs font-semibold border-border text-foreground">
                          <Link href={`/owner-dashboard/event/${event.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-primary hover:text-white transition-all group/btn text-foreground">
                          <Link href={`/owner-dashboard/event/${event.id}`} className="flex items-center gap-2 text-xs font-semibold">
                            Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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

      {/* FOOTER / PAGINATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-t border-border pt-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
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