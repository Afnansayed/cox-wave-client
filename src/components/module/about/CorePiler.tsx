'use client'
import { Gem, Heart, Leaf, ShieldCheck } from "lucide-react";
import { motion } from 'framer-motion';
const pillars = [
    {
        title: 'Safety First',
        desc: 'All our cruises and events follow international maritime and safety standards.',
        icon: ShieldCheck,
    },
    {
        title: 'Luxury Defined',
        desc: 'We curate only the most premium experiences, from VIP decks to private beach dinners.',
        icon: Gem,
    },
    {
        title: 'Eco-Conscious',
        desc: 'We minimize our footprint and support local coastal preservation efforts.',
        icon: Leaf,
    },
    {
        title: 'Community Driven',
        desc: 'We empower local artisans and surfers, keeping the spirit of Cox’s Bazar alive.',
        icon: Heart,
    }
];

const CorePiler = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };
    return (
        <section className="py-12 bg-background">
            <div className="container-max px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-tight mb-4">
                        Our Core <span className="text-primary italic">Pillars.</span>
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">
                        We define the gold standard for coastal adventures in Bangladesh through four key commitments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            className="p-8 rounded-[2.5rem] bg-card border border-border hover:shadow-2xl transition-all group"
                            {...fadeIn}
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <pillar.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-3 tracking-tight">{pillar.title}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                                {pillar.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CorePiler;