import { Route } from '@/types/route.type';
import { CalendarDays, KeyRound, MessageSquare, ShieldCheck, Ticket, User } from 'lucide-react';

export const adminRoutes: Route[] = [
  {
    title: 'Admin Dashboard',
    items: [
      {
        title: 'admin Dashboard',
        url: '/admin-dashboard/account',
        icon: User,
      },
      {
        title: 'Change Password',
        url: '/admin-dashboard/change-password',
        icon: KeyRound,
      },
      {
        title: 'Bookings',
        url: '/admin-dashboard/booking',
        icon: Ticket,
      },
      {
        title: 'Reviews',
        url: '/admin-dashboard/review',
        icon: MessageSquare,
      },
      {
        title: 'Owners',
        url: '/admin-dashboard/owner',
        icon: ShieldCheck,
      },
       {
        title: 'Events',
        url: '/admin-dashboard/event',
        icon: CalendarDays,
      },
      
    ],
  },
];
