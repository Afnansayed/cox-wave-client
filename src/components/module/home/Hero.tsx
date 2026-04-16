'use client';

import Image from 'next/image';
import { Play, Calendar, Users, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative py-10 w-full flex items-center justify-center overflow-hidden bg-neutral-50">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 self-center lg:self-start bg-white border border-neutral-200 px-4 py-2 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-neutral-500">
              Season 2026 Now Open
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-neutral-900 leading-[1.1] tracking-tighter">
            Chase the <span className="text-primary italic">Perfect</span> <br className="hidden md:block" /> 
            Wave in Cox's Bazar.
          </h1>

          <p className="text-base md:text-lg text-neutral-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            From luxury private cruises to high-octane surf festivals. Discover 
            the hidden gems of the world's longest natural sea beach with premium curated experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white h-12 px-10 rounded-full font-black text-sm uppercase tracking-wider shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1">
              Explore Events
            </Button>
            <button className="flex items-center gap-3 group px-6 py-3 transition-all">
              <div className="h-12 w-12 rounded-full border border-neutral-200 flex items-center justify-center bg-white group-hover:bg-primary group-hover:border-primary transition-all shadow-sm">
                <Play className="w-4 h-4 fill-primary text-primary group-hover:fill-white group-hover:text-white ml-1" />
              </div>
              <span className="text-sm font-bold text-neutral-700 uppercase tracking-tight">Watch Story</span>
            </button>
          </div>

          {/* TRUST STATS (Mobile-friendly font weights) */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-neutral-200/60">
            <div>
              <p className="text-xl md:text-2xl font-black text-neutral-900">12k+</p>
              <p className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-tighter">Happy Tourists</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-neutral-900">4.9</p>
              <p className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-tighter">Avg Rating</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-neutral-900">150+</p>
              <p className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-tighter">Daily Events</p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL - Cinematic Image Composition */}
        <div className="relative order-1 lg:order-2 px-4 md:px-0">
          <div className="relative z-10 aspect-[4/5] md:aspect-square w-full max-w-[550px] mx-auto overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-primary/10">
            <Image 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
              alt="Cox's Bazar Beach Luxury"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* FLOATING GLASS CARD (Hidden on smallest mobile) */}
          <div className="hidden sm:flex absolute -bottom-6 -left-6 md:-left-12 bg-white/80 backdrop-blur-xl border border-white/40 p-5 rounded-[2rem] shadow-2xl z-20 items-center gap-4 animate-bounce-slow">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
              <Star className="text-white fill-white w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-900">Featured Experience</p>
              <p className="text-xs font-bold text-neutral-500">Inani Sunset Dinner</p>
            </div>
          </div>

          {/* DECORATIVE ELEMENTS */}
          <div className="absolute top-10 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl -z-1" />
          <div className="absolute -bottom-10 right-10 h-32 w-32 bg-secondary/10 rounded-full blur-3xl -z-1" />
        </div>

      </div>
    </section>
  );
}