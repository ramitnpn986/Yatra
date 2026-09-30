"use client";

import {
    Bell,
    Car,
    LayoutDashboard,
    Lock,
    LogOut,
    MapPin,
    Settings,
    ShieldCheck,
    User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
}

const Page = ({ children }: LayoutProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.log("Logout error:", err);
        } finally {
            router.push("/transporter/login");
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-60 bg-[#0a1f39] border-r border-white/10 p-6 flex flex-col gap-8 lg:h-screen lg:sticky lg:top-0">
                
                {/* Logo */}
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-[#ee8d39] p-2 rounded-xl text-white">
                        <Car size={24} />
                    </div>

                    <span className="font-black text-xl text-white">
                        Yatra
                    </span>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-2 flex-1">
                    <NavButton
                        onClick={() => router.push("/transporter/profile")}
                        icon={<User size={18} />}
                        label="Profile"
                        active={pathname === "/transporter/profile"}
                    />

                    <NavButton
                        onClick={() =>
                            router.push("/transporter/profile/dashboard")
                        }
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        active={
                            pathname === "/transporter/profile/dashboard"
                        }
                    />

                    <NavButton
                        onClick={() =>
                            router.push("/transporter/profile/base-location")
                        }
                        icon={<MapPin size={18} />}
                        label="Base Location"
                        active={
                            pathname === "/transporter/profile/base-location"
                        }
                    />

                    <NavButton
                        onClick={() =>
                            router.push("/transporter/profile/update")
                        }
                        icon={<Settings size={18} />}
                        label="Profile Settings"
                        active={
                            pathname === "/transporter/profile/update"
                        }
                    />

                    <NavButton
                        onClick={() =>
                            router.push("/transporter/profile/notification")
                        }
                        icon={<Bell size={18} />}
                        label="Notifications"
                        active={
                            pathname ===
                            "/transporter/profile/notification"
                        }
                    />

                    <NavButton
                        onClick={() =>
                            router.push("/transporter/profile/kyc-section")
                        }
                        icon={<ShieldCheck size={18} />}
                        label="Verification/KYC"
                        active={
                            pathname ===
                            "/transporter/profile/kyc-section"
                        }
                    />

                    <NavButton
                        onClick={() =>
                            router.push(
                                "/transporter/profile/password-change"
                            )
                        }
                        icon={<Lock size={18} />}
                        label="Security"
                        active={
                            pathname ===
                            "/transporter/profile/password-change"
                        }
                    />
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-[#b0aeae] hover:bg-[#0b2c54] hover:text-white transition-all"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 py-8">
                {children}
            </main>
        </div>
    );
};

const NavButton = ({
    icon,
    label,
    onClick,
    active = false,
}: NavButtonProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all ${
            active
                ? "bg-[#ee8d39] text-white shadow-sm"
                : "text-[#b0aeae] hover:bg-[#0b2c54] hover:text-white"
        }`}
    >
        <div className="flex items-center gap-3">
            <span
                className={
                    active
                        ? "text-white"
                        : "text-[#b0aeae]"
                }
            >
                {icon}
            </span>

            <span className="text-sm font-bold">
                {label}
            </span>
        </div>
    </button>
);

export default Page;