"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    Bike,
    Bus,
    Car,
    Clock,
    MapPin,
    RefreshCw,
    Truck,
} from "lucide-react";

type RideStatus = "pending" | "accepted" | "expired" | "cancelled";

type RideRequest = {
    _id: string;
    pickupLocation: {
        address: string;
        type: "Point";
        coordinates: number[];
    };
    dropoffLocation: {
        address: string;
        type: "Point";
        coordinates: number[];
    };
    distanceKm: number;
    estimatedFare?: number;
    vehicleType?: "Bike" | "Car" | "Truck" | "Bus";
    passengerCount: number;
    status: RideStatus;
    expiresAt: string;
    acceptedBy?: string;
    acceptedAt?: string;
    cancelledAt?: string;
    createdAt: string;
};

const statusStyles: Record<RideStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-green-50 text-green-700 border-green-200",
    expired: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
};

const vehicleIcons = {
    Bike,
    Car,
    Truck,
    Bus,
};

const RideRequestsPage = () => {
    const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRideRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("/api/passenger/ride-requests", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to fetch ride requests"
                );
            }

            setRideRequests(data.rideRequests || []);
        } catch (err) {
            console.error("Error occurred while fetching rides:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch ride requests"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRideRequests();
    }, []);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                        Ride Requests
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and track all your ride requests.
                    </p>
                </div>

                <button
                    onClick={fetchRideRequests}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:border-[#0F172A] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <RefreshCw
                        size={28}
                        className="mx-auto animate-spin text-[#0F172A]"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading ride requests...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                    <p className="font-medium text-red-700">{error}</p>

                    <button
                        onClick={fetchRideRequests}
                        className="mt-4 rounded-xl bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2c54]"
                    >
                        Try Again
                    </button>
                </div>
            ) : rideRequests.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-[#0F172A]">
                        <MapPin size={28} />
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-[#0F172A]">
                        No ride requests
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        You have not created any ride requests yet.
                    </p>

                    <Link
                        href="/dashboard"
                        className="mt-5 inline-flex rounded-xl bg-[#ee8d39] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#EA7D24]"
                    >
                        Book a Ride
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {rideRequests.map((request) => {
                        const VehicleIcon = request.vehicleType
                            ? vehicleIcons[request.vehicleType]
                            : Car;

                        return (
                            <Link
                                key={request._id}
                                href={`/customer/ride-requests/${request._id}`}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0F172A]/30 hover:shadow-md"
                            >
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-white">
                                            <VehicleIcon size={22} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="font-bold text-[#0F172A]">
                                                    {request.vehicleType || "Ride"}
                                                </h2>

                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[request.status]}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div className="mt-3 space-y-2 text-sm">
                                                <div className="flex items-start gap-2">
                                                    <MapPin
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-[#ee8d39]"
                                                    />

                                                    <span className="truncate text-slate-600">
                                                        {
                                                            request
                                                                .pickupLocation
                                                                .address
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <MapPin
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-red-500"
                                                    />

                                                    <span className="truncate text-slate-600">
                                                        {
                                                            request
                                                                .dropoffLocation
                                                                .address
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                                        <div className="text-sm">
                                            <div className="font-bold text-[#0F172A]">
                                                Rs.{" "}
                                                {request.estimatedFare ?? "—"}
                                            </div>

                                            <div className="mt-1 flex items-center gap-1 text-slate-500">
                                                <Clock size={14} />
                                                {request.distanceKm.toFixed(1)}{" "}
                                                km
                                            </div>
                                        </div>

                                        <ArrowRight
                                            size={20}
                                            className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#ee8d39]"
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RideRequestsPage;