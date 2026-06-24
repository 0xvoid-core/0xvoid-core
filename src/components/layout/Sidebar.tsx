"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  HardHat,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Daily Report", href: "/report", icon: FileText },
  { name: "Attendance", href: "/attendance", icon: Users },
  { name: "Labour Counter", href: "/labour", icon: HardHat },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <HardHat className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-gray-900">BuildDash</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar component */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6 lg:py-8 border-b border-slate-800">
          <div className="bg-blue-500 p-2 rounded-lg">
            <HardHat className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BuildDash</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-400" : "text-slate-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium">
              U
            </div>
            <span>Admin User</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
