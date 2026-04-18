'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for the search input
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All Locations');

  // Function to handle the URL update
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    } else {
      params.delete('searchTerm');
    }

    if (location !== 'All Locations') {
      params.set('location', location);
    } else {
      params.delete('location');
    }

    router.push(`/event?${params.toString()}`);
  };

  return (
    <section className="">
      <div className="relative w-full  overflow-hidden shadow-2xl bg-neutral-900 flex items-center justify-center">
        
        {/* BACKGROUND IMAGE */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2000')` }}
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
                The ultimate destination to discover and book exclusive coastal <br className="hidden md:block"/> parties, tours, and yacht experiences.
              </p>
            </div>
          </div>

          {/* --- CENTERED INTEGRATED SEARCH FILTERS --- */}
          <div className="w-full max-w-4xl bg-white p-2  rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/20">
            
            {/* Search Input */}
            <div className="flex-[1.5] flex items-center gap-3 px-6 w-full border-b md:border-b-0 md:border-r border-neutral-100 py-3 md:py-0">
              <Search size={20} className="text-primary" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="What are you looking for?" 
                className="bg-transparent border-none outline-none text-sm font-bold text-neutral-800 w-full placeholder:text-neutral-400"
              />
            </div>

            {/* Location Filter */}
            <div className="flex-1 flex items-center gap-3 px-6 w-full border-b md:border-b-0 md:border-r border-neutral-100 py-3 md:py-0">
              <MapPin size={20} className="text-secondary" />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-neutral-800 w-full appearance-none cursor-pointer"
              >
                <option>All Locations</option>
                <option>Inani Beach</option>
                <option>Laboni Point</option>
                <option>Marine Drive</option>
                <option>Kolatoli</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto p-1">
                <Button 
                    onClick={handleSearch}
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-10 h-10 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/25"
                >
                    Find Events
                </Button>
            </div>
          </div>

        </div>

        {/* AMBIENT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}