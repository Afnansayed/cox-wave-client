'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { useAppDispatch } from '../Redux/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logOut } from '../Redux/Slice/authSlice';
import { DecodedToken } from '@/types/auth.types';
import { logoutUser } from '@/components/Authentication/logoutUser';

export function UserNav({ user }: { user: DecodedToken }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      dispatch(logOut());
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.log(err);
      toast.error('Logout failed', { duration: 2000 });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            {/* <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} /> */}
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">
              {user?.name || 'User Name'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email|| 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
