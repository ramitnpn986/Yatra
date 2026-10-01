"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const res = await fetch(`/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    phone,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message || "login failed");
                return;
            }

            router.push("/admin/dashboard");
            router.refresh();
        } catch (err) {
            console.log("Error at login logic :", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
            <div className="w-full max-w-md">
                <div className="mb-6 flex justify-center">
                    <Image
                        src="/yatralogo.png"
                        alt="Yatra"
                        width={150}
                        height={55}
                        className="h-auto w-30 object-contain"
                    />
                </div>

                <form onSubmit={handleLogin}   className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-7 text-white sm:px-8">
                        <h1 className="text-2xl font-black text-[#ee8d39]">  Admin Login </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Sign in to manage customers, providers, and rides.
                        </p>
                    </div>

                    <div className="space-y-5 p-6 sm:p-8">
                        <div>
                            <label  htmlFor="phone"  className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Phone Number
                            </label>

                            <div className="relative">
                           
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-5 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-5 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#0F172A] py-3.5 font-bold text-white shadow-sm transition hover:bg-[#0b2c54] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">  Yatra Admin Panel </p>
            </div>
        </div>
    );
}