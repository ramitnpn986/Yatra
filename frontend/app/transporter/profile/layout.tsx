"use client";

import {
    Bell,
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
import Image from "next/image";

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
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
            <aside className="flex w-full flex-col gap-8 border-r border-white/10 bg-[#0F172A] p-6 lg:sticky lg:top-0 lg:h-screen lg:w-60">
                <div className="flex items-center px-2">
                    <Image
                        src="/yatralogo.png"
                        alt="Yatra"
                        width={120}
                        height={40}
                        priority
                        className="h-auto w-auto object-contain"
                    />
                </div>

                <div className="flex flex-1 flex-col gap-2">
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

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[#b0aeae] transition-all hover:bg-[#0b2c54] hover:text-white"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold">Logout</span>
                </button>
            </aside>

            <main className="flex-1 p-4 py-8">{children}</main>
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
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all ${
            active
                ? "bg-[#ee8d39] text-white shadow-sm"
                : "text-[#b0aeae] hover:bg-[#0b2c54] hover:text-white"
        }`}
    >
        <div className="flex items-center gap-3">
            <span className={active ? "text-white" : "text-[#b0aeae]"}>
                {icon}
            </span>

            <span className="text-sm font-bold">{label}</span>
        </div>
    </button>
);

export default Page;