"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import {
  Ride,
  formatDate,
  getStatus,
  getVehicleIcon,
} from "@/app/(customer)/components/CommonItems";

type AdminRide = Omit<Ride, "customer" | "transporter"> & {
  customer:
    | string
    | { _id: string; name?: string; phone?: string };
  transporter:
    | string
    | { _id: string; name?: string; phone?: string };
};

const getPersonName = (person: AdminRide["customer"]) =>
  typeof person === "string"
    ? person
    : person.name || person.phone || person._id;

export default function AdminRidesPage() {
  const [rides, setRides] = useState<AdminRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRides = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/rides", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load rides");
        }

        setRides(data.rides || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load rides",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRides();
  }, []);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
          Operations
        </p>

        <h1 className="text-3xl font-black text-[#0F172A]">
          All Rides
        </h1>
        
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-[#0F172A]">
            Ride History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {rides.length} rides found
          </p>
        </div>

        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            Loading rides...
          </p>
        ) : error ? (
          <p className="px-6 py-12 text-center text-sm text-red-600">
            {error}
          </p>
        ) : rides.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            No rides found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <th className="px-6 py-4">Ride</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Requested</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {rides.map((ride) => {
                  const status = getStatus(ride.status);

                  return (
                    <tr
                      key={ride._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[#ee8d39]">
                            {getVehicleIcon(ride.vehicleType)}
                          </span>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {ride.vehicleType}
                            </p>

                            <p className="font-mono text-xs text-slate-400">
                              {ride._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="min-w-64 px-6 py-4 text-sm text-slate-600">
                        <p className="flex gap-2">
                          <MapPin
                            size={15}
                            className="mt-0.5 text-green-600"
                          />
                          {ride.pickupLocation.address}
                        </p>

                        <p className="mt-2 flex gap-2">
                          <MapPin
                            size={15}
                            className="mt-0.5 text-red-500"
                          />
                          {ride.dropoffLocation.address}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {getPersonName(ride.customer)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(ride.requestedAt)}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/dashboard/rides/${ride._id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0F172A] px-3 py-2 text-sm font-semibold text-white"
                        >
                          View
                          <ArrowRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}