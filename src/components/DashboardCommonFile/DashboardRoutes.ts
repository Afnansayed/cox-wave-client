import { BookCheck, LayoutDashboard, Plus, Users } from "lucide-react";

export type DashboardRole = "admin" | "owner" | "customer";

export type DashboardRoute = {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  roles: DashboardRole[];
};

export const dashboardRoutes: DashboardRoute[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["admin", "owner", "customer"],
  },
  {
    href: "/dashboard/admin/account",
    icon: BookCheck,
    label: "Admin Account",
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/bookings",
    icon: BookCheck,
    label: "Bookings",
    roles: ["admin"],
  },
  {
    href: "/dashboard/owner/account",
    icon: Users,
    label: "Owner Account",
    roles: ["owner"],
  },
  {
    href: "/dashboard/customer/account",
    icon: Plus,
    label: "Customer Account",
    roles: ["customer"],
  },
];
