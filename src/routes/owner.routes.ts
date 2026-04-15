import { Route } from '@/types/route.type';
import { KeyRound, User } from 'lucide-react';

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
      
    ],
  },
];