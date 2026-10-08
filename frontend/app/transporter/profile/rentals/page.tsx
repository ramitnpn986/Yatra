"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  Play,
  RefreshCw,
  X,
} from "lucide-react";

type RentalStatus = "pending" | "confirmed" | "active";

type Rental = {
  _id: string;
  bookingNumber?: string;
  vehicleType: string;
  rentalType: string;
  pickupLocation: {
    name?: string;
    address: string;
  };
  returnLocation: {
    name?: string;
    address: string;
  };
  startDate: string;
  endDate: string;
  rentalDays?: number;
  totalPrice: number;
  securityDeposit: number;
  status: RentalStatus;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NP", {
    dateStyle: "medium",
  });

const formatCurrency = (value: number) =>
  `Rs. ${Number(value || 0).toLocaleString("en-NP")}`;

export default function TransporterRentalsPage() {
  const router = useRouter();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/transporter/rentals", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load rentals");
      }

      setRentals(data.rentals || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load rentals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRentalRequest = () => {
      void loadRentals();
    };

    void loadRentals();

    window.addEventListener(
      "rental-request-received",
      handleRentalRequest
    );

    return () => {
      window.removeEventListener(
        "rental-request-received",
        handleRentalRequest
      );
    };
  }, []);

  const updateRental = async (
    rentalId: string,
    action: "accept" | "reject" | "start" | "complete"
  ) => {
    try {
      setError("");

      const response = await fetch(
        `/api/transporter/rentals/${rentalId}/${action}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to ${action} rental`
        );
      }

      await loadRentals();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${action} rental`
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Rental Requests
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage customer rental requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadRentals()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
          Loading rental requests...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && rentals.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center">
          <CalendarDays
            size={32}
            className="mx-auto mb-3 text-slate-400"
          />

          <p className="text-sm font-medium text-slate-700">
            No rental requests
          </p>

          <p className="mt-1 text-xs text-slate-500">
            New customer rental requests will appear here.
          </p>
        </div>
      )}

      {/* Rentals */}
      {!loading && !error && rentals.length > 0 && (
        <div className="grid gap-4">
          {rentals.map((rental) => (
            <article
              key={rental._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {rental.vehicleType} ·{" "}
                      {rental.rentalType.replace("-", " ")}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(rental.startDate)} -{" "}
                      {formatDate(rental.endDate)}
                    </p>

                    {rental.bookingNumber && (
                      <p className="mt-1 text-xs text-slate-400">
                        Booking #{rental.bookingNumber}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    rental.status === "pending"
                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                      : rental.status === "confirmed"
                        ? "border border-green-200 bg-green-50 text-green-700"
                        : "border border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  {rental.status}
                </span>
              </div>

              {/* Locations */}
              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <p className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-green-600"
                  />
                  <span>
                    <span className="block text-xs font-semibold text-slate-400">
                      Pickup
                    </span>
                    {rental.pickupLocation.address}
                  </span>
                </p>

                <p className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <span>
                    <span className="block text-xs font-semibold text-slate-400">
                      Return
                    </span>
                    {rental.returnLocation.address}
                  </span>
                </p>
              </div>

              {/* Price */}
              <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Rental days</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {rental.rentalDays || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatCurrency(rental.totalPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Security deposit
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatCurrency(rental.securityDeposit)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/transporter/profile/rental-requests/${rental._id}`
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0a1f39] transition hover:bg-slate-50"
                >
                  View Details
                  <ArrowRight size={16} />
                </button>

                {rental.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        void updateRental(rental._id, "reject")
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <X size={16} />
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void updateRental(rental._id, "accept")
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <Check size={16} />
                      Accept
                    </button>
                  </>
                )}

                {rental.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() =>
                      void updateRental(rental._id, "start")
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Play size={16} />
                    Start Rental
                  </button>
                )}

                {rental.status === "active" && (
                  <button
                    type="button"
                    onClick={() =>
                      void updateRental(rental._id, "complete")
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Check size={16} />
                    Complete Rental
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
