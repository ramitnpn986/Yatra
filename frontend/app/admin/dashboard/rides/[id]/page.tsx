"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Route,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  Ride,
  formatDate,
  getStatus,
  getVehicleIcon,
} from "@/app/(customer)/components/CommonItems";

type Person =
  | string
  | {
      _id: string;
      name?: string;
      phone?: string;
    };

type AdminRide = Omit<Ride, "customer" | "transporter"> & {
  customer: Person;
  transporter: Person;
};

const personName = (person: Person) => {
  if (typeof person === "string") return person;

  return `${person.name || "Unknown"}${
    person.phone ? ` (${person.phone})` : ""
  }`;
};

export default function AdminRideDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [ride, setRide] = useState<AdminRide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRide = async () => {
      try {
        const { id } = await params;

        const response = await fetch(
          `/api/admin/dashboard/rides/${id}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Ride not found");
        }

        setRide(data.ride);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load ride",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRide();
  }, [params]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading ride details...
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
        {error || "Ride not found"}
      </div>
    );
  }

  const status = getStatus(ride.status);

  const timeline: Array<[string, string | undefined]> = [
    ["Ride Requested", ride.requestedAt],
    ["Driver Accepted", ride.acceptedAt],
    ["Driver Arrived", ride.driverArrivedAt],
    ["Ride Started", ride.startedAt],
    ["Arrived Destination", ride.arrivedDestinationAt],
    ["Ride Completed", ride.completedAt],
  ];

  return (
    <div className="min-h-full bg-slate-50">
      <Link
        href="/admin/dashboard/rides"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#ee8d39]"
      >
        <ArrowLeft size={17} />
        All Rides
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-[#ee8d39]">
              {getVehicleIcon(ride.vehicleType)}
            </div>

            <div>
              <p className="text-sm text-slate-400">
                {ride.vehicleType} · {ride._id}
              </p>

              <h1 className="text-2xl font-black text-slate-900">
                Ride Details
              </h1>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${status.className}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-bold text-slate-900">
              Trip Route
            </h2>

            <p className="mb-4 flex gap-3 text-slate-700">
              <MapPin className="shrink-0 text-green-600" />
              {ride.pickupLocation.address}
            </p>

            <p className="flex gap-3 text-slate-700">
              <MapPin className="shrink-0 text-red-500" />
              {ride.dropoffLocation.address}
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-bold text-slate-900">
              Ride Information
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Distance</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  <Route size={16} className="text-purple-600" />
                  {ride.distanceKm.toFixed(2)} km
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Passengers</p>
                <p className="mt-1 font-semibold">
                  {ride.passengerCount}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Fare</p>
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <IndianRupee size={16} className="text-green-600" />
                  Rs.{" "}
                  {(ride.finalFare ?? ride.estimatedFare).toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-bold text-slate-900">
              Customer
            </h2>

            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
              <UserRound className="text-slate-500" />
              <span>{personName(ride.customer)}</span>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-bold text-slate-900">
              Transporter
            </h2>

            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
              <UserRound className="text-slate-500" />
              <span>{personName(ride.transporter)}</span>
            </div>
          </section>
        </div>

        <section className="border-t border-slate-100 p-6">
          <h2 className="mb-5 font-bold text-slate-900">
            Ride Timeline
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map(([label, date]) => (
              <div key={label} className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className={
                    date ? "text-green-600" : "text-slate-300"
                  }
                />

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {label}
                  </p>

                  <p className="text-xs text-slate-400">
                    {formatDate(date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {ride.status === "cancelled" && (
          <div className="mx-6 mb-6 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={18} />
            Cancelled by {ride.cancelledBy || "unknown"} on{" "}
            {formatDate(ride.cancelledAt)}
          </div>
        )}
      </div>
    </div>
  );
}