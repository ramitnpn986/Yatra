"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, MapPin, Play, RefreshCw, X } from "lucide-react";

type RentalStatus = "pending" | "confirmed" | "active";
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
  status: RentalStatus;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString("en-NP", { dateStyle: "medium" });

export default function TransporterRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transporter/rentals", { credentials: "include", cache: "no-store" });
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

    const handleRentalRequest = () => {
      void loadInitialRentals();
    };

    void loadInitialRentals();
    window.addEventListener("rental-request-received", handleRentalRequest);

    return () => {
      window.removeEventListener("rental-request-received", handleRentalRequest);
    };
  }, []);

  const updateRental = async (rentalId: string, action: "accept" | "reject" | "start" | "complete") => {
    const response = await fetch(`/api/transporter/rentals/${rentalId}/${action}`, { method: "POST", credentials: "include" });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || `Failed to ${action} rental`);
    await loadRentals();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-[#0F172A]">Rental Requests</h1><p className="mt-1 text-sm text-slate-500">Manage the full rental lifecycle.</p></div><button type="button" onClick={loadRentals} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></div>
      {loading ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading rentals...</p> : error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</p> : rentals.length === 0 ? <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">No rental requests.</p> : <div className="grid gap-4">{rentals.map((rental) => <article key={rental._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]"><CalendarDays size={22} /></div><div><h2 className="font-bold text-slate-900">{rental.vehicleType} · {rental.rentalType}</h2><p className="text-sm text-slate-500">{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p></div></div><span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">{rental.status}</span></div><div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><p className="flex gap-2"><MapPin size={16} className="text-green-600" />{rental.pickupLocation.address}</p><p className="flex gap-2"><MapPin size={16} className="text-red-500" />{rental.returnLocation.address}</p><p>Total: Rs. {rental.totalPrice.toFixed(2)}</p><p>Security deposit: Rs. {rental.securityDeposit.toFixed(2)}</p></div><div className="mt-5 flex flex-wrap gap-3">{rental.status === "pending" && <><button type="button" onClick={() => updateRental(rental._id, "reject").catch((err) => setError(err.message))} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"><X size={16} /> Reject</button><button type="button" onClick={() => updateRental(rental._id, "accept").catch((err) => setError(err.message))} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"><Check size={16} /> Accept</button></>}{rental.status === "confirmed" && <button type="button" onClick={() => updateRental(rental._id, "start").catch((err) => setError(err.message))} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Play size={16} /> Start rental</button>}{rental.status === "active" && <button type="button" onClick={() => updateRental(rental._id, "complete").catch((err) => setError(err.message))} className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white"><Check size={16} /> Complete rental</button>}</div></article>)}</div>}
    </div>
  );
}