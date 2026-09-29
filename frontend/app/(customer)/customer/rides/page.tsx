"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Car,
  Bike,
  Truck,
  Bus,
  MapPin,
  Navigation,
  Route,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import type { Ride, getVehicleIcon, getVehicleStyle } from "@/app/(customer)/components/CommonItems"
import { getStatus, formatDate } from "@/app/(customer)/components/CommonItems";



const Page = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/passenger/rides", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch rides"
          );
        }

        setRides(data.rides || []);
      } catch (err) {
        console.error("Fetch rides error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);



  const filteredRides = rides.filter((ride) => {
    const matchesStatus = statusFilter === "all" || ride.status === statusFilter;
    const searchText = search.toLowerCase();

    const matchesSearch = ride.pickupLocation.address.toLowerCase().includes(searchText) ||
      ride.dropoffLocation.address.toLowerCase().includes(searchText) ||
      ride.vehicleType.toLowerCase().includes(searchText) ||
      ride._id.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500"> Loading your rides... </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="mt-4 text-xl font-bold text-slate-800"> Unable to Load Rides </h2>
          <p className="mt-2 text-sm text-slate-500"> {error} </p>
          <button onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900"> My Rides </h1>
              <p className="mt-1 text-sm text-slate-700"> View your complete ride history </p>
            </div>

            <div className="text-sm text-slate-500">
              {rides.length}{" "}
              {rides.length === 1 ? "ride" : "rides"}
            </div>
          </div>
        </div>


        <div className="p-4 mb-6 shadow-sm rounded">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 text-black">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pickup, destination, vehicle..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#c3c2c2] text-sm outline-none"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-xl bg-slate-50 text-sm text-slate-700 outline-none "
            >
              <option value="all">  All Rides</option>
              <option value="confirmed"> Confirmed </option>
              <option value="driver_arriving"> Driver Arriving </option>
              <option value="driver_arrived"> Driver Arrived </option>
              <option value="started"> Ride Started </option>
              <option value="arrived_destination">  Arrived </option>
              <option value="completed"> Completed </option>
              <option value="cancelled"> Cancelled </option>
            </select>
          </div>
        </div>

        {filteredRides.length === 0 && (
          <div className="bg-white border border-slate-200 rounded p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Car size={30} className="text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              No rides found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {rides.length === 0
                ? "You haven't taken any rides yet."
                : "Try changing your search or filter."}
            </p>
          </div>
        )}


        <div className="space-y-4">
          {filteredRides.map((ride) => {
            const status = getStatus(ride.status);

            return (
              <Link
                key={ride._id}
                href={`/customer/rides/${ride._id}`}
                className="block bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition overflow-hidden"
              >
                <div className="p-5">

                  {/* Top */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${getVehicleStyle(
                          ride.vehicleType
                        )}`}
                      >
                        {getVehicleIcon(
                          ride.vehicleType
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {ride.vehicleType}
                        </p>

                        <p className="text-xs text-slate-400">
                          {formatDate(
                            ride.requestedAt
                          )}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full border text-xs font-semibold ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-green-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] uppercase font-semibold text-slate-400">  Pickup </p>
                        <p className="mt-1 text-sm font-medium text-slate-800 line-clamp-2"> {ride.pickupLocation.address} </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-center gap-2 text-slate-400">
                      <Route size={17} />
                      <span className="text-xs whitespace-nowrap"> {ride.distanceKm.toFixed(2)}{" "} km </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Navigation size={15} className="text-red-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] uppercase font-semibold text-slate-400"> Destination </p>
                        <p className="mt-1 text-sm font-medium text-slate-800 line-clamp-2">
                          {ride.dropoffLocation.address}
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users size={16} />
                      <span> {ride.passengerCount}{" "} passenger</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Route size={16} />
                      <span>{ride.distanceKm.toFixed(2)}{" "}km</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <span>
                        Rs.{" "} {(ride.finalFare ?? ride.estimatedFare).toFixed(2)}
                      </span>
                    </div>

                    <div className="ml-auto flex items-center gap-1 text-sm font-medium text-blue-600">
                      View Details
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
