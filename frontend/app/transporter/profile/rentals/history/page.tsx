"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, RefreshCw, User } from "lucide-react";

interface Rental {
  _id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalCost?: number;
  customer?: { name: string; phone?: string };
  pickupLocation?: { address?: string };
  returnLocation?: { address?: string };
}

const HISTORY_STATUSES = ["completed", "cancelled", "rejected"];

const statusStyle = (status: string) => {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-slate-200 text-slate-700";
  return "bg-red-100 text-red-700";
};

export default function RentalHistoryPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/transporter/rentals", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load rental history");
      }
      const all: Rental[] = data.rentals || [];
      setRentals(all.filter((r) => HISTORY_STATUSES.includes(r.status)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a1f39]">Rental History</h1>
          <p className="mt-1 text-sm text-slate-500">
            Completed, cancelled, and rejected rentals.
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="flex items-center gap-2 rounded-xl bg-[#0a1f39] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#132d4d]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading && <p className="py-12 text-center text-slate-500">Loading history...</p>}

      {!loading && error && (
        <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && rentals.length === 0 && (
        <p className="py-12 text-center text-slate-500">No past rentals yet.</p>
      )}

      <div className="space-y-4">
        {rentals.map((rental) => (
          <div
            key={rental._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <User size={16} className="text-slate-500" />
                {rental.customer?.name || "Customer"}
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(rental.status)}`}
              >
                {rental.status}
              </span>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-emerald-600" />
                {rental.pickupLocation?.address || "Pickup not set"}
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-rose-500" />
                {rental.returnLocation?.address || "Return not set"}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays size={16} className="text-slate-500" />
                {new Date(rental.startDate).toLocaleDateString()} to{" "}
                {new Date(rental.endDate).toLocaleDateString()}
              </p>
              {rental.totalCost !== undefined && (
                <p className="font-semibold text-slate-800">Rs. {rental.totalCost}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}