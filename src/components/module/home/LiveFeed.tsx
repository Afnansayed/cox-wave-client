'use client';

import { Waves, Zap, Users, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';

const TRENDING = [
  {
    title: "Midnight BBQ Party",
    location: "Inani Beach",
    users: 12,
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400",
    time: "2h ago"
  },
  {
    title: "Surfing Workshop",
    location: "Laboni Point",
    users: 8,
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=400",
    time: "Active Now"
  }
];

export default function LiveFeed() {
  return (
    <section className="py-12 bg-background border-y border-border/50">
      <div className="container-max px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: TEXT & SOCIAL PROOF */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.3em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                Live on CoxWave
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                See What’s <span className="text-primary italic">Happening</span> <br /> Right Now.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-sm">
                Real people, real experiences. Join hundreds of travelers currently exploring the shores of Cox's Bazar.
              </p>
            </div>

            {/* QUICK STATS */}
            <div className="flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" width={40} height={40} />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                  +2k
                </div>
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Trusted by <br /> <span className="text-foreground">Global Travelers</span>
              </div>
            </div>
          </div>

          {/* RIGHT: FLOATING FEED CARDS */}
          <div className="lg:col-span-7 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TRENDING.map((item, i) => (
                <div key={i} className="group bg-card rounded-[2rem] p-4 border border-border transition-all hover:shadow-xl hover:shadow-primary/5">
                  <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4">
                    <Image src={item.img} alt={item.title} fill className="object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-foreground">
                      <Zap size={12} className="text-secondary fill-secondary" />
                      <span className="text-[10px] font-black uppercase tracking-wider">{item.time}</span>
                    </div>
                  </div>
                  
                  <div className="px-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-foreground tracking-tight">{item.title}</h3>
                      <button className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-primary" />
                        {item.users} Joined
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FLOATING DECOR */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}