"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, RefreshCw, X, Plus } from "lucide-react";

type Rental = {
  _id: string;
  vehicleType: string;
  rentalType: string;
  pickupLocation: { address: string };
  returnLocation: { address: string };
  startDate: string;
  endDate: string;
  totalPrice: number;
  securityDeposit: number;
  status: "pending" | "confirmed" | "rejected" | "active" | "completed" | "cancelled";
};

const statusStyle: Record<Rental["status"], string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-green-200 bg-green-50 text-green-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  active: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const date = (value: string) => new Date(value).toLocaleDateString("en-NP", { dateStyle: "medium" });

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/passenger/rentals", { credentials: "include", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to load rentals");
      setRentals(data.rentals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialRentals = async () => {
      await loadRentals();
    };

    void loadInitialRentals();
  }, []);

  const cancelRental = async (rentalId: string) => {
    const response = await fetch(`/api/passenger/rentals/${rentalId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Cancelled by customer" }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Failed to cancel rental");
    await loadRentals();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-[#0F172A]">My Rentals</h1><p className="mt-1 text-sm text-slate-500">Track your vehicle rental requests.</p></div>
        <div className="flex gap-2"><Link href="/customer/rentals/new" className="inline-flex items-center gap-2 rounded-xl bg-[#ee8d39] px-4 py-2 text-sm font-semibold text-white"><Plus size={16} /> New rental</Link><button type="button" onClick={loadRentals} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></div>
      </div>

      {loading ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading rentals...</p> : error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</p> : rentals.length === 0 ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">No rentals found.</p> : <div className="grid gap-4">{rentals.map((rental) => <article key={rental._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]"><CalendarDays size={22} /></div><div><h2 className="font-bold text-slate-900">{rental.vehicleType} rental</h2><p className="text-sm text-slate-500">{rental.rentalType}</p></div></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle[rental.status]}`}>{rental.status}</span></div><div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><p className="flex gap-2"><MapPin size={16} className="text-green-600" />{rental.pickupLocation.address}</p><p className="flex gap-2"><MapPin size={16} className="text-red-500" />{rental.returnLocation.address}</p><p>Dates: {date(rental.startDate)} - {date(rental.endDate)}</p><p>Total: Rs. {rental.totalPrice.toFixed(2)} · Deposit: Rs. {rental.securityDeposit.toFixed(2)}</p></div>{["pending", "confirmed", "active"].includes(rental.status) && <button type="button" onClick={() => cancelRental(rental._id).catch((err) => setError(err.message))} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><X size={16} /> Cancel rental</button>}</article>)}</div>}
    </div>
  );
}