import { Route } from '@/types/route.type';
import { KeyRound, Ticket, User } from 'lucide-react';

export const customerRoutes: Route[] = [
  {
    title: 'Customer Dashboard',
    items: [
      {
        title: 'Customer Dashboard',
        url: '/customer-dashboard/account',
        icon: User,
      },
      {
        title: 'Change Password',
        url: '/customer-dashboard/change-password',
        icon: KeyRound,
      },
      {
        title: 'My Bookings',
        url: '/customer-dashboard/booking',
        icon: Ticket,
      },
      
    ],
  },
];