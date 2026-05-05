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
      case "APPROVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REJECTED": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  // Reusable Select Style for Mobile and Desktop
  const selectTriggerClass = "flex-1 min-w-[140px] h-12 px-4 bg-background border border-border rounded-2xl text-base md:text-sm font-bold text-foreground outline-none hover:border-primary/50 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 shadow-sm";

  return (
    <div className="w-full mx-auto space-y-6 md:space-y-8 p-4 md:p-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <LayoutGrid size={14} />
            Management
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">My Events</h1>
          <p className="text-muted-foreground text-sm font-medium">Organize, track, and manage your event listings.</p>
        </div>
        
        <div className="flex items-center justify-between p-5 bg-card rounded-2xl border border-border shadow-sm md:w-64">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Hosted</p>
            <p className="text-2xl font-black text-foreground leading-none mt-2 tracking-tight">{meta?.total ?? 0}</p>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="relative lg:col-span-5 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search event title..."
            className="h-12 pl-12 pr-28 bg-background border-border rounded-2xl text-base md:text-sm font-medium focus-visible:ring-primary/10 shadow-sm"
            disabled={isBusy}
          />
          <Button 
            size="sm" 
            onClick={handleSearch} 
            disabled={isBusy} 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-row gap-3 lg:col-span-7 w-full">
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
            <option value="per_person_price:desc">Price High</option>
            <option value="per_person_price:asc">Price Low</option>
            <option value="capacity:desc">Capacity High</option>
            <option value="capacity:asc">Capacity Low</option>
          </select>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearAll} 
            className="h-12 w-12 rounded-2xl border-border bg-background text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all flex-shrink-0"
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
            <div className="h-40 w-full animate-pulse bg-muted rounded-3xl" />
          ) : events.length === 0 ? (
            <div className="py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
               <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">No events found</p>
            </div>
          ) : (
            events.map((event) => (
              <Link 
                key={event.id} 
                href={`${basePath}/${event.id}`}
                className="bg-card p-5 rounded-[2rem] border border-border shadow-sm active:scale-[0.98] transition-all block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border bg-muted">
                    {event.images?.[0] ? (
                      <img src={event.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground/40"><ImageOff size={20} /></div>
                    )}
                  </div>
                  <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border", statusStyles(event.status))}>
                    {event.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-foreground mb-2 line-clamp-1 tracking-tight">{event.title}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <MapPin size={14} className="text-primary" /> {event.location || "Cox's Bazar"}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Users size={14} /> {event.remaining_seats}/{event.capacity}</span>
                    <span className="font-black text-foreground text-base tracking-tight">৳{event.per_person_price}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-widest">#{event.id.slice(-6).toUpperCase()}</span>
                  <span className="text-xs font-black text-primary flex items-center gap-1 uppercase tracking-widest">Details <ChevronRight size={14} /></span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="pl-8 py-5 text-[10px] font-black text-muted-foreground text-left uppercase tracking-[0.2em]">Event Listing</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground text-left uppercase tracking-[0.2em]">Location</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground text-center uppercase tracking-[0.2em]">Availability</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground text-center uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground text-left uppercase tracking-[0.2em]">Price</th>
                <th className="pr-8 py-5 text-[10px] font-black text-muted-foreground text-right uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isBusy && events.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={6} className="px-8 py-6 h-24 bg-muted/20" /></tr>
                ))
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="py-28 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest">No matching events found</td></tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border bg-muted flex-shrink-0">
                           {event.images?.[0] ? (
                            <img src={event.images[0]} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-700" />
                           ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30"><ImageOff size={20} /></div>
                           )}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1 tracking-tight">{event.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono font-bold mt-1.5 uppercase tracking-widest">#{event.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                        <MapPin size={14} className="text-primary" />
                        <span className="truncate max-w-[150px]">{event.location || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-foreground tracking-tight">{event.remaining_seats} / {event.capacity}</span>
                        <div className="w-12 h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(event.remaining_seats / event.capacity) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-none", statusStyles(event.status))}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-lg font-black text-foreground tracking-tighter">৳{event.per_person_price.toLocaleString()}</span>
                    </td>
                    <td className="pr-8 py-6 text-right">
                      <Button asChild variant="ghost" size="sm" className="rounded-2xl h-10 px-4 hover:bg-primary hover:text-primary-foreground transition-all group/btn border border-transparent hover:border-primary">
                        <Link href={`${basePath}/${event.id}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-t border-border pt-8">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          Found {meta?.total ?? 0} listings in archive
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