"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    UserCircle,
    HomeIcon,
    LogOut,
    Menu,
    X,
    Lock,
    ClipboardList,
    CarFront,
} from "lucide-react";

const navItems = [
    {
        label: "Home",
        href: "/dashboard",
        icon: HomeIcon,
        isActive: (p: string) => p === "/dashboard",
    },
    {
        label: "Profile",
        href: "/customer/profile",
        icon: UserCircle,
        isActive: (p: string) =>
            p === "/customer/profile" ||
            p === "/customer/profile/update",
    },
    {
        label: "Password",
        href: "/customer/profile/password-change",
        icon: Lock,
        isActive: (p: string) =>
            p.startsWith("/customer/profile/password-change"),
    },
    {
        label: "Ride Requests",
        href: "/customer/ride-requests",
        icon: ClipboardList,
        isActive: (p: string) =>
            p.startsWith("/customer/ride-requests"),
    },
    {
        label: "Rides",
        href: "/customer/rides",
        icon: CarFront,
        isActive: (p: string) =>
            p.startsWith("/customer/rides"),
    },
];

export default function CustomerShell({
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
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 md:flex-row">
            <header className="fixed left-0 right-0 top-0 z-[1100] flex h-16 items-center justify-between border-b border-white/10 bg-[#0F172A] px-4 shadow-sm md:hidden">
                <Image
                    src="/yatralogo.png"
                    alt="Yatra"
                    width={120}
                    height={40}
                    priority
                    className="h-auto w-auto object-contain"
                />

                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-xl p-2 text-white transition hover:bg-[#0b2c54]"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </header>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[1100] bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-[1200] flex min-h-screen w-60 flex-col gap-8 bg-[#0F172A] p-6 text-white shadow-xl transition-transform duration-300 ease-in-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                } md:sticky md:translate-x-0`}
            >
                <div className="flex items-center justify-between px-2">
                    <Image
                        src="/yatralogo.png"
                        alt="Yatra"
                        width={120}
                        height={40}
                        priority
                        className="h-auto w-auto object-contain"
                    />

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl p-2 text-[#b0aeae] transition hover:bg-[#0b2c54] hover:text-white md:hidden"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = item.isActive(pathname);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                                    active
                                        ? "bg-[#ee8d39] text-white shadow-sm"
                                        : "text-[#b0aeae] hover:bg-[#0b2c54] hover:text-white"
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
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[#b0aeae] transition-all hover:bg-[#0b2c54] hover:text-white"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold">Logout</span>
                </button>
            </aside>

            <main className="min-h-screen flex-1 pt-20 md:pt-0">
                <div className="p-4 py-8 sm:p-5 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}