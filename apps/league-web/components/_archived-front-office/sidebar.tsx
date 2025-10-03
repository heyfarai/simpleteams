"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Home, Settings, Users } from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/front-office",
    icon: Home,
  },
  {
    name: "Games",
    href: "/front-office/games",
    icon: Calendar,
  },
  {
    name: "Teams",
    href: "/front-office/teams",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/front-office/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-lg font-semibold text-gray-900">League Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/front-office" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          Janky Admin v1.0
        </div>
      </div>
    </div>
  );
}