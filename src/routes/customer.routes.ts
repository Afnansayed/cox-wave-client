import { Route } from '@/types/route.type';
import { KeyRound, User } from 'lucide-react';

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
      
    ],
  },
];