'use client'
import { motion } from 'framer-motion';
import { Clock, Gem, Leaf, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};
const OurStory = () => {

    return (
        <section className="py-12 bg-background overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 -z-10" />
            <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                <motion.div className="lg:col-span-5 space-y-8" {...fadeIn}>
                    <div className="space-y-4">
                        <div className="h-1 w-12 bg-primary rounded-full" />
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                            Crafting the <br /> <span className="text-primary italic">Perfect Wave.</span>
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                            Founded by a collective of surfers and hospitality experts, Cox Wave was born out of a desire to bridge the gap between world-class standards and the raw beauty of Bangladesh.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            We believe that every wave tells a story and every sunset is a masterpiece. Our mission is to empower both travelers looking for magic and local providers looking for growth.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            {[
                                { label: 'Verified Partners', icon: ShieldCheck },
                                { label: '24/7 Concierge', icon: Clock },
                                { label: 'Luxury Standards', icon: Gem },
                                { label: 'Eco Friendly', icon: Leaf }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <item.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-black text-foreground uppercase tracking-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Side Image - Fixed Rounding */}
                <motion.div className="lg:col-span-7 relative" {...fadeIn}>
                    <div className="relative aspect-video rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl border-4 border-background shadow-primary/10">
                        <Image
                            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200"
                            alt="Our Vision"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                </motion.div>
            </div>
        </section>
    );
};

export default OurStory;