"use client";
import DashboardHeader from "@/components/DashboardCommonFile/DahsboardHeader";
import {
  dashboardRoutes,
  DashboardRole,
} from "@/components/DashboardCommonFile/DashboardRoutes";
import DashboardSidebar from "@/components/DashboardCommonFile/DashboardSidebar";
import { useAppDispatch } from "@/components/Redux/hooks";
import { setUserInfo } from "@/components/Redux/Slice/authSlice";
import { RootState } from "@/components/Redux/store";
import React from "react";
import { useSelector } from "react-redux";

type DashboardLayoutProps = {
  children: React.ReactNode;
  admin?: React.ReactNode;
  owner?: React.ReactNode;
  customer?: React.ReactNode;
};

const DashboardLayout = ({
  children,
  admin,
  owner,
  customer,
}: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const userCategory = useSelector(
    (state: RootState) => state.auth.userInfo?.category
  );

  const normalizedCategory = userCategory?.toLowerCase() as DashboardRole | undefined;

  const roleContentMap: Record<string, React.ReactNode | undefined> = {
    admin,
    owner,
    customer,
  };

  const activeRoleContent =
    (normalizedCategory && roleContentMap[normalizedCategory]) || children;

  const visibleRoutes = dashboardRoutes.filter((route) =>
    normalizedCategory ? route.roles.includes(normalizedCategory) : true
  );

  const roles = ["admin", "owner", "customer"] as const;

  const handleRoleChange = (role: (typeof roles)[number]) => {
    dispatch(
      setUserInfo({
        email: userInfo?.email ?? "debug@example.com",
        name: userInfo?.name ?? "Debug User",
        category: role,
        email_verified: userInfo?.email_verified ?? true,
      })
    );
  };

  return (
    <div className="flex bg-white w-full min-h-screen gap-1 p-1">
      <div
        className={`bg-gray-100 space-y-2 rounded-md shadow-md transition-all duration-300${
          isSidebarOpen ? " w-60 px-4 py-3 " : "w-14 px-1 py-2"
        }`}
      >
        {visibleRoutes.map((route) => (
          <DashboardSidebar
            key={route.href}
            href={route.href}
            icon={route.icon}
            label={route.label}
            isCollapsed={isSidebarOpen}
          />
        ))}
      </div>
      <main className="flex flex-col w-full h-full transition-all duration-300">
        <DashboardHeader />
        {process.env.NODE_ENV !== "production" && (
          <div className="m-3 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium text-amber-900">
              Debug role switcher (dev only)
            </p>
            <p className="mt-1 text-xs text-amber-800">
              Current category: {normalizedCategory || "none"}
            </p>
            <div className="mt-2 flex gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    normalizedCategory === role
                      ? "bg-amber-600 text-white"
                      : "bg-white text-amber-800 border border-amber-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeRoleContent}
      </main>
    </div>
  );
};

export default DashboardLayout;
