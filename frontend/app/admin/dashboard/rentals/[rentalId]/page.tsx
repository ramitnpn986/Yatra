"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

type Rental = {
  _id: string;
  bookingNumber?: string;
  customer?: string | { name?: string; phone?: string };
  transporter?: string | { name?: string; phone?: string };
  vehicle?: string | { brand?: string; model?: string; seats?: number; vehicleType?: string; year?: number };
  vehicleType: string;
  rentalType: string;
  pickupLocation: { address: string };
  returnLocation: { address: string };
  startDate: string;
  endDate: string;
  rentalDays: number;
  pricePerDay: number;
  totalPrice: number;
  securityDeposit: number;
  status: string;
  paymentStatus: string;
};

const formatDate = (value: string) => new Date(value).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" });
const personLabel = (value: Rental["customer"]) => !value ? "Not available" : typeof value === "string" ? value : `${value.name || "Unknown"}${value.phone ? ` · ${value.phone}` : ""}`;
const vehicleLabel = (value: Rental["vehicle"]) => !value ? "Vehicle details not available" : typeof value === "string" ? value : `${value.brand || "Vehicle"} ${value.model || ""} · ${value.seats || "-"} seats${value.year ? ` · ${value.year}` : ""}`;

export default function AdminRentalDetail({ params }: { params: Promise<{ rentalId: string }> }) {
  const [rental, setRental] = useState<Rental | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { rentalId } = await params;
        const response = await fetch(`/api/admin/dashboard/rentals/${rentalId}`, { credentials: "include", cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Failed to load rental");
        setRental(data.vehicleRental);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rental");
      }
    };
    void load();
  }, [params]);

  if (error) return <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</p>;
  if (!rental) return <p className="p-8 text-center text-sm text-slate-500">Loading rental details...</p>;

  return <div className="min-h-full bg-slate-50"><Link href="/admin/dashboard/rentals" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={16} /> All rentals</Link><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]"><CalendarDays size={24} /></div><div><p className="text-sm text-slate-400">{rental.bookingNumber || rental._id}</p><h1 className="text-2xl font-black text-slate-900">Rental Details</h1></div></div><span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold capitalize text-blue-700">{rental.status}</span></div><div className="grid gap-6 p-6 lg:grid-cols-2"><section><h2 className="mb-4 font-bold">Trip Information</h2><div className="space-y-3 text-sm text-slate-600"><p className="flex gap-2"><MapPin className="text-green-600" size={17} />{rental.pickupLocation.address}</p><p className="flex gap-2"><MapPin className="text-red-500" size={17} />{rental.returnLocation.address}</p><p>Dates: {formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p></div></section><section><h2 className="mb-4 font-bold">Rental Information</h2><div className="grid grid-cols-2 gap-3 text-sm"><p className="rounded-lg bg-slate-50 p-3">Vehicle: {rental.vehicleType}</p><p className="rounded-lg bg-slate-50 p-3">Model: {vehicleLabel(rental.vehicle)}</p><p className="rounded-lg bg-slate-50 p-3">Type: {rental.rentalType}</p><p className="rounded-lg bg-slate-50 p-3">Days: {rental.rentalDays}</p><p className="rounded-lg bg-slate-50 p-3">Price/day: Rs. {rental.pricePerDay}</p><p className="rounded-lg bg-slate-50 p-3 font-bold">Total: Rs. {rental.totalPrice}</p><p className="rounded-lg bg-slate-50 p-3">Deposit: Rs. {rental.securityDeposit}</p></div></section><section><h2 className="mb-4 font-bold">Customer</h2><p className="rounded-lg bg-slate-50 p-4 text-sm">{personLabel(rental.customer)}</p></section><section><h2 className="mb-4 font-bold">Transporter</h2><p className="rounded-lg bg-slate-50 p-4 text-sm">{personLabel(rental.transporter)}</p></section></div><div className="border-t border-slate-100 p-6"><p className="text-sm text-slate-500">Payment status</p><p className="mt-1 font-semibold capitalize text-slate-800">{rental.paymentStatus}</p></div></div></div>;
}