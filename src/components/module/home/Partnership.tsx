'use client';

import { 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BENEFITS = [
  {
    title: "Zero Commission",
    desc: "Keep 100% of your earnings. We are currently offering free listings to grow the ecosystem.",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
  },
  {
    title: "Instant Visibility",
    desc: "Put your hotel or event in front of thousands of active tourists looking for experiences.",
    icon: <Globe className="w-5 h-5 text-primary" />
  },
  {
    title: "Smart Analytics",
    desc: "Track your booking trends and guest preferences with our intuitive owner dashboard.",
    icon: <BarChart3 className="w-5 h-5 text-secondary" />
  },
  {
    title: "Fast Setup",
    desc: "Go live in under 5 minutes. Our simple UI makes event management effortless.",
    icon: <Zap className="w-5 h-5 text-orange-500" />
  }
];

export default function Partnership() {
  return (
    <section className="py-12 bg-neutral-900 overflow-hidden relative">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-0 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container-max px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: THE PITCH */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                <Plus className="w-3 h-3 text-primary" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/80">Become a Partner</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1]">
                Maximize Your <br />
                <span className="text-primary italic">Property's</span> Potential.
              </h2>
              <p className="text-base md:text-lg text-neutral-400 font-medium leading-relaxed max-w-lg">
                Whether you run a luxury hotel or organize local beach parties, Cox-Wave provides the tools to reach more guests and streamline your bookings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white h-14 px-10 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95">
                 Contact With Us
              </Button>
              <button className="flex items-center gap-3 px-6 py-3 text-w  text-sm group text-primary transition-colors">
                <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-primary transition-all">
                  <MessageCircle className="w-4 h-4" />
                </div>
                Contact Support
              </button>
            </div>

            {/* LIVE PARTNER STATS */}
            <div className="pt-8 border-t border-white/10 flex items-center gap-8">
              <div>
                <p className="text-2xl font-black text-white">50+</p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Hotels</p>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Free for Now</p>
              </div>
            </div>
          </div>

          {/* RIGHT: THE BENEFITS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((benefit, i) => (
              <div 
                key={benefit.title}
                className="p-6 md:p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 group"
              >
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-3 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}