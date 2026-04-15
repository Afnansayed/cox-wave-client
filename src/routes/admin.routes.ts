import { Route } from '@/types/route.type';
import { KeyRound, User } from 'lucide-react';

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
      
    ],
  },
];
