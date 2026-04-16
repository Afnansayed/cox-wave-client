import Link from 'next/link';
import { 
  Waves, 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Our Story", path: "/story" },
        { label: "Careers", path: "/careers" },
        { label: "Contact", path: "/contact" },
      ]
    },
    {
      title: "Experiences",
      links: [
        { label: "Beach Parties", path: "/events/beach" },
        { label: "Water Sports", path: "/events/water" },
        { label: "Private Cruises", path: "/events/cruises" },
        { label: "Cultural Tours", path: "/events/culture" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", path: "/help" },
        { label: "Booking Guide", path: "/guide" },
        { label: "Refund Policy", path: "/refunds" },
        { label: "Privacy Policy", path: "/privacy" },
      ]
    }
  ];

  return (
    <footer className="bg-neutral-900 text-white pt-20 pb-10 overflow-hidden">
      <div className="container-max px-6">
        
        {/* TOP SECTION: NEWSLETTER & BRAND */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-white/10">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="bg-primary p-2 rounded-xl">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                Cox<span className="text-primary italic">Wave</span>
              </span>
            </Link>
            <p className="text-neutral-400 max-w-sm text-sm md:text-base leading-relaxed">
              Elevating the Cox's Bazar experience through premium curated events and luxury coastal adventures.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-primary hover:border-primary transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
            <h4 className="text-lg font-bold">Subscribe to Our Newsletter</h4>
            <p className="text-sm text-neutral-400">Get early access to seasonal festivals and exclusive offers.</p>
            <div className="relative flex items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full h-12 bg-white/10 border-none rounded-full px-6 text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-neutral-500"
              />
              <button className="absolute right-2 h-10 w-10 flex items-center justify-center bg-primary rounded-full hover:bg-primary-dark transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-6">
              <h5 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary-light">
                {group.title}
              </h5>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.path} className="text-sm md:text-base text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6 col-span-2 md:col-span-1">
            <h5 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary-light">
              Contact Us
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-neutral-400 text-sm md:text-base">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Marine Drive, Inani, <br/>Cox's Bazar, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-400 text-sm md:text-base">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-400 text-sm md:text-base">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@coxwave.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            © {currentYear} CoxWave Premium Tourism. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-widest">Systems Operational</span>
            </div>
            <p className="text-xs text-neutral-600 italic">Designed for Excellence</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
