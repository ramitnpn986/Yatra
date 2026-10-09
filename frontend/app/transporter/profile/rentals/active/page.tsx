"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Play,
  CheckCircle2,
  RefreshCw,
  User,
  Wallet,
} from "lucide-react";

interface Customer {
  _id: string;
  name?: string;
  phone?: string;
}

interface Vehicle {
  _id: string;
  vehicleType: string;
  brand?: string;
  model?: string;
  numberPlate?: string;
  images?: string[];
}

interface RentalLocation {
  name?: string;
  address?: string;
}

interface Rental {
  _id: string;
  bookingNumber: string;
  customer?: Customer;
  vehicle?: Vehicle;
  vehicleType: string;
  rentalType: string;
  pickupLocation?: RentalLocation;
  returnLocation?: RentalLocation;
  startDate: string;
  endDate: string;
  rentalDays: number;
  totalPrice: number;
  securityDeposit: number;
  status: string;
}

// Next.js proxy route (rental-requests page ma pani yehi use bhayeko cha)
const RENTALS_API = "/api/transporter/rentals";
const PLACEHOLDER_IMAGE = "/vehicle-placeholder.jpg";

export default function ActiveRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch(RENTALS_API, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load rentals");
      }

      const list: Rental[] = data.rentals || [];
      // Pending haru Rental Requests page ma dekhinchha, yaha confirmed + active matra
      setRentals(list.filter((r) => r.status === "confirmed" || r.status === "active"));
    } catch (error) {
      console.error("Active rentals error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load rentals"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "start" | "complete") => {
    if (action === "complete" && !window.confirm("Mark this rental as completed?")) {
      return;
    }

    try {
      setBusyId(id);

      const res = await fetch(`${RENTALS_API}/${action}/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to ${action} rental`);
      }

      toast.success(
        action === "start"
          ? "Rental started successfully"
          : "Rental completed successfully"
      );

      await load(true);
    } catch (error) {
      console.error(`${action} rental error:`, error);
      toast.error(
        error instanceof Error ? error.message : `Failed to ${action} rental`
      );
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-NP", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const formatCurrency = (value: number) =>
    `Rs. ${Number(value || 0).toLocaleString("en-NP")}`;

  const vehicleName = (vehicle?: Vehicle, fallback?: string) => {
    const name = `${vehicle?.brand || ""} ${vehicle?.model || ""}`.trim();
    return name || vehicle?.vehicleType || fallback || "Vehicle";
  };

  const statusClasses = (status: string) =>
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-32 animate-pulse rounded-3xl bg-[#0a1f39]" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1f39] via-[#0f2d52] to-[#071526] px-6 py-10 text-white shadow-xl md:px-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                <Car className="h-4 w-4 text-[#ee8d39]" />
                Transporter Dashboard
              </div>
              <h1 className="text-3xl font-bold md:text-5xl">Active Rentals</h1>
              <p className="mt-3 max-w-xl text-sm text-gray-300 md:text-base">
                Start confirmed rentals and complete them when the vehicle is
                returned.
              </p>
            </div>

            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#ee8d39] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#df7d2c] disabled:opacity-60 lg:self-auto"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {/* Empty state */}
        {rentals.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0a1f39]">
              <Car className="h-9 w-9 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#0a1f39]">
              No active rentals
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              Confirmed and ongoing rentals will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((rental) => (
              <article
                key={rental._id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={rental.vehicle?.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={vehicleName(rental.vehicle, rental.vehicleType)}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusClasses(
                      rental.status
                    )}`}
                  >
                    {rental.status}
                  </span>

                  <div className="absolute bottom-4 left-4">
                    <p className="text-xs text-white/70">Booking Number</p>
                    <p className="text-lg font-bold text-white">
                      {rental.bookingNumber}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#0a1f39]">
                    {vehicleName(rental.vehicle, rental.vehicleType)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {rental.vehicle?.numberPlate || rental.vehicleType} •{" "}
                    {rental.rentalType === "with-driver" ? "With driver" : "Self drive"}
                  </p>

                  {/* Customer */}
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a1f39]">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Customer
                      </p>
                      <p className="truncate text-sm font-semibold text-[#0a1f39]">
                        {rental.customer?.name || "Unknown customer"}
                      </p>
                      {rental.customer?.phone && (
                        <p className="text-xs text-gray-500">
                          {rental.customer.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-100 p-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#ee8d39]" />
                        <span className="text-xs text-gray-400">Start</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#0a1f39]">
                        {formatDate(rental.startDate)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#ee8d39]" />
                        <span className="text-xs text-gray-400">End</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#0a1f39]">
                        {formatDate(rental.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ee8d39]" />
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Pickup
                        </p>
                        <p className="truncate text-sm font-semibold text-[#0a1f39]">
                          {rental.pickupLocation?.name ||
                            rental.pickupLocation?.address ||
                            "Pickup location"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0a1f39]" />
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Return
                        </p>
                        <p className="truncate text-sm font-semibold text-[#0a1f39]">
                          {rental.returnLocation?.name ||
                            rental.returnLocation?.address ||
                            "Return location"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#0a1f39] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ee8d39]">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total Price</p>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(rental.totalPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Deposit</p>
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(rental.securityDeposit)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {rental.status === "confirmed" && (
                    <button
                      type="button"
                      disabled={busyId === rental._id}
                      onClick={() => act(rental._id, "start")}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ee8d39] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#df7d2c] disabled:opacity-60"
                    >
                      <Play className="h-4 w-4" />
                      {busyId === rental._id ? "Starting..." : "Start Rental"}
                    </button>
                  )}

                  {rental.status === "active" && (
                    <button
                      type="button"
                      disabled={busyId === rental._id}
                      onClick={() => act(rental._id, "complete")}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {busyId === rental._id ? "Completing..." : "Complete Rental"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}