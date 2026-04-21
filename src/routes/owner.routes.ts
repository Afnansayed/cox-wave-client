import { Route } from '@/types/route.type';
import { CalendarDays, KeyRound, Ticket, User } from 'lucide-react';

export const ownerRoutes: Route[] = [
  {
    title: 'Owner Dashboard',
    items: [
      {
        title: 'Owner Dashboard',
        url: '/owner-dashboard/account',
        icon: User,
      },
      {
        title: 'Change Password',
        url: '/owner-dashboard/change-password',
        icon: KeyRound,
      },
      {
        title: 'Bookings',
        url: '/owner-dashboard/booking',
        icon: Ticket,
      },
      {
        title: 'Events',
        url: '/owner-dashboard/event',
        icon: CalendarDays,
      },
      
    ],
  },
];