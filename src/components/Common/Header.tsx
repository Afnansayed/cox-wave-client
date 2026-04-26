
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Waves,
  Menu,
  ChevronDown,
  Palmtree,
  ArrowRight,
  FileQuestion,
  Contact
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserDropdown from './UserDropDown';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { 
      path: '/explore', 
      label: 'Explore',
      submenu: [
        // { path: "/events/beach", label: "Beach Parties", icon: <Palmtree className="w-4 h-4" /> },
        { path: "/faq", label: "FAQ", icon: <FileQuestion className="w-4 h-4" /> },
        { path: "/contact", label: "Contact", icon: <Contact className="w-4 h-4" /> },
      ]
    },
    // { path: '/destinations', label: 'Destinations' },
    { path: '/event', label: 'Events' },
    { path: '/contact', label: 'contact' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[999]">
      <header
        className={cn(
          'w-full mx-auto transition-all duration-500 ease-in-out border-b lg:border',
          isScrolled
            ? 'bg-white/80 backdrop-blur-2xl border-neutral-200/50 shadow-sm py-3 px-4 md:px-6'
            : 'bg-white border-transparent py-4 px-5 md:py-5 md:px-8'
        )}
      >
        <div className="container-max flex items-center justify-between gap-2 md:gap-4 relative">
          
          {/* SEARCH BAR OVERLAY (Slides from left) */}
          {/* <div className={cn(
            "absolute inset-y-0 right-0 max-w-xl  bg-white z-50 flex items-center gap-3 transition-all duration-300 px-2 md:px-0",
            showSearch ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-4"
          )}>
            <div className="flex flex-1 items-center bg-neutral-100 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input 
                autoFocus={showSearch}
                type="text" 
                placeholder="Search events, cruises..." 
                className="w-full bg-transparent border-none outline-none focus:ring-none text-sm px-2 text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
            <button 
              onClick={() => setShowSearch(false)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div> */}
          

          {/* BRAND IDENTITY */}
          <Link href="/" className="flex items-center gap-2 md:gap-2.5 group shrink-0">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20 text-primary-foreground">
             <Image src="/cox-wave-icon.png" alt="CoxWave Logo" width={100} height={100} />
          </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight text-neutral-900 leading-none">
                Cox<span className="text-primary italic">Wave</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="h-[1px] w-2 md:w-3 bg-secondary" />
                <span className="text-[8px] md:text-[9px] font-bold md:font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-400">Premium</span>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV (Hidden on Mobile) */}
          <nav className="hidden lg:flex items-center bg-neutral-100/50 p-1.5 rounded-full border border-neutral-200/50">
            {links.map((link) => (
              <div key={link.path} className="relative group">
                {'submenu' in link ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold text-neutral-600 hover:text-primary transition-all rounded-full outline-none">
                      {link.label} <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover:rotate-180 transition-transform duration-300" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-64 p-3 mt-4 rounded-[1.5rem] bg-white/90 backdrop-blur-xl border-neutral-100 shadow-2xl">
                      {link?.submenu?.map((sub) => (
                        <DropdownMenuItem key={sub.path} asChild>
                          <Link href={sub.path} className="flex items-center gap-3 w-full cursor-pointer rounded-xl p-3 font-bold text-neutral-600 hover:text-primary hover:bg-primary/5 transition-all">
                            <div className="bg-white shadow-sm p-1.5 rounded-lg border border-neutral-100">{sub.icon}</div>
                            {sub.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={link.path}
                    className={cn(
                      'px-5 py-2 text-[13px] font-bold transition-all rounded-full relative',
                      pathname === link.path
                        ? 'text-white bg-primary shadow-md shadow-primary/20'
                        : 'text-neutral-500 hover:text-neutral-900'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA & PROFILE */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* <button 
              onClick={() => setShowSearch(true)}
              className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-primary hover:text-white transition-all duration-300 active:scale-90"
            >
              <Search className="w-4 h-4" />
            </button> */}

            <UserDropdown />
            
            <div className="h-6 md:h-8 w-[1px] bg-neutral-200 mx-0.5 md:mx-1 hidden sm:block" />

            {/* Desktop CTA */}
            <Link href="/event">
              <Button className="hidden md:flex relative overflow-hidden bg-secondary hover:bg-secondary-dark text-white px-7 h-11 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/20 transition-all hover:-translate-y-0.5 active:scale-95 group">
                <span className="relative z-10 flex items-center gap-2">
                  Book Experience <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            {/* MOBILE MENU TRIGGER */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg active:scale-90 transition-all">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full border-none bg-white p-0">
                <SheetHeader className="p-6 text-left border-b border-neutral-50">
                  <SheetTitle className="flex items-center gap-3">
                     <div className="h-9 w-9 rounded-xl bg-primary p-2 text-white shadow-lg">
                        <Waves className="h-full w-full" />
                      </div>
                      <span className="font-bold text-xl tracking-tighter">CoxWave</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-6 flex flex-col gap-4">
                  {links.map((link) => (
                    <div key={link.path}>
                      {'submenu' in link ? (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1">{link.label}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {link?.submenu?.map((sub) => (
                              <Link key={sub.path} href={sub.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 font-medium text-neutral-700 text-sm">
                                {sub.icon} {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link href={link.path} onClick={() => setIsOpen(false)} className="flex items-center justify-between py-3 px-1 border-b border-neutral-50 font-semibold text-neutral-800 text-lg">
                          {link.label}
                          <ArrowRight className="w-4 h-4 text-primary/40" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <Link href="/event">
                  <Button onClick={() => setIsOpen(false)} className="w-full h-14 rounded-2xl font-bold text-base bg-primary text-white shadow-xl shadow-primary/20">
                    Book Now
                  </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}