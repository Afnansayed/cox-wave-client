'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Send,
  Linkedin,
  Youtube,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Our Mission", path: "/about" },
        { label: "Contact Us", path: "/contact" },
      ]
    },
    {
      title: "Experiences",
      links: [
        { label: "Browse Events", path: "/event" },
        { label: "Beach BBQs", path: "/event" },
        { label: "Water Adventures", path: "/event" },
        { label: "Secret Parties", path: "/event" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", path: "/contact" },
        { label: "Terms of Service", path: "/terms-and-conditions" },
        { label: "Refund Policy", path: "/refund-policy" },
        { label: "Privacy Policy", path: "/privacy-policy" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/coxwave", color: "hover:bg-pink-500" },
    { icon: Facebook, href: "https://facebook.com/coxwave", color: "hover:bg-blue-600" },
    { icon: Twitter, href: "https://twitter.com/coxwave", color: "hover:bg-sky-500" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/afnan-sayed-razin/", color: "hover:bg-blue-700" },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.success === true) {
        setIsSuccess(true);
        toast.success(result.message);
        reset();
      } else {
        toast.error(result?.message || "Failed to subscribe");
      }
    } catch (err) {
      toast.error("Server connection failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-neutral-900 text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="container-max px-6">

        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16 border-b border-white/10">

          {/* BRAND IDENTITY */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="flex aspect-square size-12 items-center justify-center rounded-2xl shadow-xl shadow-primary/20 bg-primary/10 border border-white/10 group-hover:scale-110 transition-transform">
                <Image src="/cox-wave-icon.png" alt="CoxWave Logo" width={120} height={120} className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white leading-none">
                  Cox<span className="text-primary italic">Wave</span>
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="h-[1px] w-3 bg-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Premium Tourism</span>
                </div>
              </div>
            </Link>

            <p className="text-neutral-400 max-w-sm text-sm md:text-base font-medium leading-relaxed">
              Curating the finest coastal experiences in Cox&apos;s Bazar. From luxury beach festivals to private bonfire nights, we redefine seaside hospitality.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target="_blank"
                  className={`h-11 w-11 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${social.color} hover:border-transparent transition-all duration-300 group`}
                >
                  <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* NEWSLETTER BOX */}
          <div className="lg:col-span-7">
            <div className="relative p-8 md:p-10 rounded-[3rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-black tracking-tight">Stay in the Wave</h4>
                  <p className="text-sm text-neutral-400 font-medium">Get early access to secret beach parties and seasonal resort offers.</p>
                </div>

                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center space-y-2 animate-in fade-in zoom-in duration-500">
                    <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="text-white font-black uppercase tracking-widest text-[10px]">Subscribed!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div className="relative flex items-center">
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="Email address"
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-[1.5rem] px-6 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                      />
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="absolute right-2 h-10 px-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin w-3.5 h-3.5" />
                        ) : (
                          <>Join <Send className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-4">
                        {errors.email.message as string}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS & CONTACT */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-20">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                {group.title}
              </h5>
              <ul className="space-y-5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.path} className="text-sm md:text-[15px] text-neutral-400 hover:text-white transition-all flex items-center gap-1.5 group font-medium">
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CONTACT INFO */}
          <div className="col-span-2 space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Reach Out
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 text-neutral-400 group">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Base Camp</p>
                  <p className="text-sm font-medium leading-relaxed">Marine Drive, Inani Beach,<br />Cox&apos;s Bazar, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-neutral-400 group">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Hotline</p>
                  <p className="text-sm font-medium tracking-tight">+880 1700 000 000</p>
                  <p className="text-xs text-neutral-500">24/7 Concierge Support</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-neutral-400 group md:col-span-2">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Official Email</p>
                  <p className="text-sm font-medium">concierge@coxwave.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: LEGAL & STATUS */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-[11px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest">
              © {currentYear} CoxWave Premium.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-neutral-600">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Service Live</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
