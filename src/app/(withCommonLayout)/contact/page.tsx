'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <main className="relative  flex items-center justify-center py-12 overflow-hidden bg-background">
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000')` }}
      >
        <div className="absolute inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-[4px]" />
      </div>

      <div className="container-max px-6 relative z-10 max-w-6xl">

        {/* COMPACT TOP HEADER */}
        <div className="text-center text-white mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-neutral-300 font-medium leading-relaxed">
            Have questions or want to partner with us? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* EQUAL HEIGHT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">

          {/* LEFT: FROSTED GLASS SECTION */}
          <div className="bg-white/5 dark:bg-white/10 backdrop-blur-2xl border border-white/10 p-8 md:p-12 flex flex-col justify-between space-y-8 rounded-[2rem]">

            <div className="space-y-8">
              {/* Address Block 1 */}
              <div className="flex gap-4 group">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-lg shadow-secondary/20">
                  <MapPin size={18} className="text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.2em]">Dhaka Office</h3>
                  <p className="text-neutral-100 text-sm leading-relaxed max-w-[280px]">74-09 37th Avenue, Suite #20382, Jackson Heights, NY 11372, USA</p>
                </div>
              </div>

              {/* Address Block 2 */}
              <div className="flex gap-4 group">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-lg shadow-secondary/20">
                  <MapPin size={18} className="text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.2em]">Cox's Bazar Office</h3>
                  <p className="text-neutral-100 text-sm leading-relaxed max-w-[280px]">149/A, Farmgate, Tejgaon, Dhaka-1215, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Block */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <div className="flex items-center gap-4 text-neutral-100">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                  <Phone size={14} className="text-primary" />
                </div>
                <p className="text-sm font-bold">+880 1926287071</p>
              </div>
              <div className="flex items-center gap-4 text-neutral-100">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                  <Mail size={14} className="text-primary" />
                </div>
                <p className="text-sm font-bold">info@coxwave.com</p>
              </div>
            </div>

          </div>

          {/* RIGHT: COMPACT FORM SECTION */}
          <div className="bg-card p-8 md:p-12 flex flex-col justify-center rounded-[2rem] shadow-2xl shadow-black/5 border border-border">
            <h2 className="text-2xl font-black text-foreground mb-6">
              Get in <span className="text-primary">Touch</span>
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="w-full bg-muted border border-border rounded-xl h-11 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-muted border border-border rounded-xl h-11 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+880..."
                  className="w-full bg-muted border border-border rounded-xl h-11 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Message *</label>
                <textarea
                  placeholder="How can we help?"
                  rows={3}
                  className="w-full bg-muted border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-white px-10 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all w-full md:w-auto shadow-xl shadow-primary/20">
                Send Message
                <Send size={14} className="ml-2" />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}