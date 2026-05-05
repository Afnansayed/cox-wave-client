'use client'
import Image from "next/image";
import { motion } from 'framer-motion';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AboutBanner = () => {
    return (

        <section className="relative py-12 w-full flex items-center justify-center overflow-hidden">
            {/* Background Visual - Immersive but contained */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=2000"
                    alt="Cox's Bazar"
                    fill
                    className="object-fill"
                    priority
                />
                <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />
            </div>

            <div className="container-max w-full  px-6 relative z-10">
                <div className=" w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items- gap-3 bg-primary/20 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Our Vision</span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                            Redefining
                            <span className="text-primary-light italic">The Standard.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-neutral-200 max-w-2xl leading-relaxed font-medium">
                            We are more than a platform. We are a collective of visionaries dedicated to elevating Cox's Bazar to the global stage of luxury coastal tourism.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            <Link href="/event">
                                <Button className="h-14 px-6 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-primary/20 hover:-translate-y-1">
                                    Explore Experiences
                                </Button>
                            </Link>

                            {/* Glassmorphism Stat Card */}
                            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 px-8 py-3 rounded-3xl flex items-center gap-6 shadow-xl shadow-black/5">
                                <div className="text-center">
                                    <p className="text-xl font-black text-white">12k+</p>
                                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Travelers</p>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="text-center">
                                    <p className="text-xl font-black text-white">4.9</p>
                                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Rating</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
                <div className="absolute bottom-10 right-10 hidden lg:block">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-white/10 rounded-[3rem]"
                    />
                </div>
            </div>

            {/* Floating Geometric Elements */}

        </section>
    );
};

export default AboutBanner;