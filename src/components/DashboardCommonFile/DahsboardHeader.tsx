"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { toggleSidebar } from "../Redux/Slice/sidebarSlice";
import { Menu, Power } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logOut, useCurrentUserInfo } from "../Redux/Slice/authSlice";
import { logoutUser } from "../Authentication/logoutUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUserInfo);
  const router = useRouter();

  const handleLogOutUser = () => {
    logoutUser(router);
    dispatch(logOut());
    toast.success("Logged Out Successfully");
  };

  return (
    <div>
      <div className="bg-gray-100 rounded-md py-2 px-4 flex items-center justify-between">
        <button onClick={() => dispatch(toggleSidebar())}>
          <Menu size={20} />
        </button>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className=" cursor-pointer">
                <AvatarImage
                  src="https://cdn-icons-png.flaticon.com/128/1144/1144709.png"
                  sizes="md"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mr-4 border-none p-2">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Edit Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Setting Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogOutUser}
                  className=" bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  Log out
                  <DropdownMenuShortcut>
                    <Power size={20} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
