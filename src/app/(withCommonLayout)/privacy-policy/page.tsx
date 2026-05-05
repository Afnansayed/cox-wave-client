'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
    const points = [
        {
            title: "1. Introduction",
            content: "At Cox Wave, we are committed to protecting your privacy and ensuring a secure experience. This Privacy Policy explains how we collect, use, and share information when you visit or book a luxury event through our platform."
        },
        {
            title: "2. Information We Collect",
            content: "We collect information you provide directly to us, including: (i) Personal Information: name, email address, phone number, and mailing address. (ii) Booking Information: event selections, date, and time. (iii) Payment Information: credit card details (handled securely by our processors). (iv) Usage Data: IP address, browser type, and device information."
        },
        {
            title: "3. How We Use Information",
            content: "We use the collected information for various purposes: (i) To provide and maintain our Service. (ii) To notify you about changes to our Service. (iii) To allow you to participate in interactive features. (iv) To provide customer support. (v) To gather analysis or valuable information so that we can improve our Service. (vi) To monitor the usage of our Service."
        },
        {
            title: "4. Information Sharing",
            content: "We may share your information in the following situations: (i) With Service Providers (Owners): to facilitate your bookings and events. (ii) For Business Transfers: in connection with any merger, sale of company assets, or acquisition. (iii) With Affiliates: who will be required to honor this Privacy Policy. (iv) For Law Enforcement: if required to do so by law or in response to valid requests by public authorities."
        },
        {
            title: "5. Data Security",
            content: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means (SSL encryption, secure servers) to protect your Personal Data, we cannot guarantee its absolute security."
        },
        {
            title: "6. Your Data Rights",
            content: "Depending on your location, you may have the following rights: (i) The right to access, update or delete the information we have on you. (ii) The right of rectification. (iii) The right to object. (iv) The right of restriction. (v) The right to data portability. (vi) The right to withdraw consent."
        },
        {
            title: "7. Cookies Policy",
            content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
        },
        {
            title: "8. Third-Party Links",
            content: "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content or privacy practices of any third party sites."
        },
        {
            title: "9. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact our support concierge at info@coxwave.com or visit our contact page at '/contact'."
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
                            <ShieldCheck size={18} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Data Protection</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none mb-6">
                            Privacy <span className="italic text-primary">Policy.</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xl mx-auto">
                            Your privacy matters to us. This document outlines how we collect, safeguard, and use your data to provide a better service.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content Section */}
            <section className="container-max px-6 py-12 flex flex-col items-center">
                <div className="max-w-3xl w-full space-y-12 text-center md:text-left">
                    {points.map((point, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center justify-center md:justify-start gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary hidden md:block" />
                                {point.title}
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                                {point.content}
                            </p>
                        </motion.div>
                    ))}

                    {/* Simple Footer Note */}
                    <div className="pt-12 border-t border-border flex flex-col items-center">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <CheckCircle2 size={16} className="text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Last Modified: May 2026</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;
