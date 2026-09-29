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

interface Location {
  address: string;
  type: string;
  coordinates: number[];
}

interface Ride {
  _id: string;
  rideRequest: string;
  customer: string;
  transporter: string;

  pickupLocation: Location;
  dropoffLocation: Location;

  distanceKm: number;
  estimatedFare: number;
  finalFare?: number;

  vehicleType: "Bike" | "Car" | "Truck" | "Bus";
  passengerCount: number;

  status: | "confirmed" | "driver_arriving" | "driver_arrived"
          | "started" | "arrived_destination" | "completed" | "cancelled";

  cancelledBy?: "customer" | "transporter" | "admin";

  requestedAt: string;
  acceptedAt?: string;
  driverArrivedAt?: string;
  startedAt?: string;
  arrivedDestinationAt?: string;
  completedAt?: string;
  cancelledAt?: string;

  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  count: number;
  rides: Ride[];
}

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

        const data: ApiResponse = await res.json();

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

  const getVehicleIcon = (vehicleType: Ride["vehicleType"]) => {
    switch (vehicleType) {
      case "Bike":
        return <Bike size={22} />;

      case "Truck":
        return <Truck size={22} />;

      case "Bus":
        return <Bus size={22} />;

      case "Car":
      default:
        return <Car size={22} />;
    }
  };

  const getVehicleStyle = ( vehicleType: Ride["vehicleType"]) => {
    switch (vehicleType) {
      case "Bike":
        return "bg-orange-50 text-orange-600";

      case "Truck":
        return "bg-purple-50 text-purple-600";

      case "Bus":
        return "bg-indigo-50 text-indigo-600";
   
      default:
        return "bg-blue-50 text-blue-600";
    }
  };

  const getStatus = (status: Ride["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          className:"bg-blue-50 text-blue-700 border-blue-200",
          icon: <CheckCircle2 size={15} />,
        };

      case "driver_arriving":
        return {
          label: "Driver Arriving",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Navigation size={15} />,
        };

      case "driver_arrived":
        return {
          label: "Driver Arrived",
          className: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <MapPin size={15} />,
        };

      case "started":
        return {
          label: "Ride Started",
          className: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: <Route size={15} />,
        };

      case "arrived_destination":
        return {
          label: "Arrived",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 size={15} />,
        };

      case "completed":
        return {
          label: "Completed",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 size={15} />,
        };

      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={15} />,
        };

      default:
        return {
          label: status,
          className:"bg-gray-50 text-gray-700 border-gray-200",
          icon: <Clock size={15} />,
        };
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return " ";

    return new Date(date).toLocaleString("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

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
              <p className="mt-1 text-sm text-slate-500"> View your complete ride history </p>
            </div>

            <div className="text-sm text-slate-500">
              {rides.length}{" "}
              {rides.length === 1? "ride": "rides"}
            </div>
          </div>
        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>

              <input type="text" value={search} onChange={(e) =>setSearch(e.target.value)}
                placeholder="Search pickup, destination, vehicle..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 text-sm outline-none"
              />
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
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Car size={30} className="text-slate-400"/>
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
                        <MapPin size={16} className="text-green-600"/>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] uppercase font-semibold text-slate-400">  Pickup </p>
                        <p className="mt-1 text-sm font-medium text-slate-800 line-clamp-2"> { ride.pickupLocation.address } </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-center gap-2 text-slate-400">
                      <Route size={17} />
                      <span className="text-xs whitespace-nowrap"> {ride.distanceKm.toFixed(2)}{" "} km </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Navigation size={15} className="text-red-600"/>
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
                      <Users size={16}/>
                      <span> { ride.passengerCount }{" "} passenger</span>
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

