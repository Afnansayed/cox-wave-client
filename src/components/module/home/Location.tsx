'use client';

import Image from 'next/image';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const LOCATIONS = [
  {
    name: "Cox’s Bazar Beach",
    count: "12 Events",
    image: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=800",
    className: "md:col-span-6 md:row-span-2",
  },
  {
    name: "Marine Drive",
    count: "8 Events",
    image: "/module/home/marine-drive.webp",
    className: "md:col-span-3 md:row-span-1",
  },
  {
    name: "Inani Beach",
    count: "5 Events",
    image: "/module/home/inani.webp",
    className: "md:col-span-3 md:row-span-1",
  },
  {
    name: "Saint Martin",
    count: "15 Events",
    image: "https://images.unsplash.com/photo-1540206395-68808572332f?q=80&w=800",
    className: "md:col-span-6 md:row-span-1",
  },
];

export default function Locations() {
  return (
    <section className="py-12  bg-white">
      <div className="container-max px-6">
        
        {/* COMPACT HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Popular Destinations</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-neutral-900 tracking-tight">
              Where to <span className="text-primary">Go Next</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-neutral-500 md:max-w-xs font-medium">
            Explore 150+ curated beach experiences across 6 premium coastal locations.
          </p>
        </div>

        {/* HIGH DENSITY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[500px]">
          {LOCATIONS.map((loc, i) => (
            <div 
              key={loc.name}
              className={cn(
                "group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-neutral-100",
                loc.className
              )}
            >
              <Image 
                src={loc.image}
                alt={loc.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Intelligent Gradient: Only darkens the bottom text area */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content Layer */}
              <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 md:space-y-1">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <MapPin size={12} className="text-primary-light" />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{loc.count}</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-white leading-tight">
                      {loc.name}
                    </h3>
                  </div>
                  
                  <button className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-primary hover:border-primary group-hover:translate-x-1">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}