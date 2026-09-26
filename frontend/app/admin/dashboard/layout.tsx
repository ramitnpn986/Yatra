"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  UserCircle,
  LogOut,
  Lock,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Providers",
    href: "/admin/dashboard/providers",
    icon: Truck,
  },
  {
    label: "Customers",
    href: "/admin/dashboard/customers",
    icon: Users,
  },
  {
    label: "Rides",
    href: "#",
    icon: Route,
    disabled: true,
  },
  {
    label: "Profile",
    href: "/admin/dashboard/profile",
    icon: UserCircle,
  },
  {
    label: "Password",
    href: "/admin/dashboard/profile/password-change",
    icon: Lock,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/login");
        router.refresh();
      } else {
        console.error(data.message || "Logout failed");
      }
    } catch (err) {
      console.log(err || "Logout failed");
    }
  };

  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:hidden">
        <div className="text-lg font-semibold text-gray-900">
          Yatra Admin
        </div>

        <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100" aria-label="Open menu">
          <Menu size={24} />
        </button>
      </header>

  
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      <aside className={`fixed left-0 top-0 z-50 flex min-h-screen w-64 flex-col bg-[#161717] p-4 text-white transition-transform duration-300 ease-in-out
           ${ sidebarOpen? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mb-6 flex items-center justify-between px-2 pb-6">
          <div className="text-lg font-semibold text-white">
            Yatra Admin
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =  pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link key={item.label} href={item.disabled ? "#" : item.href} onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  handleNavigation();
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${ item.disabled
                    ? "cursor-not-allowed text-gray-500"
                    : isActive ? "bg-white/10 font-semibold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-xs text-gray-500"> soon </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white">
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="min-h-screen pt-20 md:ml-64 md:pt-0">
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}