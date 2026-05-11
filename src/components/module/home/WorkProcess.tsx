'use client';

import { useState } from 'react';
import {
  Search, Ticket, ShieldCheck, CheckCircle2, Smile, Star,
  PlusCircle, SearchCheck, LayoutDashboard, Waves, TrendingUp,
  ArrowRight, Users, Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkProcess() {
  const [activeView, setActiveView] = useState<'customer' | 'owner'>('customer');

  const customerSteps = [
    { title: "Discovery", sub: "Explore Events", desc: "Filter by BBQ, Surf, or Campfire to find your vibe.", icon: <Search /> },
    { title: "Reservation", sub: "Choose & Book", desc: "Select seats and view real-time availability.", icon: <Ticket /> },
    { title: "Security", sub: "Secure Payment", desc: "Encrypted transactions via trusted local gateways.", icon: <ShieldCheck /> },
    { title: "Access", sub: "Get Confirmation", desc: "Instant digital tickets with GPS event locations.", icon: <CheckCircle2 /> },
    { title: "Execution", sub: "Enjoy the Experience", desc: "Skip the lines and dive into the beach party.", icon: <Smile /> },
    { title: "Community", sub: "Share Feedback", desc: "Rate your host and help maintain our standards.", icon: <Star /> },
  ];

  const ownerSteps = [
    { title: "Setup", sub: "Create Event", desc: "List title, date, capacity, and luxury pricing.", icon: <PlusCircle /> },
    { title: "Quality Check", sub: "Get Approval", desc: "Admin verification within 24 hours for trust.", icon: <SearchCheck /> },
    { title: "Management", sub: "Manage Bookings", desc: "Track ROI and participant lists in one panel.", icon: <LayoutDashboard /> },
    { title: "Hospitality", sub: "Host Event", desc: "Focus on guests while we handle notifications.", icon: <Waves /> },
    { title: "Growth", sub: "Earn & Grow", desc: "Receive weekly payouts and build a reputation.", icon: <TrendingUp /> },
  ];

  const currentSteps = activeView === 'customer' ? customerSteps : ownerSteps;

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 -z-10" />

      <div className="container-max px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT COLUMN: NAVIGATION & TITLE */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                How it <br /> <span className="text-primary italic">Works.</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xs">
                A high-performance ecosystem built for seamless coastal adventures.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setActiveView('customer')}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border transition-all group",
                  activeView === 'customer' ? "bg-card border-primary shadow-xl shadow-primary/5" : "bg-transparent border-border grayscale opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2.5 rounded-xl", activeView === 'customer' ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                    <Users size={20} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-foreground">For Customers</span>
                </div>
                <ArrowRight size={16} className={cn("transition-transform text-foreground", activeView === 'customer' ? "translate-x-0" : "-translate-x-2")} />
              </button>

              <button
                onClick={() => setActiveView('owner')}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border transition-all group",
                  activeView === 'owner' ? "bg-card border-primary shadow-xl shadow-primary/5" : "bg-transparent border-border grayscale opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2.5 rounded-xl", activeView === 'owner' ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                    <Briefcase size={20} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-foreground">For Event Owners</span>
                </div>
                <ArrowRight size={16} className={cn("transition-transform text-foreground", activeView === 'owner' ? "translate-x-0" : "-translate-x-2")} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: THE STEPS TIMELINE */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-16">
              {currentSteps.map((step, index) => (
                <div key={step.sub} className="relative group">
                  {/* Step Background Index */}
                  <span className="absolute -top-6 left-0 text-5xl font-black text-muted/30 group-hover:text-primary/10 transition-colors select-none pointer-events-none">
                    0{index + 1}
                  </span>

                  <div className="relative pt-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-border text-primary shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10">
                        {step.icon}
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        {step.title}
                      </h4>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight">
                        {step.sub}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed max-w-[240px]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}