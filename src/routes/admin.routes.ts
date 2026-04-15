import { Route } from '@/types/route.type';
import { Layers2, MessageCircleCode, NotebookPen, User } from 'lucide-react';

export const adminRoutes: Route[] = [
  {
    title: 'Admin Dashboard',
    items: [
      {
        title: 'admin Dashboard',
        url: '/admin-dashboard/account',
        icon: User,
      },
      
    ],
  },
];
