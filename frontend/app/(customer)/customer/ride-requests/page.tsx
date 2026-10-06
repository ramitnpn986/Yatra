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
    pending: "bg-warning/10 text-warning border-warning/30",
    accepted: "bg-success/10 text-success border-success/30",
    expired: "bg-background text-text-muted border-border",
    cancelled: "bg-error/10 text-error border-error/30",
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
        <div className="mx-auto max-w-6xl overflow-x-hidden">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">
                        Ride Requests
                    </h1>
                </div>

                <button
                    onClick={fetchRideRequests}
                    disabled={loading}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
                    <RefreshCw
                        size={28}
                        className="mx-auto animate-spin text-primary"
                    />

                    <p className="mt-3 text-sm font-medium text-text-muted">
                        Loading ride requests...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
                    <p className="font-medium text-error">{error}</p>

                    <button
                        onClick={fetchRideRequests}
                        className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                        Try Again
                    </button>
                </div>
            ) : rideRequests.length === 0 ? (
                <div className="rounded-3xl border border-border bg-surface p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
                        <MapPin size={28} />
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-primary">
                        No ride requests
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                        You have not created any ride requests yet.
                    </p>

                    <Link
                        href="/dashboard"
                        className="mt-5 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
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
                                className="group overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                            >
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div className="flex min-w-0 flex-1 gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                                            <VehicleIcon size={22} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="font-bold text-primary">
                                                    {request.vehicleType || "Ride"}
                                                </h2>

                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[request.status]}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div className="mt-3 space-y-2 text-sm">
                                                <div className="flex items-start gap-2 min-w-0">
                                                    <MapPin
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-accent"
                                                    />

                                                    <span className="block min-w-0 truncate text-text-muted">
                                                        {
                                                            request
                                                                .pickupLocation
                                                                .address
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2 min-w-0">
                                                    <MapPin
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-error"
                                                    />

                                                    <span className="block min-w-0 truncate text-text-muted">
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

                                    <div className="flex shrink-0 items-center justify-between gap-6 border-t border-border pt-4 md:border-t-0 md:pt-0">
                                        <div className="text-sm">
                                            <div className="font-bold text-primary">
                                                Rs.{" "}
                                                {request.estimatedFare ?? "—"}
                                            </div>

                                            <div className="mt-1 flex items-center gap-1 text-text-muted">
                                                <Clock size={14} />
                                                {request.distanceKm.toFixed(1)}{" "}
                                                km
                                            </div>
                                        </div>

                                        <ArrowRight
                                            size={20}
                                            className="shrink-0 text-text-muted transition group-hover:translate-x-1 group-hover:text-accent"
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