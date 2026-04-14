import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const DashboardSidebar = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`p-2 rounded-md flex items-center gap-2 cursor-pointer transition-all duration-300 ${
        isActive ? " bg-[#c48200] text-white" : " bg-white text-slate-800"
      } ${isCollapsed ? "justify-start" : "justify-center"}`}
    >
      <Icon size={20} className="" />
      {isCollapsed && <span className="text-base font-medium">{label}</span>}
    </Link>
  );
};

export default DashboardSidebar;
