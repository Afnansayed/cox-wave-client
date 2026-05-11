'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    image: "/module/home/bbq1.jpg",
    title: "Premium Shore Grills",
    subtitle: "Inani Beach Hotel Specials",
    tag: "Luxury Dining",
    accent: "text-primary",
  },
  {
    image: "/module/home/bbq2.webp",
    title: "Seafood & Sea BBQ",
    subtitle: "Marine Drive Fresh Catch",
    tag: "Live Booking",
    accent: "text-secondary"
  },
  {
    image: "/module/home/bbq3.webp",
    title: "Tropical Sundown",
    subtitle: "Sugondha Point Gatherings",
    tag: "Sunset Event",
    accent: "text-primary",
  },
  {
    image: "/module/home/bbq4.jpg",
    title: "Starry Night Bonfire",
    subtitle: "Himchari Camping Grounds",
    tag: "Adventure Night",
    accent: "text-secondary"
  },
  {
    image: "/module/home/bbq5.jpg",
    title: "Private Resort Roast",
    subtitle: "Exclusive Vendor Slots",
    tag: "Business Listing",
    accent: "text-primary",
  },
  {
    image: "/module/home/bbq6.jpg",
    title: "Coastal Feast Festival",
    subtitle: "Seasonal Group Bookings",
    tag: "Marketplace Live",
    accent: "text-secondary"
  }
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full lg:h-[70vh] min-h-[750px] lg:min-h-[600px] lg:max-h-[850px] overflow-hidden bg-white dark:bg-[#080808] transition-colors duration-500 flex items-center">

      {/* 1. ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index].image}
              alt="Cox's Wave Background"
              fill
              className="object-cover grayscale dark:invert-0"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container-max  h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8 h-full">

          {/* 2. TEXT CONTENT (Exact Design) */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-10 text-center lg:text-left pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
                System Live: Season 2026
              </span>
            </motion.div>

            <div className="space-y-4 lg:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black text-neutral-900 dark:text-white  tracking-tighter"
              >
                Chase the {' '}
                <span className={`italic underline decoration-4 underline-offset-8 transition-colors duration-700 ${slides[index].accent}`}>
                  Perfect  <br className="hidden lg:block" />
                </span> Wave in Cox's Bazar.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg lg:text-xl text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                From luxury private cruises to high-octane surf festivals. Discover the hidden gems of the world's longest natural sea beach.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/10">
                Explore Events
              </Button>
              <button className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-full border border-neutral-200 dark:border-white/10 flex items-center justify-center group-hover:border-blue-500 transition-colors bg-white/5 backdrop-blur-sm">
                  <Play className="w-4 h-4 fill-current text-primary ml-0.5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-white">Watch Story</span>
              </button>
            </motion.div>
          </div>

          {/* 3. INTERACTIVE BENTO CARD (Exact Design) */}
          <div className="lg:col-span-5 flex justify-center items-center pb-10 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-[480px] aspect-[6/5] lg:aspect-[6/6] bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-3 sm:p-4 overflow-hidden backdrop-blur-3xl shadow-2xl"
            >
              <div className="relative w-full h-[75%] lg:h-[80%] rounded-[2rem] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slides[index].image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-left">
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{slides[index].subtitle}</p>
                  <h4 className="text-xl font-bold text-white">{slides[index].title}</h4>
                </div>
              </div>

              <div className="h-[25%] lg:h-[20%] flex flex-col justify-center px-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                    <span>Optimizing Experience</span>
                    <span>0{index + 1}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      key={index}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 4. SCROLL INDICATOR */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
      >
        <div className="w-5 h-8 rounded-full border-2 border-neutral-300 dark:border-white/20 flex justify-center p-1.5">
          <div className="w-1 h-1 bg-blue-500 rounded-full" />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-500">Explore</span>
      </motion.div>
    </section>
  );
}