"use client";

import { useEffect, useState } from "react";

import { Ride,  getStatus,  formatDate,  getVehicleIcon,} from "@/app/(customer)/components/CommonItems";

import {
    CheckCircle2,
    UserRound,
    XCircle,
    MapPin,
    Navigation,
    Route,
    Users,
    IndianRupee,
    Loader2,
} from "lucide-react";

const Page = ({  params }: { params: Promise<{ rideId: string }>;}) => {
    const [rideId, setRideId] = useState("");
    const [ride, setRide] = useState<Ride | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getParams = async () => {
            const param = await params;
            setRideId(param.rideId);
        };

        getParams();
    }, [params]);

    useEffect(() => {
        if (!rideId) return;

        const fetchRide = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`/api/passenger/rides/${rideId}`, {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(  data.message || "Failed to fetch ride" );
                }
                setRide(data.ride);
            } catch (err) {
                console.error("Fetch ride error:", err);
                setError( err instanceof Error  ? err.message  : "Failed to fetch ride");
            } finally {
                setLoading(false);
            }
        };

        fetchRide();
    }, [rideId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2  size={32}  className="animate-spin text-blue-600"/>
                    <p className="text-sm text-slate-500">  Loading ride details... </p>
                </div>
            </div>
        );
    }

    if (error || !ride) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                    <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <XCircle
                            size={28}
                            className="text-red-500"
                        />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-800"> Unable to Load Ride </h2>
                    <p className="mt-2 text-sm text-slate-500"> {error || "Ride not found."} </p>
                    <button  onClick={() => window.location.reload()}  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const status = getStatus(ride.status);

    const timeline = [
        {
            label: "Ride Requested",
            date: ride.requestedAt,
            completed: !!ride.requestedAt,
        },
        {
            label: "Driver Accepted",
            date: ride.acceptedAt,
            completed: !!ride.acceptedAt,
        },
        {
            label: "Driver Arrived",
            date: ride.driverArrivedAt,
            completed: !!ride.driverArrivedAt,
        },
        {
            label: "Ride Started",
            date: ride.startedAt,
            completed: !!ride.startedAt,
        },
        {
            label: "Arrived at Destination",
            date: ride.arrivedDestinationAt,
            completed: !!ride.arrivedDestinationAt,
        },
        {
            label: "Ride Completed",
            date: ride.completedAt,
            completed: !!ride.completedAt,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    {getVehicleIcon( ride.vehicleType)}
                                </div>

                                <div>
                                    <p className="text-sm text-slate-400">{ride.vehicleType}</p>
                                    <h1 className="text-2xl font-bold text-slate-900"> Ride Details</h1>
                                </div>
                            </div>

                            <div className={`inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border text-sm font-semibold ${status.className}`}>
                                {status.icon}
                                {status.label}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900 mb-5">  Trip Route </h2>

                        <div className="relative">
                            <div className="absolute left-[11px] top-7 bottom-7 w-px bg-slate-200" />
                            <div className="relative flex gap-4">
                                <div className="relative z-10 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <MapPin size={15}  className="text-green-600" />
                                </div>

                                <div className="pb-8">
                                    <p className="text-xs font-semibold uppercase text-slate-400"> Pickup Location </p>
                                    <p className="mt-1 font-medium text-slate-800">   { ride.pickupLocation.address} </p>
                                </div>
                            </div>

                            <div className="relative flex gap-4">
                                <div className="relative z-10 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <Navigation size={14} className="text-red-600"/>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">  Destination </p>
                                    <p className="mt-1 font-medium text-slate-800">  { ride.dropoffLocation.address } </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="p-6 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900 mb-5">  Ride Information </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs text-slate-400">  Vehicle </p>

                                <div className="flex items-center gap-2 mt-2">
                                    {getVehicleIcon(ride.vehicleType)}

                                    <p className="font-semibold text-slate-800"> {ride.vehicleType}</p>
                                </div>
                            </div>

    
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs text-slate-400">  Distance</p>

                                <div className="flex items-center gap-2 mt-2">
                                    <Route size={21} className="text-purple-600"/>

                                    <p className="font-semibold text-slate-800">
                                        {ride.distanceKm.toFixed( 2)}{" "}
                                        km
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs text-slate-400">  Passengers</p>

                                <div className="flex items-center gap-2 mt-2">
                                    <Users size={21} className="text-orange-600"/>
                                    <p className="font-semibold text-slate-800"> {ride.passengerCount}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs text-slate-400"> Fare </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <IndianRupee  size={21}  className="text-green-600" />
                                    <p className="font-semibold text-slate-800">
                                        Rs.{" "} {( ride.finalFare ?? ride.estimatedFare).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

    
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900 mb-4"> Transporter</h2>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                <UserRound size={22} className="text-slate-500"/>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400"> Transporter ID</p>
                                <p className="text-sm font-medium text-slate-800 font-mono break-all"> {ride.transporter}</p>
                            </div>
                        </div>
                    </div>


                    <div className="p-6">
                        <h2 className="font-semibold text-slate-900 mb-6">  Ride Timeline </h2>

                        <div className="relative">
                            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-slate-200" />
                            <div className="space-y-6">
                                {timeline.map((item) => (
                                    <div key={item.label} className="relative flex gap-4">
                                        <div  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? "bg-green-100" : "bg-slate-100"}`}>
                                            <CheckCircle2  size={15}  className={item.completed? "text-green-600": "text-slate-300"}/>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                <p className={`text-sm font-medium ${item.completed? "text-slate-800": "text-slate-400"}`}>
                                                    {item.label}
                                                </p>

                                                <p className="text-xs text-slate-400"> {formatDate(item.date)} </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {ride.status === "cancelled" && (
                        <div className="px-6 pb-6">
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                <div className="flex items-center gap-2">
                                    <XCircle size={19} className="text-red-500"/>
                                    <p className="font-semibold text-red-700">  </p>
                                </div>

                                <p className="mt-1 text-sm text-red-600">  Cancelled by{" "}{ride.cancelledBy ||"unknown"}</p>
                                <p className="mt-1 text-xs text-red-500">  {formatDate(ride.cancelledAt)} </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;

