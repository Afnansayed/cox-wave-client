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

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(useCurrentUserInfo);

  const isLoggedIn = user ? true : false;
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
    if (!user) return '/';

    switch (user?.role) {
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
          className="hidden sm:block text-Black hover:text-primary transition-colors"
          title={isLoggedIn ? user?.name : ''} // Full name on hover
        >
          {isLoggedIn
            ? `${user?.name?.substring(0, 8)}${user?.name?.length && user?.name?.length > 8 ? '...' : ''
            }`
            : 'Sign in'}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stroke_1 rounded-lg shadow-lg z-50">
          {isLoggedIn ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-stroke_1">
                <h3 className="font-medium text-Black">
                  Welcome, {user?.name}!
                </h3>
              </div>
              {/* Menu Items */}
              {user?.role === Roles.customer && (
                <div className="py-2">
                  <Link
                    href={handleGoProfile()}
                    className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    href="/customer-dashboard/booking"
                    className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <BookIcon className="w-5 h-5" />
                    <span className="font-medium">My Bookings</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Contact Us</span>
                  </Link>
                </div>
              )}

              {user?.role === Roles.admin && (
                <div className="py-2">
                  <Link
                    href={handleGoProfile()}
                    className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </div>
              )}

              {user?.role === Roles.owner && (
                <div className="py-2">
                  <Link
                    href={handleGoProfile()}
                    className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>

                <Link
                    href="/owner-dashboard/booking"
                    className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <BookIcon className="w-5 h-5" />
                    <span className="font-medium">My Bookings</span>
                  </Link>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 text-body_text hover:bg-primary_light transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            /* Not logged in state */
            <div className="p-4">
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full bg-primary hover:bg-darker_orange text-white text-center py-2 px-4 rounded-full transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block w-full border border-body_text text-body_text hover:bg-primary_light text-center py-2 px-4 rounded-full transition-colors"
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
