"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("rider");
    const [submitting, setSubmitting] = useState(false);

    const [err_name, setNameError] = useState("");
    const [err_phone, setPhoneError] = useState("");
    const [err_password, setPasswordError] = useState("");
    const [err_role, setRoleError] = useState("");


    const router = useRouter();

    const validation = () => {
        let isValid = true;

        const trimmedName = name.trim();

        if (!trimmedName) {
            setNameError("Name is required");
            isValid = false;
        } else if (trimmedName.length < 3) {
            setNameError("Name must contain at least 3 characters");
            isValid = false;
        } else if (trimmedName.length > 50) {
            setNameError("Name must not exceed 50 characters");
            isValid = false;
        } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(trimmedName)) {
            setNameError("Name must contain letters only");
            isValid = false;
        } else {
            setNameError("");
        }

        const trimmedPhone = phone.trim();

        if (!trimmedPhone) {
            setPhoneError("Phone number is required");
            isValid = false;
        } else if (!/^9\d{9}$/.test(trimmedPhone)) {
            setPhoneError("Enter a valid 10-digit Nepali mobile number");
            isValid = false;
        } else {
            setPhoneError("");
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one capital letter");
            isValid = false;
        } else if (!/\d/.test(password)) {
            setPasswordError("Password must contain at least one digit");
            isValid = false;
        } else if (!/[^a-zA-Z0-9\s]/.test(password)) {
            setPasswordError("Password must contain at least one special symbol");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!role) {
            setRoleError("Please select a role")
        } else if (!["rider", "booking-partner"].includes(role)) {
            setRoleError("Please select a valid role")
        }

        return isValid;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validation()) return;
        setSubmitting(true);

        try {
            const res = await fetch(`/api/transporter/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    password,
                    role
                })
            })

            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
                return;
            }
            console.log("register success: ", data);
            router.push("/transporter/login")

        } catch (err) {
            console.log("Error at login logic :", err)
        } finally {
            setSubmitting(false);
        }
    }

    return (

        <div className="flex min-h-screen items-center justify-center bg-[#0a1f39]">
            <form onSubmit={handleRegister}

                className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg md:w-1/2 lg:w-1/3">
                <Image src="/yatralogo.png" alt="Yatra" width={100} height={35} className="mx-auto mb-2"
                />
                <h1 className="text-xl font-semibold text-[#d86d0e]"> Register</h1>

                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className=" border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400 w-full"
                    />
                    {err_name && <p className="mt-1 text-sm text-red-400">{err_name}</p>}
                </div>

                <div>
                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="  border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400 w-full"
                    />
                    {err_phone && <p className="mt-1 text-sm text-red-400">{err_phone}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="  border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400 w-full"
                    />
                    {err_password && <p className="mt-1 text-sm text-red-400">{err_password}</p>}
                </div>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className=" w-full border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 ">
                    <option value="rider">Rider</option>
                    <option value="booking-partner">Booking Partner</option>
                </select>

                {err_role && <p className="mt-1 text-sm text-red-400">{err_role}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition w-full disabled:opacity-60"
                >
                    {submitting ? "Registering..." : "Register"}
                </button>
                <p className="text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link href="/transporter/login" className="text-primary font-semibold">
                        Login
                    </Link>
                </p>

            </form>
        </div>
    );
}