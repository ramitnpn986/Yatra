"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PassengerData {
    name: string;
    phone: string;
    createdAt?: string;
    profileImage?: {
        url?: string;
    };
}

const CustomerProfile = () => {
    const router = useRouter();

    const [passenger, setPassenger] = useState<PassengerData | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
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
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                        Profile
                    </h1>
                </div>

                {message && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {message}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-7 sm:px-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col items-center gap-4 sm:flex-row">
                                <div className="shrink-0">
                                    <div className="rounded-full border-4 border-white bg-white shadow-lg">
                                        <Image
                                            src={
                                                passenger?.profileImage?.url ||
                                                "/user.avif"
                                            }
                                            alt="Profile"
                                            width={128}
                                            height={128}
                                            className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                                        />
                                    </div>
                                </div>

                                <div className="text-center sm:text-left">
                                    <p className="mb-1 text-sm font-medium text-slate-300">
                                        Passenger Profile
                                    </p>

                                    <h2 className="text-2xl font-bold capitalize text-white sm:text-3xl">
                                        {passenger?.name || "Loading..."}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/customer/profile/edit")
                                    }
                                    className="rounded-xl bg-[#ee8d39] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#EA7D24]"
                                >
                                    Edit Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/customer/profile/password-change"
                                        )
                                    }
                                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-slate-100"
                                >
                                    Security
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Phone Number
                                </p>

                                <p className="mt-2 truncate text-base font-semibold text-[#0F172A]">
                                    {passenger?.phone || "Not Available"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Member Since
                                </p>

                                <p className="mt-2 truncate text-base font-semibold text-[#0F172A]">
                                    {passenger?.createdAt
                                        ? new Date(
                                              passenger.createdAt
                                          ).toLocaleDateString("en-US", {
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "Not Available"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;