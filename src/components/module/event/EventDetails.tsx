'use client';

import * as React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Autoplay from "embla-carousel-autoplay";
import { 
  MapPin, Users, Ticket, 
  ChevronLeft, Share2, Heart, Star, ChevronRight,
  ShieldCheck, CheckCircle2, Phone, Mail, Building2, BadgeCheck,
  Calendar,
  Info,
  ArrowRight
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
import CreateReview from '../review/CreateReview';

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

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">Loading Experience</span>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-slate-500 font-medium">Event not found.</p>
        <Link href="/event">
          <Button variant="outline" className="rounded-xl">Return to Gallery</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      {/* 1. PREMIUM STICKY NAV */}
      <nav className="sticky top-0 z-[60] w-full bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex justify-between items-center">
          <Link href="/event">
            <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary gap-2 bg-muted/50 rounded-full pr-4">
              <ChevronLeft size={16} /> Back to Events
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border hover:bg-card hover:shadow-sm text-foreground"><Share2 size={15} /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border hover:bg-card hover:text-rose-500 hover:shadow-sm text-foreground"><Heart size={15} /></Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: CONTENT */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 2. GALLERY COMPONENT */}
            <section className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
              <Carousel setApi={setMainApi} plugins={[plugin.current]} className="w-full">
                <CarouselContent>
                  {event?.images.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                        <Image src={src} alt={event?.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority={index === 0} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Custom Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                {event?.images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => mainApi?.scrollTo(i)}
                    className={cn(
                      "h-1.5 transition-all duration-300 rounded-full", 
                      selectedIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                    )} 
                  />
                ))}
              </div>
            </section>

            {/* 3. HEADER & QUICK INFO */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-primary text-white border-none text-[10px] uppercase font-bold tracking-[0.15em] px-3 py-1 rounded-lg">
                  {event?.status}
                </Badge>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 text-xs font-bold">
                  <Star size={14} className="fill-amber-400 text-amber-400" /> 
                  {event?.owner.rating || "5.0"}
                  <span className="text-amber-500/40 font-medium ml-1">({reviews.length} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-[1.1]">
                {event?.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: MapPin, text: event?.location, color: "bg-blue-500/10 text-blue-500", label: "Location" },
                  { icon: Users, text: `${event?.capacity} Capacity`, color: "bg-emerald-500/10 text-emerald-500", label: "Group Size" },
                  { icon: Ticket, text: `${event?.remaining_seats} Left`, color: "bg-rose-500/10 text-rose-500", label: "Availability" },
                ].map((pill, i) => (
                  <div key={i} className="flex flex-col p-4 bg-card rounded-2xl border border-border shadow-sm transition-hover hover:shadow-md">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", pill.color)}>
                      <pill.icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{pill.label}</span>
                    <span className="text-sm font-bold text-foreground truncate">{pill.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. DESCRIPTION */}
            <section className="bg-card p-8 rounded-[2rem] border border-border shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Info size={14} className="text-primary" /> About the Event
              </h3>
              <p className="text-md text-muted-foreground leading-relaxed font-medium">
                {event?.description}
              </p>
            </section>

            {/* 5. OWNER CARD (ADMIN STYLE) */}
            <section className="overflow-hidden rounded-[2rem] bg-neutral-900 shadow-xl shadow-black/20">
              <div className="p-1 px-8 pt-8 flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Verified Organizer</span>
              </div>
              <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="h-24 w-24 rounded-[2rem] relative border-4 border-white/5 overflow-hidden flex-shrink-0 shadow-2xl">
                  <Image src={event?.owner.profile_picture || '/default-avatar.png'} alt="Owner" fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h4 className="text-2xl font-bold text-white tracking-tight">{event?.owner.business_name || event?.owner.name}</h4>
                      <BadgeCheck className="text-primary" size={24} />
                    </div>
                    <p className="text-sm text-neutral-400 italic">"{event?.owner.description}"</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[11px] text-neutral-500 font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-2"><Mail size={14} className="text-primary"/> {event?.owner.email}</span>
                    <span className="flex items-center gap-2"><Building2 size={14} className="text-primary"/> {event?.owner.business_address || "Private Listing"}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. REVIEWS */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-foreground tracking-tight">Guest Experiences</h3>
                <Badge variant="outline" className="rounded-full px-4 text-foreground border-border">{reviews.length} total</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.length > 0 ? (
                  reviews.slice(0, 4).map((review) => (
                    <div key={review.id} className="bg-card p-6 rounded-[1.5rem] border border-border shadow-sm space-y-4 hover:border-primary/20 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                            {review.customer?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{review.customer?.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Verified Guest</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={10} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center bg-muted rounded-3xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground font-medium italic">Be the first to share an experience.</p>
                  </div>
                )}
              </div>
              <CreateReview eventId={event?.id} title={event?.title} /> 
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD */}
          <div className="lg:col-span-4">
            <aside className="sticky top-24 space-y-6">
              <div className="bg-card border-2 border-border rounded-[2.5rem] p-8 shadow-2xl shadow-black/5 relative overflow-hidden">
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                
                <div className="relative space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Reserve Spot</h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Instant Confirmation</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-4xl font-black text-foreground leading-none">৳{event?.per_person_price}</span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1">per person</span>
                      </div>
                      <Badge className="h-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-lg">Available</Badge>
                    </div>

                    <div className="space-y-4 bg-muted p-6 rounded-2xl border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-foreground uppercase">Attendees</span>
                        <span className="text-sm font-black text-primary bg-card px-3 py-1 rounded-lg border border-border shadow-sm">
                          {guestCount[0]} Guests
                        </span>
                      </div>
                      <Slider 
                        defaultValue={[1]} 
                        max={event?.remaining_seats} 
                        min={1} 
                        step={1} 
                        onValueChange={setGuestCount} 
                        className="py-4"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                        <span>Min: 1</span>
                        <span>Max: {event?.remaining_seats}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Subtotal</span>
                      <span className="text-lg font-bold text-foreground">৳{totalPrice.toLocaleString()}</span>
                    </div>
                    
                    <Link href={`/booking?event_id=${event?.id}&no_of_guests=${guestCount[0]}`}>
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest transition-all group shadow-xl shadow-primary/20">
                      Booking Now
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    </Link>
                    
                    <p className="text-[10px] text-center text-muted-foreground font-medium">
                      You won't be charged until the final step.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Trust Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-emerald-500 shrink-0 shadow-sm border border-border">
                  <ShieldCheck size={20} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-tight">Secure Transaction</p>
                  <p className="text-[10px] text-emerald-500/70 leading-snug">Encrypted payments and verified ticket fulfillment.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}