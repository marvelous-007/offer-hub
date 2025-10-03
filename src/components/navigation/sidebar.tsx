/**
 * @fileoverview Sidebar navigation component for application layout
 * @author Offer Hub Team
 */

"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Activity,
  FileText,
  LogOut,
  X,
} from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/common/icon-button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname.includes("/dashboard"),
    },
    {
      name: "User management",
      href: "/user-management",
      icon: Plus,
      active: pathname.includes("/user-management"),
    },
    {
      name: "Platform monitoring",
      href: "/platform-monitoring",
      icon: Activity,
      active: pathname.includes("/platform-monitoring"),
    },
    {
      name: "Dispute resolution",
      href: "/dispute-resolution",
      icon: FileText,
      active: pathname.includes("/dispute-resolution") && !pathname.includes("resolved"),
    },
    {
      name: "Resolved dispute",
      href: "/dispute-resolution?tab=resolved",
      icon: FileText,
      active: pathname.includes("/dispute-resolution") && pathname.includes("resolved"),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r w-64">
      {onClose && (
        <div className="md:hidden flex justify-end p-2">
          <IconButton
            icon={X}
            onClick={onClose}
            iconSize="sm"
            iconVariant="muted"
            aria-label="Close sidebar"
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
      )}

      <nav className="flex-grow overflow-y-auto pt-4 ">
        <ul className="space-y-2 px-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  item.active
                    ? " text-[#149A9B] hover:bg-gray-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.icon && (
                  <Icon
                    icon={item.icon}
                    className="mr-3"
                    size="default"
                    variant={item.active ? "primary" : "muted"}
                    aria-hidden="true"
                  />
                )}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t sticky bottom-0 bg-white">
        <Link
          href="/logout"
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
        >
          <Icon
            icon={LogOut}
            className="mr-2"
            size="default"
            variant="destructive"
          />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}
