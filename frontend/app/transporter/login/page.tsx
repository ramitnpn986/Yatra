"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Lock, ArrowRight, UserCheck, Bike, Building2 } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("rider");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/transporter/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Transporter login failed");
        return;
      }

      toast.success("Login successful!");
      router.push("/transporter/profile");
    } catch (err) {
      console.error("Error at login logic:", err);
      toast.error("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#071325] via-[#0a1f39] to-[#040d1a] px-4 py-12">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#ee8d39]/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">

        <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#0a1f39] px-5 py-2 text-xs font-bold tracking-wider uppercase text-[#ee8d39] shadow-sm">
          Transporter
        </div>

        <div className="mb-6 mt-2 text-center">
          <Image
            src="/yatralogo.png"
            alt="Yatra"
            width={80}
            height={22}
            className="mx-auto mb-4 rounded-3xl object-contain"
          />
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your rides & bookings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold  tracking-wide text-slate-600">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => setRole("rider")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${role === "rider" ? "bg-[#0a1f39] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
              >

                Rider
              </button>
              <button
                type="button"
                onClick={() => setRole("booking-partner")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${role === "booking-partner" ? "bg-[#0a1f39] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Booking Partner
              </button>
            </div>
          </div>


          <div>
            <label className="mb-1.5 block text-xs font-bold  tracking-wide text-slate-600">
              Phone Number
            </label>
            <div className="relative flex items-center">

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold  tracking-wide text-slate-600">
              Password
            </label>
            <div className="relative flex items-center">

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#122e54] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <>
                Login  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>


        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link  href="/transporter/register" className="text-sm text-[#ee8d39] transition hover:underline">
            Register as Transporter
          </Link>
        </div>
      </div>
    </div>
  );
}