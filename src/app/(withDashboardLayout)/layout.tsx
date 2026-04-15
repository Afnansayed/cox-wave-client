export const dynamic = 'force-dynamic';
import { AppSidebar } from '@/components/DashboardCommonFile/AppSidebar';
import { SidebarCloser } from '@/components/DashboardCommonFile/SidebarCloser';
import { UserNav } from '@/components/DashboardCommonFile/UserNav';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Roles } from '@/constants/role.type';
import { getCookie } from '@/lib/cookie.utils';
import { jwtUtils } from '@/lib/jwt.utils';
import { DecodedToken } from '@/types/auth.types';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  admin,
  owner,
  customer,
}: {
  admin: React.ReactNode;
  owner: React.ReactNode;
  customer: React.ReactNode;
}) {
 
  const accessToken =  await getCookie('accessToken');
  const userInfo: DecodedToken | null = jwtUtils.decodedToken(accessToken || '') as DecodedToken || null;



  if (!userInfo) redirect('/login');

  const content =
    {
      [Roles.admin]: admin,
      [Roles.customer]: customer,
      [Roles.owner]: owner,
    }[userInfo.role as string] || owner;

  return (
    <SidebarProvider>
      <SidebarCloser />
      <AppSidebar user={userInfo} />
      <SidebarInset>
        {/* Header Section */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-[1px] bg-border mx-2" />
            <h1 className="text-sm font-medium text-muted-foreground capitalize">
              {userInfo.role} Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <UserNav user={userInfo} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex flex-1 flex-col gap-4 p-2 md:p-6 bg-gray-100 dark:bg-transparent">
          {content}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
