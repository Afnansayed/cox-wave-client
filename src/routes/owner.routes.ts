import { Route } from '@/types/route.type';
import {  User } from 'lucide-react';

export const ownerRoutes: Route[] = [
  {
    title: 'Owner Dashboard',
    items: [
      {
        title: 'Owner Dashboard',
        url: '/owner-dashboard/account',
        icon: User,
      },
      
    ],
  },
];