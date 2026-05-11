'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Ticket,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/app/(withCommonLayout)/event/_actions';
import { useQuery } from '@tanstack/react-query';
import { IEvent } from '@/types/event.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EventSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: eventsResponse, isLoading } = useQuery({
    queryFn: () => getEvents(undefined),
    queryKey: ["events", "popular"],
    staleTime: 1000 * 60 * 5,
  });

  const events = Array.isArray(eventsResponse?.data?.data) ? eventsResponse.data.data : [];

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      // স্ক্রল ডিস্ট্যান্স ৪টি কার্ডের জন্য অ্যাডজাস্ট করা হয়েছে
      const move = direction === 'left' ? -clientWidth / 1.2 : clientWidth / 1.2;
      sliderRef.current.scrollTo({ left: scrollLeft + move, behavior: 'smooth' });
    }
  };

  const handleRedirect = (id: string) => {
    router.push(`/event/${id}`);
  }

  // Loading Skeleton
  if (isLoading) return <div className="h-[400px] flex items-center justify-center animate-pulse text-muted-foreground uppercase font-black tracking-widest">Loading Events...</div>;

  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="container-max">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.3em]">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              ~~ Explore CoxWave
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              Most Popular <span className="italic text-primary">Experiences.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all bg-background shadow-lg active:scale-90 group">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all bg-background shadow-lg active:scale-90 group">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* SNAP-SLIDER (Updated for 4-Card visibility) */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event: IEvent) => (
            <div
              key={event.id}
              onClick={() => handleRedirect(event.id)}
              className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] xl:min-w-[23.5%] snap-start group cursor-pointer "
            >
              <div className="h-full flex flex-col bg-card rounded-[2.5rem] border border-border transition-all duration-500  hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">

                {/* 1. VISUAL LAYER */}
                <div className="relative aspect-[16/11] overflow-hidden m-3 rounded-[2rem]">
                  <Image
                    src={event.images[0]}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-background/90 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <Star size={12} className="text-orange-500 fill-orange-500" />
                      <span className="text-[10px] font-black text-foreground">{event.average_rating || "4.9"}</span>
                    </div>
                  </div>
                </div>

                {/* 2. DENSE CONTENT AREA */}
                <div className="px-6 pb-7 flex flex-col flex-grow space-y-4">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-1 text-primary">
                      <MapPin size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest truncate">{event.location}</span>
                    </div>

                    <h3 className="text-xl font-black text-foreground tracking-tight leading-[1.1] min-h-[44px] line-clamp-2 transition-colors group-hover:text-primary">
                      {event.title}
                    </h3>

                    {/* Short Description Added */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                      {event.description || "Join us for an unforgettable evening at Cox's Bazar with delicious food and vibes."}
                    </p>
                  </div>

                  {/* 3. META INFO BAR (Price & Seats) */}
                  <div className="flex items-center justify-between py-4 border-y border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Starts from</span>
                      <span className="text-xl font-black text-foreground tracking-tighter">৳{event.per_person_price}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary font-bold text-[10px] uppercase">
                        <Ticket size={12} />
                        <span>{event.remaining_seats} Left</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. CTA FOOTER */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      <Calendar size={12} className="text-primary/60" /> Daily Ops
                    </div>
                    <Button className="h-10 px-5 rounded-full bg-primary text-white hover:opacity-90 font-black text-[10px] uppercase tracking-widest transition-all">
                      View Details
                      <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}