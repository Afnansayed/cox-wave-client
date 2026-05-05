'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, CheckCircle2 } from 'lucide-react';

const RefundPolicy = () => {
  const policies = [
    {
      title: "Standard Cancellation",
      content: "You are eligible for a full refund if you cancel your booking at least 7 days before the scheduled event. Cancellations made between 2 to 6 days prior to the event are eligible for a 50% refund."
    },
    {
      title: "Non-Refundable Period",
      content: "Cancellations made within 24 to 48 hours of the event start time are not eligible for a refund, as service providers have already finalized logistics and staffing for your experience."
    },
    {
      title: "Weather & Safety Cancellations",
      content: "If an event is cancelled by Cox Wave or the Service Provider due to hazardous weather conditions or safety concerns, you will receive a 100% refund or the option to reschedule without any additional fee."
    },
    {
      title: "Refund Processing Time",
      content: "Once a refund is approved, the funds will be credited back to your original payment method. Please allow 5 to 10 business days for the transaction to appear on your bank statement."
    },
    {
      title: "Partner Policy Overrides",
      content: "Certain exclusive events or luxury cruises may have specific refund policies mentioned on their booking page. In such cases, the event-specific policy will take precedence over our standard terms."
    }
  ];

  return (
    <main className="bg-background min-h-screen">
      {/* Simple Header */}
      <header className="bg-muted/50 py-12 border-b border-border flex items-center justify-center">
        <div className="container-max px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <RefreshCcw size={18} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Financial Policy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none mb-6">
              Refund <span className="italic text-secondary">Policy.</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xl mx-auto">
              Our goal is to be fair to both our travelers and our local partners. Please read our cancellation and refund guidelines below.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Content Section */}
      <section className="container-max px-6 py-12 flex flex-col items-center">
        <div className="max-w-3xl w-full space-y-12 text-center md:text-left">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center justify-center md:justify-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary hidden md:block" />
                {policy.title}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                {policy.content}
              </p>
            </motion.div>
          ))}

          {/* Simple Footer Note */}
          <div className="pt-12 border-t border-border flex flex-col items-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle2 size={16} className="text-secondary" />
              <p className="text-[10px] font-black uppercase tracking-widest">Effective Since: January 2026</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicy;
