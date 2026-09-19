"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const router=  useRouter();

     const handleRegister = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const res = await fetch(`/api/passenger/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    password,
                })
            })

            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return
            }

            router.push("/login")

        } catch (err) {
            console.log("Error at login logic :", err)
        }
    }

    return (

        <div className="flex min-h-screen items-center justify-center bg-white">
            <form
                onSubmit= {handleRegister}
                className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg md:w-1/2 lg:w-1/3">
                <Image src="/logo.png" alt="Yatra" width={100} height={35} className="mx-auto mb-2"
                />
                <h1 className="text-xl font-semibold text-primary"> Register</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=" border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400"
                />
                <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className=" border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=" border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition w-full"
                >
                    Register
                </button>
                <p className="text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link href="/en/login" className="text-primary font-semibold">
                        Login
                    </Link>
                </p>

            </form>
        </div>
    );
}