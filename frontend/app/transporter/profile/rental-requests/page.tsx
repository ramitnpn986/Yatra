"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowRight,
    CalendarDays,
    Car,
    Clock,
    MapPin,
    RefreshCw,
    User,
} from "lucide-react";

interface Customer {
    _id: string;
    name: string;
    phone?: string;
    profileImage?: string;
}

interface Vehicle {
    _id: string;
    vehicleType: string;
    brand?: string;
    model?: string;
    numberPlate?: string;
    images?: string[];
}

interface Rental {
    _id: string;
    bookingNumber: string;
    customer: Customer;
    vehicle: Vehicle;
    vehicleType: string;
    rentalType: string;
    pickupLocation: {
        name?: string;
        address?: string;
    };
    destinations?: {
        name?: string;
        address?: string;
    }[];
    returnLocation: {
        name?: string;
        address?: string;
    };
    startDate: string;
    endDate: string;
    rentalDays: number;
    pricePerDay: number;
    totalPrice: number;
    securityDeposit: number;
    status: string;
    createdAt: string;
}

export default function RentalRequestsPage() {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRentals = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await fetch("/api/transporter/rentals", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to fetch rental requests"
                );
            }

            setRentals(data.rentals || []);
        } catch (error) {
            console.error("Rental requests error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load rental requests"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRentals();

        const handleNewRental = () => {
            fetchRentals(true);
        };

        window.addEventListener(
            "rental-request-received",
            handleNewRental
        );

        return () => {
            window.removeEventListener(
                "rental-request-received",
                handleNewRental
            );
        };
    }, []);

    const formatDate = (date: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusClasses = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-orange-100 text-orange-700";
            case "confirmed":
                return "bg-blue-100 text-blue-700";
            case "active":
                return "bg-green-100 text-green-700";
            case "completed":
                return "bg-gray-100 text-gray-700";
            case "rejected":
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white px-4 py-8 md:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="h-6 w-48 rounded bg-gray-200" />
                                <div className="mt-4 h-4 w-72 rounded bg-gray-100" />
                                <div className="mt-3 h-4 w-56 rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-4 py-8 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0a1f39] md:text-3xl">
                            Rental Requests
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            View and manage rental requests from customers.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchRentals(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2c54] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#11345f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </button>
                </div>

                {/* Empty state */}
                {rentals.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0a1f39]">
                            <Car className="h-8 w-8 text-white" />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#0a1f39]">
                            No rental requests
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            You currently do not have any rental requests.
                            New requests will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {rentals.map((rental) => (
                            <div
                                key={rental._id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* Card top */}
                                <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-lg font-bold text-[#0a1f39]">
                                                {rental.bookingNumber}
                                            </h2>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                    rental.status
                                                )}`}
                                            >
                                                {rental.status}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Requested{" "}
                                            {formatDate(rental.createdAt)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/transporter/profile/rental-requests/${rental._id}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2c54] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#11345f]"
                                    >
                                        View Details
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {/* Card body */}
                                <div className="grid gap-6 px-5 py-5 md:grid-cols-2 md:px-6 lg:grid-cols-4">
                                    {/* Customer */}
                                    <div className="flex gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a1f39]">
                                            <User className="h-5 w-5 text-white" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Customer
                                            </p>

                                            <p className="mt-1 truncate font-semibold text-[#0a1f39]">
                                                {rental.customer?.name ||
                                                    "Unknown customer"}
                                            </p>

                                            {rental.customer?.phone && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {rental.customer.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle */}
                                    <div className="flex gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a1f39]">
                                            <Car className="h-5 w-5 text-white" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Vehicle
                                            </p>

                                            <p className="mt-1 font-semibold text-[#0a1f39]">
                                                {rental.vehicle?.brand || ""}{" "}
                                                {rental.vehicle?.model || ""}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {rental.vehicle?.numberPlate ||
                                                    rental.vehicleType}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="flex gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a1f39]">
                                            <CalendarDays className="h-5 w-5 text-white" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Rental Period
                                            </p>

                                            <p className="mt-1 font-semibold text-[#0a1f39]">
                                                {formatDate(rental.startDate)}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                to{" "}
                                                {formatDate(rental.endDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ee8d39]">
                                            <span className="text-lg font-bold text-white">
                                                रु
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Total Price
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-[#0a1f39]">
                                                Rs.{" "}
                                                {Number(
                                                    rental.totalPrice || 0
                                                ).toLocaleString()}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {rental.rentalDays}{" "}
                                                {rental.rentalDays === 1
                                                    ? "day"
                                                    : "days"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Locations */}
                                <div className="grid gap-4 border-t border-gray-100 bg-gray-50 px-5 py-5 md:grid-cols-2 md:px-6">
                                    <div className="flex gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ee8d39]" />

                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Pickup
                                            </p>

                                            <p className="mt-1 font-medium text-[#0a1f39]">
                                                {rental.pickupLocation?.name ||
                                                    "Pickup location"}
                                            </p>

                                            {rental.pickupLocation?.address && (
                                                <p className="mt-1 truncate text-sm text-gray-500">
                                                    {
                                                        rental.pickupLocation
                                                            .address
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0a1f39]" />

                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Return
                                            </p>

                                            <p className="mt-1 font-medium text-[#0a1f39]">
                                                {rental.returnLocation?.name ||
                                                    "Return location"}
                                            </p>

                                            {rental.returnLocation?.address && (
                                                <p className="mt-1 truncate text-sm text-gray-500">
                                                    {
                                                        rental.returnLocation
                                                            .address
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Small footer */}
                                <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-3 text-xs text-gray-500 md:px-6">
                                    <Clock className="h-4 w-4" />
                                    {rental.rentalType === "with-driver"
                                        ? "With driver"
                                        : "Self drive"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}