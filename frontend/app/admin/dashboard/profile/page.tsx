"use client";

import { Phone, Calendar, Edit3 } from "lucide-react";
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
        <div className="min-h-screen text-[#0A0A0A] bg-gray-100 pb-12 pt-6">
            <div className="max-w-5xl mx-auto px-4 flex justify-start items-center">

                <div className="bg-[#ffffff] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl w-full">
                    <div className="p-8 pb-10">

                        {message && (
                            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                {message}
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <Image
                                src={admin?.profileImage?.url || "/user.avif"}
                                alt="Admin Profile"
                                width={160}
                                height={160}
                                className="w-40 h-40 rounded-[2rem] object-cover shadow"
                            />

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold uppercase">
                                    {admin?.name || "Loading..."}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/dashboard/profile/update")}
                                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl text-sm font-semibold hover:bg-orange-600 transition"
                                >
                                    <Edit3 size={14} />
                                    Edit Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/dashboard/profile/password-change")}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    <Edit3 size={14} />
                                    Update Credentials
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/2 border border-white/5">
                                <Phone size={20} className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                                    <p className="text-sm font-bold text-gray-600">
                                        {admin?.phone || "Not Available"}
                                    </p>
                                </div>
                            </div>

                            {admin?.createdAt && (
                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/2 border border-white/5">
                                    <Calendar size={20} className="text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Enlisted Since</p>
                                        <p className="text-sm font-bold text-gray-600">
                                            {new Date(admin.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;