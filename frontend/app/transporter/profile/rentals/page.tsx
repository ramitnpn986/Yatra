"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, MapPin, RefreshCw, X } from "lucide-react";

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
};

const date = (value: string) => new Date(value).toLocaleDateString("en-NP", { dateStyle: "medium" });

export default function TransporterRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transporter/rentals", { credentials: "include", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to load rental requests");
      setRentals(data.rentals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rental requests");
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

  const updateRental = async (rentalId: string, action: "accept" | "reject") => {
    const response = await fetch(`/api/transporter/rentals/${rentalId}/${action}`, { method: "POST", credentials: "include" });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || `Failed to ${action} rental`);
    await loadRentals();
  };

  return (
    <div className="mx-auto max-w-5xl"><div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-[#0F172A]">Rental Requests</h1><p className="mt-1 text-sm text-slate-500">Review customers requesting your vehicle.</p></div><button type="button" onClick={loadRentals} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></div>{loading ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading requests...</p> : error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</p> : rentals.length === 0 ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">No pending rental requests.</p> : <div className="grid gap-4">{rentals.map((rental) => <article key={rental._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]"><CalendarDays size={22} /></div><div><h2 className="font-bold text-slate-900">{rental.vehicleType} · {rental.rentalType}</h2><p className="text-sm text-slate-500">{date(rental.startDate)} - {date(rental.endDate)}</p></div></div><p className="font-bold text-green-700">Rs. {rental.totalPrice.toFixed(2)}</p></div><div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><p className="flex gap-2"><MapPin size={16} className="text-green-600" />{rental.pickupLocation.address}</p><p className="flex gap-2"><MapPin size={16} className="text-red-500" />{rental.returnLocation.address}</p><p>Security deposit: Rs. {rental.securityDeposit.toFixed(2)}</p></div><div className="mt-5 flex gap-3"><button type="button" onClick={() => updateRental(rental._id, "reject").catch((err) => setError(err.message))} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><X size={16} /> Reject</button><button type="button" onClick={() => updateRental(rental._id, "accept").catch((err) => setError(err.message))} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"><Check size={16} /> Accept</button></div></article>)}</div>}</div>
  );
}