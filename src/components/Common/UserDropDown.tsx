'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, HelpCircle, LogOut, BookIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logOut, useCurrentUserInfo } from '../Redux/Slice/authSlice';
import { useAppSelector } from '../Redux/hooks';

import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { Roles } from '@/constants/role.type';
import { logoutUser } from '../Authentication/logoutUser';
import { getCookie } from '@/lib/cookie.utils';
import { DecodedToken } from '@/types/auth.types';
import { jwtUtils } from '@/lib/jwt.utils';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = await getCookie('accessToken');
      if (accessToken) {
        const decoded = jwtUtils.decodedToken(accessToken) as DecodedToken;
        setUserInfo(decoded);
      }
    };
    fetchUser();
  }, []);

  const isLoggedIn = userInfo ? true : false;
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      dispatch(logOut());
      await logoutUser();
      toast.success("Logged out successfully");
      router.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoProfile = (): string => {
    if (!userInfo) return '/';

    switch (userInfo?.role) {
      case Roles.admin:
        return '/admin-dashboard';
      case Roles.customer:
        return '/customer-dashboard';
      case Roles.owner:
        return '/owner-dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sign in button */}
      <div
        onClick={toggleDropdown}
        className="flex gap-1.5 cursor-pointer"
      >
        <Image src={'i.svg'} alt="user icon" width={24} height={24} />
        <button
          className="hidden sm:block text-foreground hover:text-primary transition-colors font-semibold"
          title={isLoggedIn ? userInfo?.name : ''} // Full name on hover
        >
          {isLoggedIn
            ? `${userInfo?.name?.substring(0, 12)}${userInfo?.name?.length && userInfo?.name?.length > 12 ? '...' : ''
            }`
            : 'Sign in'}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          {isLoggedIn ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Authenticated</p>
                <h3 className="font-bold text-foreground truncate">
                  {userInfo?.name}
                </h3>
              </div>
              {/* Menu Items */}
              <div className="py-2">
                {userInfo?.role === Roles.customer && (
                  <>
                    <Link
                      href={handleGoProfile()}
                      className="flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Account</span>
                    </Link>

                    <Link
                      href="/customer-dashboard/booking"
                      className="flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <BookIcon className="w-4 h-4" />
                      <span className="text-sm">My Bookings</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm">Contact Us</span>
                    </Link>
                  </>
                )}

                {userInfo?.role === Roles.admin && (
                  <div className="py-2">
                    <Link
                      href={handleGoProfile()}
                      className="flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                  </div>
                )}

                {userInfo?.role === Roles.owner && (
                  <div className="py-2">
                    <Link
                      href={handleGoProfile()}
                      className="flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>

                    <Link
                      href="/owner-dashboard/booking"
                      className="flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <BookIcon className="w-4 h-4" />
                      <span className="text-sm">My Bookings</span>
                    </Link>
                  </div>
                )}

                <div className="my-2 border-t border-border" />

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-5 py-2.5 text-destructive hover:bg-destructive/10 transition-all w-full text-left font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            /* Not logged in state */
            <div className="p-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Get Started</p>
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground text-center py-2.5 px-4 rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary/20"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block w-full border border-border text-foreground hover:bg-muted text-center py-2.5 px-4 rounded-xl transition-all font-bold text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
