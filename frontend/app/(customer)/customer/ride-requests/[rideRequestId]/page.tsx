"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Navigation,
    Car,
    Bike,
    Truck,
    Bus,
    Clock,
    Route,
    Users,
    CheckCircle2,
    XCircle,
    Loader2,
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

const Page = ({
    params,
}: {
    params: Promise<{ rideRequestId: string }>;
}) => {
    const [rideRequestId, setRideRequestId] = useState("");
    const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getParams = async () => {
            const param = await params;
            setRideRequestId(param.rideRequestId);
        };

        getParams();
    }, [params]);

    useEffect(() => {
        if (!rideRequestId) return;

        const fetchRideRequest = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `/api/passenger/ride-requests/${rideRequestId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to fetch ride request"
                    );
                }

                setRideRequest(data.rideRequest);
            } catch (err) {
                console.error("Ride request fetch error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch ride request"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRideRequest();
    }, [rideRequestId]);

    const getVehicleIcon = () => {
        switch (rideRequest?.vehicleType) {
            case "Bike":
                return <Bike size={24} />;
            case "Truck":
                return <Truck size={24} />;
            case "Bus":
                return <Bus size={24} />;
            default:
                return <Car size={24} />;
        }
    };

    const getStatus = () => {
        switch (rideRequest?.status) {
            case "pending":
                return {
                    label: "Searching for Driver",
                    className:
                        "bg-amber-50 text-amber-700 border-amber-200",
                    icon: <Loader2 size={18} className="animate-spin" />,
                };

            case "accepted":
                return {
                    label: "Accepted",
                    className:
                        "bg-green-50 text-green-700 border-green-200",
                    icon: <CheckCircle2 size={18} />,
                };

            case "cancelled":
                return {
                    label: "Cancelled",
                    className: "bg-red-50 text-red-700 border-red-200",
                    icon: <XCircle size={18} />,
                };

            case "expired":
                return {
                    label: "Expired",
                    className:
                        "bg-slate-100 text-slate-600 border-slate-200",
                    icon: <Clock size={18} />,
                };

            default:
                return {
                    label: rideRequest?.status || "Unknown",
                    className:
                        "bg-slate-100 text-slate-600 border-slate-200",
                    icon: <Clock size={18} />,
                };
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleString("en-NP", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const status = getStatus();

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2
                        size={32}
                        className="mx-auto animate-spin text-[#0F172A]"
                    />
                    <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading ride request...
                    </p>
                </div>
            </div>
        );
    }

    if (!rideRequest) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-white px-4">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-[#0F172A]">
                        <MapPin size={28} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-[#0F172A]">
                        Ride Request Not Found
                    </h2>

                    {error && (
                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>
                    )}

                    <Link
                        href="/customer/ride-requests"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2c54]"
                    >
                        <ArrowLeft size={17} />
                        Back to Ride Requests
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/customer/ride-requests"
                    className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F172A]"
                >
                    <ArrowLeft size={17} />
                    Back to Ride Requests
                </Link>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-7 sm:px-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-300">
                                    Ride Request
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-white">
                                    Ride Request Details
                                </h1>
                            </div>

                            <div
                                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${status.className}`}
                            >
                                {status.icon}
                                {status.label}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <h2 className="mb-5 text-lg font-bold text-[#0F172A]">
                            Trip Details
                        </h2>

                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-white">
                                    <MapPin size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Pickup
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-800">
                                        {rideRequest.pickupLocation.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ee8d39] text-white">
                                    <Navigation size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Destination
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-800">
                                        {rideRequest.dropoffLocation.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 p-6 sm:p-8">
                        <h2 className="mb-5 text-lg font-bold text-[#0F172A]">
                            Request Information
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white">
                                    {getVehicleIcon()}
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Vehicle
                                    </p>

                                    <p className="font-bold text-[#0F172A]">
                                        {rideRequest.vehicleType ||
                                            "Not selected"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white">
                                    <Route size={21} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Distance
                                    </p>

                                    <p className="font-bold text-[#0F172A]">
                                        {rideRequest.distanceKm.toFixed(2)} km
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white">
                                    <Users size={21} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Passengers
                                    </p>

                                    <p className="font-bold text-[#0F172A]">
                                        {rideRequest.passengerCount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ee8d39] text-sm font-bold text-white">
                                    Rs
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Estimated Fare
                                    </p>

                                    <p className="font-bold text-[#0F172A]">
                                        Rs.{" "}
                                        {rideRequest.estimatedFare
                                            ? rideRequest.estimatedFare.toFixed(
                                                  2
                                              )
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 px-6 pb-6 sm:px-8 sm:pb-8">
                        <h2 className="mb-4 text-lg font-bold text-[#0F172A]">
                            Request Timeline
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock size={17} />
                                    <span className="text-xs font-semibold">
                                        Requested
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                                    {formatDate(rideRequest.createdAt)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <CheckCircle2 size={17} />
                                    <span className="text-xs font-semibold">
                                        Accepted
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                                    {formatDate(rideRequest.acceptedAt)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock size={17} />
                                    <span className="text-xs font-semibold">
                                        Expires
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                                    {formatDate(rideRequest.expiresAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;