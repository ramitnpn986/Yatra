"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("passenger");

  const router = useRouter();


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const startTime = performance.now();

  try {
    console.log("1. Login request started");

    const res = await fetch("/api/transporter/login", {
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

    console.log(
      "2. Login response received:",
      `${(performance.now() - startTime).toFixed(0)}ms`
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      return;
    }

    console.log(
      "3. Before navigation:",
      `${(performance.now() - startTime).toFixed(0)}ms`
    );

    router.push("/transporter/profile");

    console.log(
      "4. Navigation triggered:",
      `${(performance.now() - startTime).toFixed(0)}ms`
    );
  } catch (err) {
    console.log("Error at login logic:", err);
  }
};

  return (
    <div className="flex min-h-screen items-center p-4 justify-center bg-white">
      <form onSubmit={handleLogin} className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg md:w-1/2 lg:w-1/3">
        <Image src="/logo.png" alt="Yatra" width={100} height={35}
          className="mx-auto mb-2" />
        <h1 className="text-xl font-semibold text-primary">Login</h1>

        <input
          type="tel"
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

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border-2 border-gray-300 focus:border-primary focus:outline-none p-3 rounded-lg text-base text-gray-900 placeholder:text-gray-400"
        >
          <option value="rider">Rider</option>
          <option value="booking_partner">Booking Partner</option>
        </select>

        <p className="text-sm text-gray-600 text-center">
          Don't have an account? {""}
          <Link href="/transporter/register" className="text-primary font-semibold">
            Register
          </Link>
        </p>

        <button
          type="submit"
          className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition w-full">
          Login
        </button>
      </form>
    </div>
  );
}