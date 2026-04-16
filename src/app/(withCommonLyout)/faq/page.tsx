'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a beach experience?',
    answer:
      "Simply browse our 'Popular Picks' section, select your preferred date and time, and complete the secure payment. You'll receive an instant confirmation via email and SMS.",
  },
  {
    question: 'What is the refund policy for bad weather?',
    answer:
      "Safety is our priority. If an event is cancelled due to heavy sea conditions or weather alerts, you will receive a 100% refund or the option to reschedule.",
  },
  {
    question: 'Are the bike tours safe for beginners?',
    answer:
      'Absolutely! Our Marine Drive bike tours include a professional guide, safety gear, and a briefing before we set off. We maintain a relaxed pace for everyone.',
  },
  {
    question: 'Can I book a private BBQ for a group?',
    answer:
      'Yes! We specialize in private coastal events. You can select the "Private Group" option during checkout or contact our support team for custom arrangements.',
  },
  {
    question: 'Where is the meeting point for the Yacht Cruise?',
    answer:
      'Most cruises depart from the Marine Drive Pier at Kolatoli Point. Detailed location pins are provided in your booking dashboard after confirmation.',
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      {/* --- HEADER SECTION --- */}
      <section className="mb-12">
        <div className="container-max px-6 text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-2">
               <HelpCircle size={18} className="text-secondary" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Support Center</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
              Common <span className="italic text-primary font-black">Questions.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- FAQ ACCORDION SECTION --- */}
      <section className="container-max px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border transition-all duration-200 ${
                activeIndex === index 
                ? 'bg-white border-primary/20 shadow-lg shadow-primary/5' 
                : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
              }`}
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none group"
              >
                <span
                  className={`font-bold text-sm md:text-base tracking-tight transition-colors ${
                    activeIndex === index ? 'text-primary-dark' : 'text-neutral-700'
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeIndex === index 
                    ? 'bg-primary text-white rotate-180' 
                    : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200'
                  }`}
                >
                  {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-neutral-500 text-sm leading-relaxed font-medium">
                      <div className="pt-3 border-t border-neutral-50">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;