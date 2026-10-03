"use client";

import { useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";

type Rental = {
  _id: string;
  bookingNumber?: string;
  vehicleType: string;
  rentalType: string;
  startDate: string;
  endDate: string;
  rentalDays?: number;
  pricePerDay: number;
  totalPrice: number;
  securityDeposit: number;
  status: string;
  paymentStatus: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NP", { dateStyle: "medium" });

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/dashboard/rentals", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load rentals");
      }
      setRentals(data.vehicleRentals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      await loadRentals();
    };
    void initialLoad();
  }, []);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">Management</p>
          <h1 className="text-3xl font-black text-[#0F172A]">Vehicle Rentals</h1>
          <p className="mt-2 text-sm text-slate-500">Monitor rental bookings, status, and payment information.</p>
        </div>
        <button type="button" onClick={loadRentals} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading rentals...</p>
      ) : error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</p>
      ) : rentals.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">No rental bookings found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500"><th className="px-6 py-4">Booking</th><th className="px-6 py-4">Vehicle</th><th className="px-6 py-4">Dates</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Payment</th><th className="px-6 py-4">Status</th></tr></thead>
            <tbody>{rentals.map((rental) => <tr key={rental._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-2 font-semibold text-slate-800"><CalendarDays size={17} className="text-[#ee8d39]" />{rental.bookingNumber || rental._id.slice(-8)}</div></td><td className="px-6 py-4 text-sm text-slate-600">{rental.vehicleType} · {rental.rentalType}</td><td className="px-6 py-4 text-sm text-slate-600">{formatDate(rental.startDate)} - {formatDate(rental.endDate)}<br /><span className="text-xs text-slate-400">{rental.rentalDays || "-"} days</span></td><td className="px-6 py-4 font-semibold text-slate-800">Rs. {rental.totalPrice.toFixed(2)}</td><td className="px-6 py-4"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">{rental.paymentStatus || "unpaid"}</span></td><td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">{rental.status}</span></td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}