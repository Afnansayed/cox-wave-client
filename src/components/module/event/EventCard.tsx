"use client";

import Image from "next/image";
import { MapPin, Ticket, ChevronRight, Info, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IEvent } from "@/types/event.types";
import Link from "next/link";

interface EventCardProps {
  event: IEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
   <Link href={`/event/${event?.id}`}>
    <div
      key={event.id}
      className="min-w-[90%] md:min-w-[48%] lg:min-w-[32%] snap-start group"
    >
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
              <span className="text-[10px] font-black">{event?.average_rating|| "4.9"}</span>
            </div>
          </div>
        </div>

        {/* 2. DENSE INFORMATION AREA */}
        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-primary">
              <MapPin size={12} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {event.location}
              </span>
            </div>
            <h3 className="text-xl min-h-12 font-black text-neutral-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Hosted by{" "}
              <span className="text-neutral-900">
                {event.owner.business_name}
              </span>
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
              <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-0.5">
                Start
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-neutral-900">
                  ৳{event.per_person_price}
                </span>
              </div>
            </div>
          <Link href={`/booking?event_id=${event.id}`}>
            <Button className="h-11 px-6 rounded-full bg-secondary text-white hover:bg-primary transition-all font-black text-[10px] uppercase tracking-widest group">
              Book Now{" "}
              <ChevronRight
                size={14}
                className="ml-1 opacity-60 group-hover:translate-x-0.5 transition-transform"
              />
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </div>
</Link>
  );
}
