"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter()

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
                    password
                })
            })

            const data = await res.json();
            if (!res.ok) {
                console.log(data.message || "login failed");
                return
            }

            console.log("login success: ", data);
            router.push("/en/admin/dashboard");
            router.refresh();

        } catch (err) {
            console.log("Error at login logic :", err)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-2">
            <form onSubmit={handleLogin}
                className="flex  flex-col gap-4 border-2 border-gray-200 shadow-xl rounded-2xl p-8 w-100 bg-white">
                <Image src="/logo.png" alt="Yatra" width={100} height={35}
                    className="mx-auto mb-2" />
                <h1 className="text-xl font-semibold text-primary">Admin Login</h1>
                <input
                    type="text"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400"
                />
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60" >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}