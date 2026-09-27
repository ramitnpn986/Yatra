"use client";

/**
 * Sidebar layout for the passenger account section (/customer/*).
 * Deliberately does NOT wrap /dashboard — that stays map-only,
 * per the requirement that the main dashboard has no extra features.
 * Mirrors admin/dashboard/layout.tsx's structure/behavior (mobile
 * hamburger, overlay, active-link highlighting, logout), styled with
 * the passenger side's existing blue accent instead of admin's dark theme.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { UserCircle, Lock, LogOut, Menu, X } from "lucide-react";

const navItems = [
    {
        label: "Profile",
        href: "/customer/profile",
        icon: UserCircle,
    },
    {
        label: "Password",
        href: "/customer/profile/password-change",
        icon: Lock,
    },
];

export default function CustomerAccountLayout({
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
                router.push("/login");
                router.refresh();
            } else {
                console.error(data.message || "Logout failed");
            }
        } catch (err) {
            console.log(err || "Logout failed");
        }
    };

    const handleNavigation = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:hidden">
                <div className="text-lg font-semibold text-gray-900">My Account</div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </header>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex min-h-screen w-64 flex-col bg-white p-4 text-slate-700 border-r border-slate-200 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="mb-6 flex items-center justify-between px-2 pb-6">
                    <div className="text-lg font-semibold text-slate-900">My Account</div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 md:hidden"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/customer/profile" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={handleNavigation}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-blue-50 font-semibold text-blue-700"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                    <LogOut size={18} />
                    <span>Log out</span>
                </button>
            </aside>

            <main className="min-h-screen pt-20 md:ml-64 md:pt-0">
                <div className="p-4 sm:p-5 md:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}