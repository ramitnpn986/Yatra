
"use client";

import {
    Phone,
    CalendarDays,
    ShieldCheck,
    Pencil,
    LockKeyhole,
    UserRound,
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
        <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-600">
                        Admin Profile
                    </h1>
                </div>

                {message && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {message}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


                    <div className="relative px-6 pb-6 sm:px-8">

                        <div className="flex flex-col gap-5 sm:flex-row justify-between sm:items-end">

                            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-5">

                         
                                <div className="shrink-0">
                                    <div className="rounded-full border-4 border-white bg-white shadow-lg">
                                        <Image
                                            src={admin?.profileImage?.url || "/user.avif"}
                                            alt="Admin Profile"
                                            width={128}
                                            height={128}
                                            className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                                        />
                                    </div>
                                </div>

                         
                                <div className="flex-1 pb-1 text-center sm:text-left">
                                    <h2 className="text-2xl font-bold capitalize text-gray-900 sm:text-3xl">
                                        {admin?.name || "Loading..."}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Yatra Administrator
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 pb-1">
                                <button type="button"
                                    onClick={() => router.push("/admin/dashboard/profile/update")}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    Edit Profile
                                </button>

                                <button type="button"
                                    onClick={() => router.push("/admin/dashboard/profile/password-change")}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    Security
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">

                        <div className="mb-5">
                            <h3 className="text-base font-semibold text-gray-900">  Account Information </h3>
                            <p className="mt-1 text-sm text-gray-500">  Your administrator account details. </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                            <div className=" rounded-xl  bg-[#eee8e8] p-5  text-black ">
                                <div className="flex flex-col items-start gap-1 ">
                                    <p className="text-xs font-semibold">  Phone Number  </p>
                                    <p className="mt-1 truncate text-sm font-semibold text-[#534c4c]">  {admin?.phone || "Not Available"} </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-[#eee8e8] p-5 text-black">
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-xs font-semibold">Member Since</p>
                                    <p className="mt-1 truncate text-sm font-semibold text-[#534c4c]">
                                        {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )
                                            : "Not Available"}
                                    </p>

                                </div>
                            </div>

                            <div className="rounded-xl bg-[#eee8e8] p-5 text-black">
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-xs font-semibold"> Role </p>
                                    <p className="mt-1 text-sm font-semibold text-[#534c4c]"> Administrator </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
