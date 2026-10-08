"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Check,
  Loader2,
  MapPin,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

const LocationPicker = dynamic(
  () => import("@/app/(customer)/components/LocationPicker1"),
  { ssr: false }
);

type Location = {
  name: string;
  address: string;
  type?: "Point";
  coordinates: [number, number];
};

type Customer = {
  _id: string;
  name: string;
  phone: string;
  profileImage?: string;
};

type Vehicle = {
  _id: string;
  vehicleType: string;
  brand?: string;
  model?: string;
  numberPlate?: string;
  images?: string[];
  seats?: number;
  capacityKg?: number;
};

type Rental = {
  _id: string;
  bookingNumber: string;
  customer: Customer;
  vehicle: Vehicle;
  vehicleType: string;
  rentalType: string;
  pickupLocation: Location;
  destinations: Location[];
  returnLocation: Location;
  totalDistanceKm: number;
  estimatedDurationMinutes?: number;
  startDate: string;
  endDate: string;
  rentalDays: number;
  pricePerDay: number;
  totalPrice: number;
  securityDeposit: number;
  status: "pending" | "confirmed" | "active" | "rejected" | "completed" | "cancelled";
};

export default function RentalRequestDetail() {
  const params = useParams();
  const router = useRouter();

  const rentalId = params?.id as string;

  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    "accept" | "reject" | null
  >(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rentalId) return;

    const loadRental = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/transporter/rentals", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load rental request");
        }

        const foundRental = (data.rentals || []).find(
          (item: Rental) => item._id === rentalId
        );

        if (!foundRental) {
          throw new Error("Rental request not found");
        }

        setRental(foundRental);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load rental request"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRental();
  }, [rentalId]);

  const handleAction = async (action: "accept" | "reject") => {
    if (!rental) return;

    try {
      setActionLoading(action);

      const response = await fetch(
        `/api/transporter/rentals/${rental._id}/${action}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to ${action} rental request`
        );
      }

      setRental((previous) =>
        previous
          ? {
              ...previous,
              status: action === "accept" ? "confirmed" : "rejected",
            }
          : previous
      );

      window.dispatchEvent(new Event("rental-request-received"));

      toast.success(
        action === "accept"
          ? "Rental request accepted"
          : "Rental request rejected"
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Failed to ${action} rental request`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-NP", {
      dateStyle: "medium",
    });

  const formatCurrency = (value: number) =>
    `Rs. ${Number(value || 0).toLocaleString("en-NP")}`;

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center rounded-2xl bg-white p-16 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          Loading rental request...
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0a1f39]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          {error || "Rental request not found"}
        </div>
      </div>
    );
  }

  const isPending = rental.status === "pending";

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#0a1f39]"
      >
        <ArrowLeft size={18} />
        Back to rental requests
      </button>

      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ee8d39]">
              Booking #{rental.bookingNumber}
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0a1f39]">
              Rental Request
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {rental.customer.name} · {rental.customer.phone}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${
              rental.status === "pending"
                ? "bg-amber-100 text-amber-700"
                : rental.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : rental.status === "active"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
            }`}
          >
            {rental.status}
          </span>
        </div>

        {/* Locations */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={18} className="text-emerald-600" />
              Pickup Location
            </label>

            <div className="h-[220px] overflow-hidden rounded-2xl border border-slate-200">
              <LocationPicker
                currentCoords={[
  rental.pickupLocation.coordinates[1],
  rental.pickupLocation.coordinates[0],
]}
                isEditable={false}
                onSelect={() => {}}
              />
            </div>

            <p className="mt-2 text-sm font-medium text-slate-700">
              {rental.pickupLocation.address}
            </p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={18} className="text-rose-500" />
              Return Location
            </label>

            <div className="h-[220px] overflow-hidden rounded-2xl border border-slate-200">
              <LocationPicker
                currentCoords={[
  rental.returnLocation.coordinates[1],
  rental.returnLocation.coordinates[0],
]}
                isEditable={false}
                onSelect={() => {}}
              />
            </div>

            <p className="mt-2 text-sm font-medium text-slate-700">
              {rental.returnLocation.address}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Destinations
          </p>

          <div className="mt-3 space-y-2">
            {rental.destinations.map((destination, index) => (
              <div
                key={`${destination.address}-${index}`}
                className="flex items-start gap-3 text-sm text-slate-700"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0a1f39] text-xs font-semibold text-white">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold">
                    {destination.name || destination.address}
                  </p>

                  {destination.name && (
                    <p className="text-slate-500">{destination.address}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <Users size={17} className="mb-2 text-slate-500" />
            <p className="text-xs text-slate-500">Rental Type</p>
            <p className="font-semibold capitalize text-slate-800">
              {rental.rentalType.replace("-", " ")}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <Car size={17} className="mb-2 text-slate-500" />
            <p className="text-xs text-slate-500">Vehicle</p>
            <p className="font-semibold text-slate-800">
              {rental.vehicleType}
            </p>

            {rental.vehicle && (
              <p className="mt-1 text-xs text-slate-500">
                {rental.vehicle.brand} {rental.vehicle.model}
                {rental.vehicle.numberPlate
                  ? ` · ${rental.vehicle.numberPlate}`
                  : ""}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <CalendarDays size={17} className="mb-2 text-slate-500" />
            <p className="text-xs text-slate-500">Journey Dates</p>
            <p className="text-sm font-semibold text-slate-800">
              {formatDate(rental.startDate)}
            </p>
            <p className="text-xs text-slate-500">
              to {formatDate(rental.endDate)} · {rental.rentalDays} days
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <Wallet size={17} className="mb-2 text-slate-500" />
            <p className="text-xs text-slate-500">Total Price</p>
            <p className="font-semibold text-slate-800">
              {formatCurrency(rental.totalPrice)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Deposit: {formatCurrency(rental.securityDeposit)}
            </p>
          </div>
        </div>

        {/* Extra information */}
        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Distance</p>
            <p className="mt-1 font-semibold text-slate-800">
              {rental.totalDistanceKm} km
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Price per day</p>
            <p className="mt-1 font-semibold text-slate-800">
              {formatCurrency(rental.pricePerDay)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Customer</p>
            <p className="mt-1 font-semibold text-slate-800">
              {rental.customer.name}
            </p>
          </div>
        </div>

        {isPending && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={actionLoading !== null}
              onClick={() => void handleAction("accept")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0a1f39] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#132d4d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading === "accept" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {actionLoading === "accept" ? "Accepting..." : "Accept Request"}
            </button>

            <button
              type="button"
              disabled={actionLoading !== null}
              onClick={() => void handleAction("reject")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading === "reject" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <X size={18} />
              )}
              {actionLoading === "reject" ? "Rejecting..." : "Reject Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
