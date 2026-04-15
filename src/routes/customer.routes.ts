import { Route } from '@/types/route.type';
import {  User } from 'lucide-react';

export const customerRoutes: Route[] = [
  {
    title: 'Customer Dashboard',
    items: [
      {
        title: 'Customer Dashboard',
        url: '/customer-dashboard/account',
        icon: User,
      },
      
    ],
  },
];