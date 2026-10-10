"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Phone, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [err_name, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [err_phone, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [err_password, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validation = () => {
    let isValid = true;

    // Name validation
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

    // Phone validation
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

    // Password validation
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

    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/passenger/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (err) {
      console.error("Error at registration logic:", err);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#071325] via-[#0a1f39] to-[#040d1a] px-4 py-4">
     
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#ee8d39]/10 blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        
  
        <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#0a1f39] px-5 py-2 text-xs font-bold tracking-wider uppercase text-[#ee8d39] shadow-sm">
          Passenger
        </div>

   
        <div className="mb-6 mt-2 text-center">
          <Image
            src="/yatralogo.png"
            alt="Yatra"
            width={80}
            height={22}
            className="mx-auto mb-4 rounded-3xl object-contain"
          />
          <p className="mt-1 text-sm text-slate-500">Sign up to get started with your journeys</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
    
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600">
              Full Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                  err_name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-[#0a1f39] focus:ring-slate-100"
                }`}
              />
            </div>
            {err_name && ( <p className="mt-1 text-xs  text-red-500">{err_name}</p>)}
          </div>


          <div>
            <label className="mb-1.5 block text-xs font-bold  tracking-wide text-slate-600">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError("");
                }}
                className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                  err_phone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-[#0a1f39] focus:ring-slate-100"
                }`}
              />
            </div>
            {err_phone && (
              <p className="mt-1 text-xs  text-red-500">{err_phone}</p>
            )}
          </div>

   
          <div>
            <label className="mb-1.5 block text-xs font-bold  tracking-wide text-slate-600">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                  err_password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-[#0a1f39] focus:ring-slate-100"
                }`}
              />
            </div>
            {err_password && (<p className="mt-1 text-xs  text-red-500">{err_password}</p>)}
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#122e54] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registering...
              </span>
            ) : (
              <>
                Register <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

   
        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#ee8d39] transition hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}