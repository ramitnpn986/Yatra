"use client";

import {
    Bell,
    CalendarDays,
    Car,
    ChevronRight,
    Clock3,
    LayoutDashboard,
    Lock,
    LogOut,
    MapPin,
    Menu,
    Settings,
    ShieldCheck,
    User,
    X,
    History,
} from "lucide-react";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import React, { ReactNode } from "react";

import RideNotificationListener from "@/components/notifications/RideNotificationListener";

interface LayoutProps {
    children: ReactNode;
}

type TransporterRole = "rider" | "booking-partner";

interface Transporter {
    _id: string;
    name: string;
    phone?: string;
    transporterRole: TransporterRole;
    isVerified?: boolean;
    isKycCompleted?: boolean;
    verificationStatus?: "pending" | "approved" | "rejected";
}

interface NavItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
}

const PROFILE_API = "/api/transporter/profile";

export default function Page({ children }: LayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [transporter, setTransporter] = useState<Transporter | null>(null);

    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const loadTransporter = async () => {
            try {
                setLoading(true);

                const res = await fetch(PROFILE_API, {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error("Failed to load transporter");
                }

                const data = await res.json();

                setTransporter(data.transporter);
            } catch (error) {
                console.error(
                    "Failed to load transporter:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadTransporter();
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            router.push("/transporter/login");
        }
    };

    const commonNav: NavItem[] = [
        {
            icon: <User size={18} />,
            label: "Profile",
            path: "/transporter/profile",
        },
        {
            icon: <LayoutDashboard size={18} />,
            label: "Dashboard",
            path: "/transporter/profile/dashboard",
        },
        {
            icon: <MapPin size={18} />,
            label: "Base Location",
            path: "/transporter/profile/base-location",
        },
        {
            icon: <Settings size={18} />,
            label: "Profile Settings",
            path: "/transporter/profile/update",
        },
        {
            icon: <Bell size={18} />,
            label: "Notifications",
            path: "/transporter/profile/notification",
        },
        {
            icon: <ShieldCheck size={18} />,
            label: "Verification / KYC",
            path: "/transporter/profile/kyc-section",
        },
        {
            icon: <Lock size={18} />,
            label: "Security",
            path: "/transporter/profile/password-change",
        },
    ];

    const riderNav: NavItem[] = [
        {
            icon: <Car size={18} />,
            label: "Ride Requests",
            path: "/transporter/profile/ride-requests",
        },
        {
            icon: <MapPin size={18} />,
            label: "Active Ride",
            path: "/transporter/profile/rides/active",
        },
        {
            icon: <History size={18} />,
            label: "Ride History",
            path: "/transporter/profile/rides/history",
        },
    ];

    const bookingPartnerNav: NavItem[] = [
        {
            icon: <Car size={18} />,
            label: "My Vehicles",
            path: "/transporter/profile/vehicles",
        },
        {
            icon: <CalendarDays size={18} />,
            label: "Rental Requests",
            path: "/transporter/profile/rental-requests",
        },
        {
            icon: <Clock3 size={18} />,
            label: "Active Rentals",
            path: "/transporter/profile/rentals/active",
        },
        {
            icon: <History size={18} />,
            label: "Rental History",
            path: "/transporter/profile/rentals/history",
        },
    ];

    const roleNav = transporter?.transporterRole === "rider"
        ? riderNav
        : transporter?.transporterRole === "booking-partner" ? bookingPartnerNav : [];

    const navItems = [...commonNav, ...roleNav];

    const isActive = (path: string) => {
        if (pathname === path) return true;

        if (path !== "/transporter/profile" && pathname.startsWith(`${path}/`)) {
            return true;
        }

        return false;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#0F172A] px-4 lg:hidden">
                <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-white hover:bg-white/10">
                    <Menu size={23} />
                </button>

                <Image
                    src="/yatralogo.png"
                    alt="Yatra"
                    width={58}
                    height={20}
                    priority
                    className="object-contain rounded-full"
                />

                <button onClick={() => router.push("/transporter/profile/notification")} className="relative rounded-lg p-2 text-white hover:bg-white/10">
                    <Bell size={21} />
                </button>
            </header>

   
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
            )}


            <aside className={` fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#0F172A] p-5
                transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center px-2">
                        <Image
                            src="/yatralogo.png"
                            alt="Yatra"
                            width={60}
                            height={15}
                            priority
                            className="object-contain rounded-full"
                        />
                    </div>

                    <button onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-5 rounded-2xl bg-[#14233A] p-2 px-4">
                    {loading ? (
                        <div className="space-y-2">
                            <div className="h-4 w-28 animate-pulse rounded bg-slate-700" />
                            <div className="h-3 w-20 animate-pulse rounded bg-slate-700" />
                        </div>
                    ) : (
                        <>
                            <p className="truncate text-sm font-bold text-white">
                                {transporter?.name || "Transporter"}
                            </p>

                            <div className="mt-2 flex items-center gap-1">
                                <span className="text-xs capitalize text-slate-400">
                                    {transporter?.transporterRole === "booking-partner" ? "Booking Partner" : "Rider"}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-6 flex-1 overflow-y-auto pr-1">
           
                    <div className="space-y-1.5">
                        {loading ? (
                            <>
                                {[1, 2, 3, 4, 5].map(
                                    (item) => (
                                        <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-800" />
                                    )
                                )}
                            </>
                        ) : (
                            navItems.map((item) => (
                                <NavButton
                                    key={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => router.push(item.path)}
                                    active={isActive(item.path)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {!loading && transporter && (
                    <div className="mb-4 rounded bg-[#14233A] p-3 mt-4">
                        <div className="flex items-center gap-2">
                       
                            <span className="text-xs  text-slate-300">
                                {transporter.transporterRole === "rider" ? "Ride Service Provider" : "Vehicle Rental Partner"}
                            </span>
                        </div>
                    </div>
                )}

                <button onClick={handleLogout}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[#b0aeae] transition-all hover:bg-[#0b2c54] hover:text-white"
                >
                    <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        <span className="text-sm font-bold"> Logout </span>
                    </div>
                </button>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                <main className="min-h-screen p-4 py-6 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <RideNotificationListener />
        </div>
    );
}

const NavButton = ({  icon,  label,  onClick,  active = false}: NavButtonProps) => {
    return (
        <button onClick={onClick} className={`group flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${active? "bg-[#ee8d39] text-white shadow-lg shadow-orange-900/20": "text-[#b0aeae] hover:bg-[#0b2c54] hover:text-white" }`}
        >
            <div className="flex items-center gap-3">
                <span className={active ? "text-white" : "text-[#b0aeae] group-hover:text-white"}>
                    {icon}
                </span>
                <span className="text-sm font-bold"> {label} </span>
            </div>

            {active && <ChevronRight size={15} />}
        </button>
    );
};