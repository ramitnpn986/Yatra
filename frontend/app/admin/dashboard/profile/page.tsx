"use client";

import {
    Phone,
    CalendarDays,
    ShieldCheck,
    Pencil,
    LockKeyhole,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdminData {
    name: string;
    phone: string;
    createdAt?: string;
    profileImage?: {
        url?: string;
    };
}

const AdminProfile = () => {
    const router = useRouter();

    const [admin, setAdmin] = useState<AdminData | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/admin/profile", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok) {
                    setAdmin(data.admin);
                } else {
                    setMessage(data.message || "Unable to load profile");
                }
            } catch (err) {
                console.error("Failed to fetch admin profile:", err);
                setMessage("Unable to connect to backend");
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="min-h-full bg-slate-50">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
                        Account
                    </p>

                    <h1 className="text-3xl font-black text-[#0F172A]">
                        Admin Profile
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your administrator account information and security.
                    </p>
                </div>

                {message && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {message}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-7 text-white sm:px-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left">
                                <div className="shrink-0">
                                    <div className="rounded-full border-4 border-white/10 bg-white/10 p-1">
                                        <Image
                                            src={admin?.profileImage?.url || "/user.avif"}
                                            alt="Admin Profile"
                                            width={128}
                                            height={128}
                                            className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                                        />
                                    </div>
                                </div>

                                <div className="text-center sm:text-left">
                            
                                    <h2 className="text-2xl font-black capitalize sm:text-3xl">
                                        {admin?.name || "Loading..."}
                                    </h2>

                                    <p className="mt-1 text-sm text-[#ee8d39]">
                                        Yatra Administrator
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/admin/dashboard/profile/update")
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ee8d39] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#EA7C28]"
                                >
                                    <Pencil size={16} />
                                    Edit Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/admin/dashboard/profile/password-change"
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2c54]"
                                >
                                    <LockKeyhole size={16} />
                                    Security
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-black text-[#0F172A]">
                                Account Information
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Your administrator account details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A] text-white">
                                    <Phone size={18} />
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Phone Number
                                </p>

                                <p className="mt-2 truncate text-sm font-bold text-slate-800">
                                    {admin?.phone || "Not Available"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A] text-white">
                                    <CalendarDays size={18} />
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Member Since
                                </p>

                                <p className="mt-2 truncate text-sm font-bold text-slate-800">
                                    {admin?.createdAt
                                        ? new Date(admin.createdAt).toLocaleDateString(
                                              "en-US",
                                              {
                                                  month: "long",
                                                  year: "numeric",
                                              }
                                          )
                                        : "Not Available"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A] text-white">
                                    <ShieldCheck size={18} />
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Role
                                </p>

                                <p className="mt-2 text-sm font-bold text-slate-800">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;