'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Target, Rocket, Anchor, Flag, TrendingUp, Compass, CheckCircle2 } from 'lucide-react';

const timeline = [
    {
        year: '2022',
        title: 'The Visionary Genesis',
        desc: 'Cox Wave was founded by three coastal enthusiasts with a single mission: to standardize luxury tourism in Bangladesh. We started by mapping 15km of unexplored private beachfront.',
        icon: Compass
    },
    {
        year: '2023',
        title: 'Luxury Fleet Expansion',
        desc: 'Partnered with the region\'s first five private luxury cruises. We implemented our first safety-first verification protocol, ensuring every traveler is protected by international maritime standards.',
        icon: Anchor
    },
    {
        year: '2024',
        title: 'The Digital Transformation',
        desc: 'Launched our proprietary booking ecosystem. We integrated instant verification for owners and real-time support for travelers, serving over 5,000 customers in the first 6 months.',
        icon: Rocket
    },
    {
        year: '2026',
        title: 'Market Leadership',
        desc: 'Recognized as the #1 premium experience platform in Cox\'s Bazar. Now serving 12k+ travelers annually with an elite partner network of 45+ luxury providers.',
        icon: Flag
    }
];

const TimeLine = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container-max px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left Side - Context & Visual */}
                    <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
                        <div className="space-y-6">
                            <div className="h-1.5 w-16 bg-primary rounded-full" />
                            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-[0.95]">
                                Our <span className="text-primary italic">Journey.</span>
                            </h2>
                            <p className="text-base md:text-lg text-neutral-500 font-medium leading-relaxed max-w-sm">
                                From a small collective in Inani to the region's most trusted luxury ecosystem, our growth is a testament to our commitment to excellence.
                            </p>
                        </div>

                        <div className="relative h-64 md:h-80 w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white shadow-primary/10">
                            <Image
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
                                alt="Our Journey Background"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <p className="text-white text-sm font-black uppercase tracking-widest bg-primary/80 backdrop-blur-md px-4 py-2 rounded-full">
                                    Since 2022
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - One-Sided Detailed Timeline */}
                    <div className="lg:col-span-7 space-y-2 pt-4">
                        {timeline.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex gap-8 group"
                            >
                                {/* Vertical Line Segment */}
                                <div className="flex flex-col items-center">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow w-0.5 bg-neutral-100 my-4" />
                                </div>

                                {/* Content Details */}
                                <div className="space-y-1 pb-3">
                                    <span className="text-sm font-black text-primary italic uppercase tracking-widest">
                                        {item.year}
                                    </span>
                                    <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-none">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm  text-neutral-500 font-medium leading-tied max-w-xl">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center gap-2 pt-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                        <CheckCircle2 className="w-3 h-3 text-primary" />
                                        <span>Achieved & Verified</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Closing Indicator */}
                        <div className="flex items-center gap-4 pl-12 -mt-4">
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">To be continued...</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TimeLine;