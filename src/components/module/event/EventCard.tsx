"use client";

import Image from "next/image";
import { MapPin, Ticket, ChevronRight, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IEvent } from "@/types/event.types";
import Link from "next/link";

interface EventCardProps {
  event: IEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/event/${event?.id}`} className="block h-full">
      <div className="group h-full flex flex-col bg-card rounded-[2rem] border border-border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">

        {/* 1. VISUAL LAYER */}
        <div className="relative aspect-[16/11] overflow-hidden m-3 rounded-[1.5rem]">
          <Image
            src={event.images[0]}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <div className="bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm text-foreground">
              <Star size={10} className="text-orange-500 fill-orange-500" />
              <span className="text-[10px] font-black">{event?.average_rating || "4.9"}</span>
            </div>
          </div>
        </div>

        {/* 2. CONTENT AREA */}
        <div className="px-5 pb-6 flex flex-col flex-grow space-y-4">
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-1 text-primary">
              <MapPin size={12} />
              <span className="text-[9px] font-bold uppercase tracking-widest truncate">
                {event.location}
              </span>
            </div>

            <h3 className="text-lg font-black text-foreground tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            {/* Short Description (Requirement) */}
            <p className="text-xs text-muted-foreground line-clamp-2 font-medium leading-relaxed">
              {event.description || "Experience the best beach events with curated BBQ and live music in Cox's Bazar."}
            </p>
          </div>

          {/* 3. META INFO BAR */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Ticket size={12} className="text-primary" />
              <span>{event.remaining_seats} Left</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Calendar size={12} className="text-primary" />
              <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>

          {/* 4. PRICING & CTA */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="block text-[8px] font-black text-muted-foreground uppercase tracking-widest">Price</span>
              <span className="text-xl font-black text-foreground">৳{event.per_person_price}</span>
            </div>
            <Button className="h-10 px-4 rounded-full bg-primary text-white hover:opacity-90 transition-all font-bold text-[10px] uppercase tracking-tighter">
              View Details
              <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}