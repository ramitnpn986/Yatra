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

type FilterType = "all" | "active" | "completed" | "cancelled";

export default function AdminRidesPage() {
  const [rides, setRides] = useState<AdminRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    const loadRides = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          activeFilter === "all"
            ? "/api/admin/dashboard/rides"
            : `/api/admin/dashboard/rides?status=${activeFilter}`;

        const response = await fetch(url, {
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
  }, [activeFilter]);

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-[#ee8d39]">
          Operations
        </p>

        <h1 className="text-3xl font-black tracking-tight text-[#0F172A]">
          All Rides
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor and manage all ride requests from one place.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "active", "completed", "cancelled"] as const).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold capitalize transition-all ${
                activeFilter === filter
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-[#0F172A]/5 hover:text-[#0F172A]"
              }`}
            >
              {filter}
            </button>
          ),
        )}
      </div>

      {/* Ride History Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-[#0F172A]">
              Ride History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {rides.length} {rides.length === 1 ? "ride" : "rides"} found
            </p>
          </div>

          {/* Ride Count */}
          <div className="rounded-full bg-[#FFF3E8] px-4 py-2">
            <span className="text-sm font-bold text-[#ee8d39]">
              {rides.length}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-500">
              Loading rides...
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-red-600">
              {error}
            </p>
          </div>
        ) : rides.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-500">
              No rides found.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
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
                      className="border-b border-slate-100 transition-colors hover:bg-[#F8FAFC]"
                    >
                      {/* Ride */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E8] text-[#ee8d39]">
                            {getVehicleIcon(ride.vehicleType)}
                          </span>

                          <div>
                            <p className="text-sm font-bold capitalize text-[#0F172A]">
                              {ride.vehicleType}
                            </p>

                            <p className="mt-1 font-mono text-[11px] font-medium text-slate-400">
                              #{ride._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="min-w-[300px] px-6 py-5">
                        <div className="space-y-3">
                          <p className="flex items-start gap-2 text-sm font-medium text-slate-600">
                            <MapPin
                              size={16}
                              strokeWidth={2.5}
                              className="mt-0.5 shrink-0 text-emerald-600"
                            />

                            <span className="line-clamp-2">
                              {ride.pickupLocation.address}
                            </span>
                          </p>

                          <p className="flex items-start gap-2 text-sm font-medium text-slate-600">
                            <MapPin
                              size={16}
                              strokeWidth={2.5}
                              className="mt-0.5 shrink-0 text-red-500"
                            />

                            <span className="line-clamp-2">
                              {ride.dropoffLocation.address}
                            </span>
                          </p>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-[#0F172A]">
                          {getPersonName(ride.customer)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                      {/* Requested */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <p className="text-sm font-medium text-slate-500">
                          {formatDate(ride.requestedAt)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/dashboard/rides/${ride._id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#16253B] hover:shadow-md"
                        >
                          View
                          <ArrowRight
                            size={15}
                            strokeWidth={2.5}
                          />
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

