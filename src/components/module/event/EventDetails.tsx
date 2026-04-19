'use client';

import * as React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Autoplay from "embla-carousel-autoplay";
import { 
  MapPin, Users, Ticket, 
  ChevronLeft, Share2, Heart, Star, ChevronRight,
  ShieldCheck, CheckCircle2, Phone, Mail, Building2, BadgeCheck
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getEventsById } from '@/app/(withCommonLayout)/event/_actions';
import Link from 'next/link';

export default function EventDetails({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventsById(id),
  });

  const event = data?.data;
  const [mainApi, setMainApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [guestCount, setGuestCount] = React.useState([1]);
  
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const reviews = event?.reviews ?? [];
  const totalPrice = (event?.per_person_price || 0) * guestCount[0];

  React.useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", () => setSelectedIndex(mainApi.selectedScrollSnap()));
  }, [mainApi]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xs font-bold tracking-widest animate-pulse">LOADING...</div>;
  if (!event) return <p className="container-max py-6 text-sm">Event not found.</p>;

  return (
    <main className="min-h-screen bg-white pb-12 selection:bg-primary/20">
      {/* 1. COMPACT NAV */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-5xl mx-auto h-14 px-4 flex justify-between items-center">
     <Link href="/event">
          <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-wider text-neutral-500 gap-1.5">
            <ChevronLeft size={14} /> Back
          </Button>
          </Link>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-neutral-100"><Share2 size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-neutral-100 hover:text-red-500"><Heart size={14} /></Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-10">
        
        {/* 2. GALLERY */}
        <section className="relative group">
          <Carousel setApi={setMainApi} plugins={[plugin.current]} className="w-full">
            <CarouselContent>
              {event.images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[21/10] overflow-hidden rounded-3xl shadow-md border border-neutral-100">
                    <Image src={src} alt={event.title} fill className="object-cover" priority={index === 0} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/10 backdrop-blur-sm rounded-full">
            {event.images.map((_, i) => (
              <button key={i} onClick={() => mainApi?.scrollTo(i)}
                className={cn("h-1 transition-all rounded-full", selectedIndex === i ? "w-4 bg-white" : "w-1 bg-white/50")} />
            ))}
          </div>
        </section>

        {/* 3. HEADER & QUICK INFO */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none text-[9px] uppercase font-bold tracking-tight px-2.5">
              {event.status}
            </Badge>
            <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600">
              <Star size={12} className="fill-secondary text-secondary" /> {event.owner.rating || "New"}
              <span className="text-neutral-400 font-medium">({reviews.length} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: MapPin, text: event.location, color: "text-blue-500" },
              { icon: Users, text: `${event.capacity} Capacity`, color: "text-primary" },
              { icon: Ticket, text: `${event.remaining_seats} Left`, color: "text-secondary" },
            ].map((pill, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100 text-[11px] font-bold text-neutral-600">
                <pill.icon size={13} className={pill.color} />
                {pill.text}
              </div>
            ))}
          </div>
        </section>

        {/* 4. DESCRIPTION */}
        <section className="space-y-3">
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest border-l-4 border-primary pl-3">Description</h3>
          <p className="text-sm text-neutral-600 leading-relaxed font-medium max-w-3xl">
            {event.description}
          </p>
        </section>

        {/* 5. OWNER SECTION (COMPACT) */}
        <section className="p-6 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row gap-6 items-center shadow-lg">
          <div className="h-16 w-16 rounded-2xl relative border border-white/10 overflow-hidden flex-shrink-0">
            <Image src={event.owner.profile_picture || '/default-avatar.png'} alt="Owner" fill className="object-cover" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h4 className="text-lg font-bold tracking-tight">{event.owner.business_name || event.owner.name}</h4>
              <BadgeCheck className="text-primary" size={16} />
            </div>
            <p className="text-xs text-neutral-400 leading-snug line-clamp-2 italic">"{event.owner.description}"</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1 text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
              <span className="flex items-center gap-1"><Mail size={12}/> {event.owner.email}</span>
              <span className="flex items-center gap-1"><Building2 size={12}/> {event.owner.business_address || "Private"}</span>
            </div>
          </div>
        </section>

        {/* 6. REVIEWS (TIGHTER GRID) */}
        <section className="space-y-6 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-neutral-900 tracking-tight">Reviews</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((review) => (
              <div key={review.id} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100/50 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xs text-neutral-800">{review.customer?.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} className={cn(i < review.rating ? "fill-secondary text-secondary" : "text-neutral-200")} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed italic line-clamp-2">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. BOOKING AREA (COMPACT) */}
        <section className="pt-6">
          <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-6 md:p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">Reserve Tickets</h2>
                <p className="text-[11px] text-neutral-400 font-medium">Select group size for final pricing.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black text-primary leading-none">{guestCount[0]} <span className="text-xs text-neutral-400 not-italic tracking-normal">Guests</span></span>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase">৳{event.per_person_price} / each</span>
                </div>
                <Slider defaultValue={[1]} max={event.remaining_seats} min={1} step={1} onValueChange={setGuestCount} />
              </div>
            </div>

            <div className="bg-neutral-50 rounded-3xl p-6 space-y-4 border border-neutral-100">
              <div className="text-center">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total to Pay</p>
                <p className="text-4xl font-black text-neutral-900 tracking-tight">৳{totalPrice.toLocaleString()}</p>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-secondary hover:bg-primary text-white font-black text-xs uppercase tracking-[0.1em] transition-all group">
                Confirm Booking
                <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}