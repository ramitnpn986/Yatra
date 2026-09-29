"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Navigation, Car, Bike, Truck,
  Bus, Clock, Route, Users, IndianRupee, CheckCircle2,
  XCircle, Loader2,
} from "lucide-react";

interface Location {
  address: string;
  type: string;
  coordinates: number[];
}

interface RideRequest {
  _id: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  distanceKm: number;
  estimatedFare?: number;
  vehicleType?: "Bike" | "Car" | "Truck" | "Bus";
  passengerCount: number;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: string;
  acceptedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}



const Page = ({ params }: { params: Promise<{ rideRequestId: string }> }) => {

  const [rideRequestId, setRideRequestId] = useState<string>("");
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getParams = async () => {
      const param = await params;
      setRideRequestId(param.rideRequestId)
    }
    getParams()
  }, [params])


  useEffect(() => {
    if (!rideRequestId) return;

    const fetchRideRequest = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/passenger/ride-requests/${rideRequestId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch ride request");
        }

        setRideRequest(data.rideRequest);

      } catch (err) {
        console.error("Ride request fetch error:", err);
      } finally {
        setLoading(false)
      }
    }

    fetchRideRequest();

  }, [rideRequestId])


  const getVehicleIcon = () => {
    switch (rideRequest?.vehicleType) {
      case "Bike":
        return <Bike size={28} />;
      case "Truck":
        return <Truck size={28} />;
      case "Bus":
        return <Bus size={28} />;
      default:
        return <Car size={28} />;
    }
  };

  const getStatus = () => {
    switch (rideRequest?.status) {
      case "pending":
        return { label: "Searching for Driver", className: "bg-amber-50 text-amber-700 border-amber-200", icon: <Loader2 size={18} className="animate-spin" />, };
      case "accepted":
        return { label: "Accepted", className: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 size={18} />, };
      case "cancelled":
        return { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={18} />, };
      case "expired":
        return { label: "Expired", className: "bg-gray-50 text-gray-700 border-gray-200", icon: <Clock size={18} />, };
      default:
        return { label: rideRequest?.status || "Unknown", className: "bg-gray-50 text-gray-700 border-gray-200", icon: <Clock size={18} />, };
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return " ";
    return new Date(date).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short", });
  };

  const status = getStatus();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500"> Loading ride request... </p>
      </div>
    )
  }

  if (!rideRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold text-slate-800"> Ride Request Not Found </h2>
        <Link href="/customer/ride-requests" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition" >
          <ArrowLeft size={17} /> Back to Ride Requests
        </Link>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500"> Ride Request </p>
                <h1 className="text-2xl font-bold text-slate-900 mt-1"> Ride Request Details </h1>
              </div>
              <div className={`inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border text-sm font-semibold ${status.className}`} >
                {status.icon} {status.label}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Trip Details</h2>
            <div className="relative">

              <div className="relative flex gap-4">
                <div className="pb-7">
                  <p className="text-xs font-medium text-slate-400">Pickup</p>
                  <p className="mt-1 font-semibold text-slate-800">{rideRequest.pickupLocation.address}</p>
                </div>
              </div>


              <div className="relative flex gap-4">
                <div className="pb-7">
                  <p className="text-xs font-medium text-slate-400">Destination</p>
                  <p className="mt-1 font-semibold text-slate-800">{rideRequest.dropoffLocation.address}</p>
                </div>
              </div>


            </div>

          </div>

          <div className="p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Request Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"> {getVehicleIcon()} </div>
                <div>
                  <p className="text-sm text-slate-400">Vehicle</p>
                  <p className="font-semibold text-slate-800">{rideRequest.vehicleType || "Not selected"}</p>
                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"> <Route size={23} /></div>
                <div>
                  <p className="text-sm text-slate-400"> Distance </p>
                  <p className="font-semibold text-slate-800"> {rideRequest.distanceKm.toFixed(2)}{" "} km </p>
                </div>

              </div>


              <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"> <Users size={23} /></div>
                <div>
                  <p className="text-sm text-slate-400"> Passengers </p>
                  <p className="font-semibold text-slate-800"> {rideRequest.passengerCount}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 text-green-600 flex items-center justify-center p-2">
                  Rs:
                </div>
                <div>
                  <p className="text-xs text-slate-400"> Estimated Fare </p>
                  <p className="font-semibold text-slate-800"> Rs.{" "} {rideRequest.estimatedFare ? rideRequest.estimatedFare.toFixed(2) : "—"} </p>
                </div>
              </div>


            </div>

          </div>

          <div className="px-6 pb-6">
            <h2 className="font-semibold text-slate-900 mb-4"> Request Timeline </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={17} /> <span className="text-xs"> Requested </span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {formatDate(rideRequest.createdAt)} </p>
              </div> <div className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 size={17} />
                  <span className="text-xs"> Accepted </span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-800"> {formatDate(rideRequest.acceptedAt)} </p> </div> <div className="border border-slate-100 rounded-xl p-4"> <div className="flex items-center gap-2 text-slate-500"> <Clock size={17} /> <span className="text-xs"> Expires </span> </div> <p className="mt-2 text-sm font-medium text-slate-800">
                  {formatDate(rideRequest.expiresAt)} </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  )
}

export default Page