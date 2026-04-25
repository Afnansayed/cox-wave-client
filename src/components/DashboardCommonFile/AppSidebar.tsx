'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Roles } from '@/constants/role.type';
    
import { GraduationCap } from 'lucide-react';
import { Route } from '@/types/route.type';
import { adminRoutes } from '@/routes/admin.routes';
import { ownerRoutes } from '@/routes/owner.routes';
import { customerRoutes } from '@/routes/customer.routes';
import Image from 'next/image';



export function AppSidebar({ user, ...props }: any) {
  const pathname = usePathname();

  const routesMap: Record<string, Route[]> = {
    [Roles.admin]: adminRoutes,
    [Roles.customer]: customerRoutes,
    [Roles.owner]: ownerRoutes,
  };

  const activeRoutes = routesMap[user.role] || [];

  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      {/* Sidebar Header: Logo Section */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent focus:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl shadow-lg shadow-primary/20 text-primary-foreground">
                  <Image src="/cox-wave-icon.png" alt="CoxWave Logo" width={100} height={100} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-lg tracking-tight text-primary">
                    CoxWave
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Platform v1.0
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        {activeRoutes.map((group, index) => (
          <SidebarGroup key={group.title + index} className="py-0">
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className={`
                          relative flex h-11 items-center gap-3 px-3 transition-all duration-200
                          ${
                            isActive
                              ? 'bg-primary/10 text-primary font-semibold before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-1 before:rounded-r-full before:bg-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }
                        `}
                      >
                        <Link href={item.url}>
                          {item.icon && (
                            <item.icon
                              className={`size-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'opacity-70'}`}
                            />
                          )}
                          <span className="truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
