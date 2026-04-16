'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Zap,
  Ticket 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const move = direction === 'left' ? -clientWidth : clientWidth;
      sliderRef.current.scrollTo({ left: scrollLeft + move, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-neutral-50 overflow-hidden">
      <div className="container-max px-6">
        
        {/* COMPACT HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.3em]">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              ~~Explore CoxWave
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
              Most Popular  <span className="text-primary italic">Events.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className="h-12 w-12 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all bg-white shadow-xl active:scale-95 group">
              <ChevronLeft size={20} className="group-active:scale-75 transition-transform" />
            </button>
            <button onClick={() => scroll('right')} className="h-12 w-12 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all bg-white shadow-xl active:scale-95 group">
              <ChevronRight size={20} className="group-active:scale-75 transition-transform" />
            </button>
          </div>
        </div>

        {/* COMPACT SNAP-SLIDER */}
        <div 
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_EVENTS.map((event, i) => (
            <div key={event.id} className="min-w-[90%] md:min-w-[48%] lg:min-w-[32%] snap-start group">
              <div className="bg-white rounded-[2rem] border border-neutral-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
                
                {/* 1. VISUAL LAYER (Compact Ratio) */}
                <div className="relative aspect-[16/10] overflow-hidden m-3 rounded-[1.5rem]">
                  <Image 
                    src={event.images[0]} 
                    alt={event.title} 
                    fill 
                    className="object-cover transition-transform duration-700 " 
                  />
                  
                  {/* FLOAT BADGES */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <Star size={12} className="text-secondary fill-secondary" />
                      {/* <span className="text-[10px] font-black">{event.rating || "4.9"}</span> */}
                    </div>
                  </div>
                </div>

                {/* 2. DENSE INFORMATION AREA */}
                <div className="px-6 pb-6 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-primary">
                      <MapPin size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{event.location}</span>
                    </div>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      Hosted by <span className="text-neutral-900">{event.owner.business_name}</span>
                    </p>
                  </div>

                  {/* 3. SHORTHAND INFO BAR */}
                  <div className="flex items-center gap-4 text-xs font-medium text-neutral-400 border-y border-neutral-50 py-3">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Ticket size={14} /> {event.remaining_seats} Seats Left
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <Zap size={12} className="text-secondary" /> Daily Events
                    </div>
                  </div>

                  {/* 4. PRICING & CTA (Optimized Layout) */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-0.5">Start</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-neutral-900">৳{event.per_person_price}</span>
                      </div>
                    </div>
                    <Button className="h-11 px-6 rounded-full bg-secondary text-white hover:bg-primary transition-all font-black text-[10px] uppercase tracking-widest group">
                      Details <ChevronRight size={14} className="ml-1 opacity-60 group-hover:translate-x-0.5 transition-transform" />
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

const MOCK_EVENTS = [
  {
    id: "019d7af4-086d-7580-9f3f-f6f1dc714b42",
    title: "Cox's Bazar Beach Bike Tour",
    location: "Cox's Bazar Marine Drive",
    images: ["https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000"],
    remaining_seats: 20,
    per_person_price: 500,
    owner: { business_name: "Cox Bike Rentals" }
  },
  {
    id: "019d7af5-9068-708c-97b5-fb71c63f4af7",
    title: "Midnight Shore BBQ Party",
    location: "Inani Private Beach",
    images: ["https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000"],
    remaining_seats: 12,
    per_person_price: 1200,
    owner: { business_name: "Coastal Eats" }
  },
  {
    id: "019d7af6-custom-id-3",
    title: "Luxury Sunset Yacht Cruise",
    location: "Marine Drive Pier",
    images: ["https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000"],
    remaining_seats: 8,
    per_person_price: 4500,
    owner: { business_name: "Elite Voyages" }
  },
  {
    id: "019d7af6wdewre-custom-id-3",
    title: "Luxury Sunset Yacht Cruise",
    location: "Marine Drive Pier",
    images: ["https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000"],
    remaining_seats: 8,
    per_person_price: 4500,
    owner: { business_name: "Elite Voyages" }
  }
];
