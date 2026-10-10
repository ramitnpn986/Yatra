"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, CalendarDays, Loader2, Settings } from "lucide-react";

interface PassengerData {
    name: string;
    phone: string;
    createdAt?: string;
    profileImage?: {
        url?: string;
    };
}

export default function CustomerProfile() {
    const router = useRouter();

    const [passenger, setPassenger] = useState<PassengerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/passenger/profile", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok) {
                    setPassenger(data.customer);
                } else {
                    setMessage(data.message || "Unable to load profile");
                }
            } catch (err) {
                console.error("Failed to fetch passenger profile:", err);
                setMessage("Unable to connect to backend");
            } finally {
                setLoading(false);
            }
        };

        void fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[600px] w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0F172A]" />
                    <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6">
                
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#ee8d39]">Account</p>
                    <h1 className="text-xl font-black text-[#0F172A] sm:text-2xl">Passenger Profile</h1>
                </div>

      
                {message && ( <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm"> {message} </div>
                )}

      
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-8 text-white sm:px-10">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            
                            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-slate-800 shadow-xl sm:h-32 sm:w-32">
                                    <Image
                                        src={passenger?.profileImage?.url || "/user.avif"}
                                        alt={passenger?.name || "Passenger"}
                                        fill
                                        sizes="(max-width: 128px) 100vw, 128px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                <div className="text-center sm:text-left">
                                    <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold  text-[#ee8d39] mb-2">
                                       Verified 
                                    </div>
                                    <h2 className="text-2xl font-black capitalize tracking-tight text-white sm:text-3xl">
                                        {passenger?.name || "Passenger Account"}
                                    </h2>
                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                        Manage your personal information and account security
                                    </p>
                                </div>
                            </div>

                
                            <div className="flex flex-row items-center justify-center gap-3 sm:flex-col">
                                <button
                                    type="button"
                                    onClick={() => router.push("/customer/profile/edit")}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ee8d39] px-5 py-2.5 text-xs font-bold tracking-wider text-white shadow-sm transition hover:bg-[#d87d2b]"
                                >
                                    <Settings size={15} /> Edit Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.push("/customer/profile/password-change")}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold  tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
                                >
                                    Security
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="p-6 sm:p-10">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-slate-200">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F172A] shadow-sm">
                                    <Phone size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Phone Number
                                    </p>
                                    <p className="mt-1 truncate text-base font-bold text-slate-800">
                                        {passenger?.phone || "Not Provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-slate-200">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F172A] shadow-sm">
                                    <CalendarDays size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Member Since
                                    </p>
                                    <p className="mt-1 truncate text-base font-bold text-slate-800">
                                        {passenger?.createdAt
                                            ? new Date(passenger.createdAt).toLocaleDateString("en-US", {
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}