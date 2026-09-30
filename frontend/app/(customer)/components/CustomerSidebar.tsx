"use client";

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
import Image from "next/image";

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
        <div className="min-h-screen bg-[#f5f7fa]">
            <header className="fixed left-0 right-0 top-0 z-[1100] flex h-16 items-center justify-between border-b border-[#0b2c54]/10 bg-[#0a1f39] px-4 shadow-sm md:hidden">
                <div className="text-lg font-semibold text-[#ee8d39]">
                    <Image
                        src="/yatralogo.png"
                        alt="Yatra"
                        width={100}
                        height={40}
                        className="h-auto w-20 rounded-full sm:w-24 md:w-22 lg:w-22 "
                    />
                </div>

                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-lg p-2 text-white transition hover:bg-[#0b2c54]"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </header>

            {sidebarOpen && (
                <div className="fixed inset-0 z-[1100] bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}


            <aside
                className={`fixed left-0 top-0 z-[1200] flex min-h-screen w-64 flex-col bg-[#0a1f39] p-4 text-white shadow-xl transition-transform duration-300 ease-in-out ${sidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    } md:translate-x-0`}
            >

                <div className="mb-6 flex items-center justify-between px-2 pb-6">
                    <div className="text-xl flex gap-2 items-end font-bold text-[#afaca9]">
                        <Image
                            src="/yatralogo.png"
                            alt="Yatra"
                            width={80}
                            height={10}
                            className="h-auto w-20 rounded-full sm:w-24 md:w-15 lg:w-15 "
                        />
                        <span className="text-sm">passenger</span>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-[#b0aeae] transition hover:bg-[#0b2c54] hover:text-white md:hidden"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = item.isActive(pathname);

                        return (
                            <Link key={item.label} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${active
                                ? "bg-[#ee8d39] font-semibold text-white shadow-sm"
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
                    className="mt-auto flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#b0aeae] transition hover:bg-[#0b2c54] hover:text-white"
                >
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