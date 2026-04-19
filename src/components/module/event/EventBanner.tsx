"use client";

import { useSearchParams } from "next/navigation";
import { Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

const EVENT_SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "createdAt:desc", label: "Newest" },
  { value: "title:asc", label: "Title (A-Z)" },
  { value: "per_person_price:asc", label: "Price (Low to High)" },
  { value: "per_person_price:desc", label: "Price (High to Low)" },
];

const EVENT_LIMIT_OPTIONS = [
  { value: "6", label: "6 per page" },
  { value: "9", label: "9 per page" },
  { value: "12", label: "12 per page" },
  { value: "18", label: "18 per page" },
];

export default function EventBanner() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("searchTerm") || "",
  );

  const { updateParams, handleSortingChange, optimisticSortingState } =
    useServerManagedDataTable({
      searchParams,
      defaultPage: 1,
      defaultLimit: 9,
    });

  useEffect(() => {
    setSearchInput(searchParams.get("searchTerm") || "");
  }, [searchParams]);

  const currentLimit = searchParams.get("limit") || "9";
  const sortValue = optimisticSortingState[0]
    ? `${optimisticSortingState[0].id}:${optimisticSortingState[0].desc ? "desc" : "asc"}`
    : "default";

  const handleSortChange = (value: string) => {
    if (value === "default") {
      handleSortingChange([]);
    } else {
      const [sortBy, sortOrder] = value.split(":");
      handleSortingChange([{ id: sortBy, desc: sortOrder === "desc" }]);
    }
  };

  const handleLimitChange = (value: string) => {
    startTransition(() => {
      updateParams({ limit: value, page: "1" });
    });
  };

  const handleSearch = () => {
    const normalizedValue = searchInput.trim();
    updateParams({ searchTerm: normalizedValue || undefined });
  };

  return (
    <section className="">
      <div className="relative w-full overflow-hidden shadow-2xl bg-neutral-900 flex items-center justify-center">
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2000')`,
          }}
        >
          {/* CENTERED RADIAL OVERLAY */}
          <div className="absolute inset-0 bg-neutral-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/40" />
        </div>

        {/* CENTERED CONTENT */}
        <div className="container-max px-6 py-12 relative z-10 flex flex-col items-center text-center space-y-10">
          <div className="max-w-3xl space-y-6">
            {/* BADGE */}
            <div className="flex items-center justify-center gap-2">
              <div className="bg-secondary p-1.5 rounded-lg shadow-lg shadow-secondary/30">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-light">
                Premium Beach Events
              </span>
            </div>

            {/* TEXT CONTENT */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Ride the <span className="text-primary-light">Waves</span> of
                Cox's Bazar.
              </h1>
              <p className="text-sm md:text-lg text-neutral-200 font-medium max-w-xl mx-auto leading-relaxed">
                The ultimate destination to discover and book exclusive coastal{" "}
                <br className="hidden md:block" /> parties, tours, and yacht
                experiences.
              </p>
            </div>
          </div>

          {/* --- CENTERED INTEGRATED SEARCH FILTERS --- */}
<div className="w-full max-w-5xl">
  <div className="relative group">
    {/* Background Glow Effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />

    <div className="relative bg-white border border-neutral-100 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-2 flex flex-col md:flex-row items-center gap-2">
      
      {/* 1. SEARCH INPUT SECTION + COMPACT FIND BUTTON */}
      <div className="flex items-center gap-2 px-2 flex-1 w-full bg-neutral-50/50 rounded-full border border-neutral-100/50 ml-1">
        
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search events..."
          className="bg-transparent border-none outline-none text-sm font-bold text-neutral-800 w-full placeholder:text-neutral-400 h-11"
          disabled={isPending}
        />
        {/* FIND BUTTON NOW NEXT TO INPUT */}
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isPending}
          size="sm"
          className="rounded-full bg-primary hover:bg-primary-dark text-white font-black text-[10px] uppercase tracking-wider px-4 h-10 w-10 mr-1 shadow-md transition-transform active:scale-95"
        >
          {isPending ? <div className="h-3 w-3 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Search size={18} className="text-white flex-shrink-0 " />}
        </Button>
      </div>

      {/* VISUAL DIVIDER (Desktop Only) */}
      <div className="hidden md:block h-8 w-[1px] bg-neutral-100 mx-1" />

      {/* 2. FILTERS GROUP */}
      <div className="flex items-center gap-2 w-full md:w-auto px-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-secondary tracking-tighter ml-2">Sort</span>
          <select
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={isPending}
            className="bg-neutral-50 hover:bg-neutral-100 border-none text-xs font-bold py-2 px-3 rounded-xl cursor-pointer outline-none appearance-none"
          >
            {EVENT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-secondary tracking-tighter">Show</span>
          <select
            value={currentLimit}
            onChange={(e) => handleLimitChange(e.target.value)}
            disabled={isPending}
            className="bg-neutral-50 hover:bg-neutral-100 border-none text-xs font-bold py-2 px-3 rounded-xl cursor-pointer outline-none appearance-none"
          >
            {EVENT_LIMIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. CLEAR BUTTON */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          setSearchInput("");
          startTransition(() => {
            updateParams({
              searchTerm: undefined,
              sortBy: undefined,
              sortOrder: undefined,
              limit: "9",
              page: "1",
            });
          });
        }}
        disabled={isPending}
        className={cn(
          "w-full md:w-auto rounded-full h-12 px-8 font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 border border-neutral-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100",
          "bg-white text-neutral-500 mr-2"
        )}
      >
        Clear All
      </Button>
    </div>
  </div>
</div>
        </div>

        {/* AMBIENT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}
