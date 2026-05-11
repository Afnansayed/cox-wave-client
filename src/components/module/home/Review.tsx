'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// MOCK DATA BASED ON YOUR SCHEMA
const MOCK_REVIEWS = [
  {
    id: "review-1",
    rating: 5,
    comment: "The Midnight BBQ was easily the highlight of our trip. The setup was incredibly premium and the food was fresh!",
    customer: {
      name: "Samiul Islam",
      profile_picture: null, // Testing placeholder
    },
    event: { title: "Midnight Beach BBQ" }
  },
  {
    id: "review-2",
    rating: 5,
    comment: "Amazing experience! The bike tour along Marine Drive is a must-do. Very well organized and safe.",
    customer: {
      name: "Tahmina Akter",
      profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    },
    event: { title: "Beach Bike Tour" }
  },
  {
    id: "review-3",
    rating: 4,
    comment: "The Sunset Cruise was magical. Seeing the horizon from the yacht was a memory I'll never forget.",
    customer: {
      name: "Afnan Sayed",
      profile_picture: null,
    },
    event: { title: "Sunset Yacht Cruise" }
  },
  {
    id: "review-4",
    rating: 5,
    comment: "Highly recommended for families. The hosts were very professional and attentive to our needs.",
    customer: {
      name: "Rakib Hasan",
      profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    },
    event: { title: "Parasailing Adventure" }
  }
];

export default function ReviewSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const move = direction === 'left' ? -clientWidth : clientWidth;
      sliderRef.current.scrollTo({ left: scrollLeft + move, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="container-max px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Guest Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Trusted by <span className="text-primary italic">Explorers.</span>
            </h2>
            <p className="text-muted-foreground">
              Don't just take our word for it. Here's what our guests have to say about their experience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all bg-background shadow-sm active:scale-90 group">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all bg-background shadow-sm active:scale-90 group">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* REVIEW SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_REVIEWS.map((item) => (
            <div key={item.id} className="min-w-[90%] md:min-w-[45%] lg:min-w-[32%] snap-start">
              <div className="h-full bg-muted/30 p-8 rounded-[2rem] border border-border flex flex-col justify-between transition-all duration-500 hover:bg-card hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group">

                <div className="space-y-6">
                  {/* STAR RATING */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < item.rating ? "fill-secondary text-secondary" : "text-muted"}
                        />
                      ))}
                    </div>
                    <Quote className="text-muted group-hover:text-primary/20 transition-colors" size={24} />
                  </div>

                  {/* COMMENT */}
                  <p className="text-base font-bold text-foreground tracking-tight leading-relaxed line-clamp-4">
                    "{item.comment}"
                  </p>
                </div>

                {/* CUSTOMER PROFILE */}
                <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-background border border-border shrink-0">
                    {item.customer.profile_picture ? (
                      <Image src={item.customer.profile_picture} alt={item.customer.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-black text-primary bg-primary/5 uppercase text-[10px]">
                        {item.customer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-foreground text-xs tracking-tight truncate">{item.customer.name}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                      Event: <span className="text-primary italic">{item.event.title}</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}