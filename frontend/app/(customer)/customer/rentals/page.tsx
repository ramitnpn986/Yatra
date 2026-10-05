
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";

type RentalStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "active"
  | "completed"
  | "cancelled";

type PaymentStatus =
  | "unpaid"
  | "deposit_paid"
  | "fully_paid"
  | "refunded";

type Rental = {
  _id: string;
  vehicleType: string;
  rentalType: string;
  pickupLocation: {
    address: string;
  };
  returnLocation: {
    address: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  securityDeposit: number;
  paymentStatus: PaymentStatus;
  status: RentalStatus;
};

const statusStyles: Record<RentalStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-green-200 bg-green-50 text-green-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  active: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NP", {
    dateStyle: "medium",
  });

const formatPrice = (value: number) =>
  `Rs. ${value.toFixed(2)}`;

const canCancel = (status: RentalStatus) =>
  ["pending", "confirmed", "active"].includes(status);

const canPayDeposit = (rental: Rental) =>
  ["confirmed", "active"].includes(rental.status) &&
  rental.paymentStatus === "unpaid" &&
  rental.securityDeposit > 0;

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/passenger/rentals", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load rentals");
      }

      setRentals(data.rentals || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load rentals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRentals();
  }, []);

  const cancelRental = async (rentalId: string) => {
    try {
      setError("");

      const response = await fetch(
        `/api/passenger/rentals/${rentalId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "Cancelled by customer",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel rental");
      }

      await loadRentals();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to cancel rental"
      );
    }
  };

  const payDeposit = async (rentalId: string) => {
    try {
      setError("");

      const response = await fetch(
        `/api/passenger/rentals/${rentalId}/pay-deposit`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to pay deposit");
      }

      await loadRentals();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to pay deposit"
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            My Rentals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your vehicle rental requests.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/customer/booking-filter"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ee8d39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d97c2f]"
          >
            <Plus size={16} />
            New rental
          </Link>

          <button
            type="button"
            onClick={() => void loadRentals()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
          Loading rentals...
        </div>
      )}

      {!loading && !error && rentals.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            No rentals found.
          </p>

          <Link
            href="/customer/booking-filter"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#ee8d39] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Create rental
          </Link>
        </div>
      )}

      {/* Rentals */}
      {!loading && rentals.length > 0 && (
        <div className="grid gap-4">
          {rentals.map((rental) => (
            <RentalCard
              key={rental._id}
              rental={rental}
              onCancel={cancelRental}
              onPayDeposit={payDeposit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type RentalCardProps = {
  rental: Rental;
  onCancel: (id: string) => Promise<void>;
  onPayDeposit: (id: string) => Promise<void>;
};

function RentalCard({
  rental,
  onCancel,
  onPayDeposit,
}: RentalCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Rental Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]">
            <CalendarDays size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              {rental.vehicleType} Rental
            </h2>

            <p className="text-sm text-slate-500">
              {rental.rentalType}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            statusStyles[rental.status]
          }`}
        >
          {rental.status}
        </span>
      </div>

      {/* Rental Details */}
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <Location
          iconColor="text-green-600"
          address={rental.pickupLocation.address}
        />

        <Location
          iconColor="text-red-500"
          address={rental.returnLocation.address}
        />

        <p>
          <span className="font-medium text-slate-800">
            Dates:
          </span>{" "}
          {formatDate(rental.startDate)} -{" "}
          {formatDate(rental.endDate)}
        </p>

        <p>
          <span className="font-medium text-slate-800">
            Total:
          </span>{" "}
          {formatPrice(rental.totalPrice)}
        </p>

        <p>
          <span className="font-medium text-slate-800">
            Deposit:
          </span>{" "}
          {formatPrice(rental.securityDeposit)}
        </p>

        <p>
          <span className="font-medium text-slate-800">
            Payment:
          </span>{" "}
          <span className="capitalize">
            {rental.paymentStatus.replace("_", " ")}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {canPayDeposit(rental) && (
          <button
            type="button"
            onClick={() => void onPayDeposit(rental._id)}
            className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Pay deposit · {formatPrice(rental.securityDeposit)}
          </button>
        )}

        {canCancel(rental.status) && (
          <button
            type="button"
            onClick={() => void onCancel(rental._id)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <X size={16} />
            Cancel rental
          </button>
        )}
      </div>
    </article>
  );
}

type LocationProps = {
  address: string;
  iconColor: string;
};

function Location({ address, iconColor }: LocationProps) {
  return (
    <p className="flex gap-2">
      <MapPin size={16} className={`mt-0.5 shrink-0 ${iconColor}`}/>
      <span>{address}</span>
    </p>
  );
}

