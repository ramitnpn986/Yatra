"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/passenger/login`, {
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
        toast.error(data.message || "Invalid phone number or password");
        return;
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error at login logic:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#071325] via-[#0a1f39] to-[#040d1a] px-4 py-12">

      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#031531] blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">

        <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#0a1f39] px-5 py-2 text-xs font-bold tracking-wider uppercase text-[#ee8d39] shadow-sm">
          Passenger
        </div>

        <div className="mb-8 mt-2 text-center">
          <Image
            src="/yatralogo.png"
            alt="Yatra"
            width={80}
            height={22}
            className="mx-auto mb-4 rounded-3xl object-contain"
          />
          <p className="mt-1 text-sm text-slate-500">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600">
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
            className=" mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#122e54] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <>
                Sign In <ArrowRight size={16} className="transition-transform" />
              </>
            )}
          </button>
        </form>


        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-[#ee8d39] transition hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}