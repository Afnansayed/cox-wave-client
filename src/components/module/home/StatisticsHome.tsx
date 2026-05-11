'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Flame, Map, Award } from 'lucide-react';

const stats = [
    {
        id: 1,
        label: "Happy Adventurers",
        value: "12K+",
        icon: <Users className="text-orange-500" />,
        desc: "Travelers joined our beach events"
    },
    {
        id: 2,
        label: "Events Hosted",
        value: "450+",
        icon: <Flame className="text-primary" />,
        desc: "BBQs and Bonfires listed this year"
    },
    {
        id: 3,
        label: "Partner Hotels",
        value: "85+",
        icon: <Map className="text-cyan-500" />,
        desc: "Top resorts from Inani to Laboni"
    },
    {
        id: 4,
        label: "Top Rated",
        value: "4.9/5",
        icon: <Award className="text-amber-500" />,
        desc: "Average rating from our community"
    }
];

export default function Statistics() {
    return (
        <section className="pt-12 bg-background relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-[120px] rounded-full -z-10" />

            <div className="container-max">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* LEFT: Text Content */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                                <span className="h-1 w-8 bg-primary rounded-full" />
                                Impact & Growth
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                                Our Numbers <br /> Tell the <span className="text-primary italic">Story.</span>
                            </h2>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm md:text-base max-w-sm leading-relaxed">
                            We are building the largest coastal event ecosystem in Bangladesh, connecting hospitality owners with beach lovers.
                        </p>
                    </div>

                    {/* RIGHT: Stats Grid */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.id}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-card border border-border rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        {stat.icon}
                                    </div>
                                    <span className="text-4xl font-black text-foreground tracking-tighter">
                                        {stat.value}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">
                                        {stat.label}
                                    </h4>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {stat.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}