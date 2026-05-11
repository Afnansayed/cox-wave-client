'use client';

import { useState } from 'react';
import {
    Plus, Minus, HelpCircle, Users, Briefcase,
    ArrowRight, MessageCircleQuestion
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
    const [activeView, setActiveView] = useState<'customer' | 'owner'>('customer');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const customerFaqs = [
        {
            question: "How do I find a beach BBQ party?",
            answer: "Use our 'Discovery' filter on the homepage. You can sort by event type (BBQ, Surf, or Campfire) and location like Inani or Laboni Point."
        },
        {
            question: "Is my booking payment secure?",
            answer: "Yes, we use SSL-encrypted local gateways like SSLCommerz and bKash to ensure every transaction is 100% safe."
        },
        {
            question: "What if the event is cancelled due to weather?",
            answer: "If the host cancels due to rain or sea conditions, you will receive a full refund or a reschedule option within 24 hours."
        },
        {
            question: "What if the event is cancelled due to weather?",
            answer: "If the host cancels due to rain or sea conditions, you will receive a full refund or a reschedule option within 24 hours."
        }
    ];

    const ownerFaqs = [
        {
            question: "How long does it take for an event to go live?",
            answer: "Once you submit your event, our admin team performs a quality check. Usually, events are approved and live within 24 hours."
        },
        {
            question: "How do I receive my payouts?",
            answer: "Payouts are processed weekly. You can track your total earnings and ROI directly from your Owner Dashboard."
        },
        {
            question: "Can I limit the number of participants?",
            answer: "Yes, while setting up your event, you can define the maximum capacity. Our system will automatically stop bookings once seats are full."
        }
    ];

    const currentFaqs = activeView === 'customer' ? customerFaqs : ownerFaqs;

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            {/* Background Accent consistent with your WorkProcess */}
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-muted/20 -z-10" />

            <div className="container-max">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* LEFT COLUMN: NAVIGATION (Same as WorkProcess) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-4">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                                Frequently <br /> <span className="text-primary italic">Asked.</span>
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xs">
                                Everything you need to know about CoxWave events and hosting.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { setActiveView('customer'); setOpenIndex(null); }}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-2xl border transition-all",
                                    activeView === 'customer' ? "bg-card border-primary shadow-xl shadow-primary/5" : "bg-transparent border-border grayscale opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2.5 rounded-xl", activeView === 'customer' ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                        <Users size={20} />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-foreground">Customer FAQ</span>
                                </div>
                                <ArrowRight size={16} className={cn("transition-transform text-foreground", activeView === 'customer' ? "translate-x-0" : "-translate-x-2")} />
                            </button>

                            <button
                                onClick={() => { setActiveView('owner'); setOpenIndex(null); }}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-2xl border transition-all",
                                    activeView === 'owner' ? "bg-card border-primary shadow-xl shadow-primary/5" : "bg-transparent border-border grayscale opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2.5 rounded-xl", activeView === 'owner' ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-foreground">Owner FAQ</span>
                                </div>
                                <ArrowRight size={16} className={cn("transition-transform text-foreground", activeView === 'owner' ? "translate-x-0" : "-translate-x-2")} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ACCORDION LIST */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeView}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {currentFaqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "group border border-border rounded-[1.5rem] transition-all duration-300",
                                                openIndex === index ? "bg-card shadow-2xl shadow-primary/5 border-primary/20" : "bg-transparent"
                                            )}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                                className="w-full flex items-center justify-between px-6 py-6 text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-lg flex items-center justify-center border border-border transition-colors",
                                                        openIndex === index ? "bg-primary text-white border-primary" : "bg-muted/50 text-primary"
                                                    )}>
                                                        <MessageCircleQuestion size={16} />
                                                    </div>
                                                    <span className="text-base md:text-lg font-black text-foreground tracking-tight">
                                                        {faq.question}
                                                    </span>
                                                </div>
                                                <div className={cn(
                                                    "transition-transform duration-300",
                                                    openIndex === index ? "rotate-180" : ""
                                                )}>
                                                    {openIndex === index ? <Minus size={18} className="text-primary" /> : <Plus size={18} className="text-muted-foreground" />}
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {openIndex === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-12 pb-8 ml-6 text-xs md:text-sm text-muted-foreground font-medium leading-relaxed border-t border-border/50 pt-4">
                                                            {faq.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}