'use client';

import { motion } from 'framer-motion';
import { Gavel, CheckCircle2 } from 'lucide-react';

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Cox Wave, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and others who access the service. If you disagree with any part of the terms, then you may not access the platform."
    },
    {
      title: "2. Eligibility",
      content: "You must be at least 18 years of age to use this platform or book any services. By using Cox Wave, you represent and warrant that you have the right, authority, and capacity to enter into this agreement and to abide by all of the terms and conditions."
    },
    {
      title: "3. User Accounts",
      content: "When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password."
    },
    {
      title: "4. Prohibited Activities",
      content: "You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the platform in any medium; (ii) using any automated system, including without limitation 'robots,' 'spiders,' 'offline readers,' etc.; (iii) transmitting spam, chain letters, or other unsolicited email; (iv) attempting to interfere with or compromise the system integrity or security."
    },
    {
      title: "5. Booking and Payments",
      content: "All bookings are subject to availability and the specific terms of the service provider (Owner). Payments are processed securely through our platform. Cox Wave acts as an intermediary; however, we reserve the right to refuse or cancel any order for reasons including but not limited to: product or service availability, errors in the description or price, or error in your order."
    },
    {
      title: "6. Service Provider (Owner) Terms",
      content: "Owners are responsible for the accuracy of their listings, including prices, availability, and descriptions. All events must go through our internal approval process before being made active. Owners have the right to approve or reject individual booking requests based on their specific capacity and logistics."
    },
    {
      title: "7. Intellectual Property",
      content: "The service and its original content, features, and functionality are and will remain the exclusive property of Cox Wave and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Cox Wave. You may not modify, publish, transmit, or participate in the transfer or sale of any content on the site."
    },
    {
      title: "8. Termination",
      content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the platform will immediately cease. If you wish to terminate your account, you may simply discontinue using the platform."
    },
    {
      title: "9. Governing Law",
      content: "These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
    },
    {
      title: "10. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
    }
  ];

  return (
    <main className="bg-white min-h-screen ">
      {/* Simple Header */}
      <header className="bg-neutral-50 py-12 border-b border-neutral-100 flex items-center justify-center">
        <div className="container-max px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gavel size={18} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Legal Standard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-none mb-6">
              Terms & <span className="italic text-primary">Conditions.</span>
            </h1>
            <p className="text-neutral-500 font-medium text-sm md:text-base max-w-xl mx-auto">
              Comprehensive guidelines governing your relationship with Cox Wave. Please review these terms carefully to ensure a seamless experience.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Content Section */}
      <section className="container-max px-6 py-12 flex flex-col items-center">
        <div className="max-w-3xl w-full space-y-12 text-center md:text-left">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary hidden md:block" />
                {section.title}
              </h2>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-medium">
                {section.content}
              </p>
            </motion.div>
          ))}

          {/* Simple Footer Note */}
          <div className="pt-12 border-t border-neutral-100 flex flex-col items-center">
            <div className="flex items-center gap-3 text-neutral-400">
              <CheckCircle2 size={16} className="text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest">Last Updated: May 01, 2026</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;
