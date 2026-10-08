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
    Wallet,
} from "lucide-react";

interface Customer {
    _id: string;
    name: string;
    phone?: string;
    profileImage?: string | { url?: string };
}

interface Vehicle {
    _id: string;
    vehicleType: string;
    brand?: string;
    model?: string;
    numberPlate?: string;
    images?: string[];
}

interface RentalLocation {
    name?: string;
    address?: string;
}

interface Rental {
    _id: string;
    bookingNumber: string;
    customer?: Customer;
    vehicle?: Vehicle;
    vehicleType: string;
    rentalType: string;

    pickupLocation?: RentalLocation;

    destinations?: RentalLocation[];

    returnLocation?: RentalLocation;

    startDate: string;
    endDate: string;
    rentalDays: number;
    pricePerDay: number;
    totalPrice: number;
    securityDeposit: number;

    status: string;
    createdAt: string;
}

const PLACEHOLDER_IMAGE = "/vehicle-placeholder.jpg";

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

        return new Date(date).toLocaleDateString("en-NP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (value: number) =>
        `Rs. ${Number(value || 0).toLocaleString("en-NP")}`;

    const formatVehicleName = (vehicle?: Vehicle) => {
        if (!vehicle) return "Vehicle";

        const name = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();

        return name || vehicle.vehicleType || "Vehicle";
    };

    const getStatusClasses = (status: string) => {
        switch ((status || "").toLowerCase()) {
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

    const getVehicleImage = (vehicle?: Vehicle) => {
        if (vehicle?.images && vehicle.images.length > 0) {
            return vehicle.images[0];
        }

        return PLACEHOLDER_IMAGE;
    };

    const getCustomerImage = (customer?: Customer) => {
        const image = customer?.profileImage;

        if (!image) return "";

        return typeof image === "string" ? image : image.url || "";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="animate-pulse rounded-3xl bg-[#0a1f39] px-6 py-10 md:px-10">
                        <div className="h-5 w-32 rounded bg-white/20" />

                        <div className="mt-4 h-10 w-80 rounded bg-white/20" />

                        <div className="mt-4 h-5 w-full max-w-2xl rounded bg-white/10" />
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-3xl bg-white shadow-sm"
                            >
                                <div className="h-52 animate-pulse bg-gray-200" />

                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                                    <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                                    <div className="h-11 animate-pulse rounded-xl bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1f39] via-[#0f2d52] to-[#071526] px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-[#ee8d39]/10" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                <Car className="h-4 w-4 text-[#ee8d39]" />
                                Transporter Dashboard
                            </div>

                            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                                Rental Requests
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300 md:text-base">
                                View customer rental requests, check all booking
                                details, and manage your vehicle rentals from
                                one place.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchRentals(true)}
                            disabled={refreshing}
                            className="relative inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#ee8d39] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#df7d2c] disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    refreshing ? "animate-spin" : ""
                                }`}
                            />
                            {refreshing ? "Refreshing..." : "Refresh Requests"}
                        </button>
                    </div>
                </section>

                <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
                            Your Requests
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-[#0a1f39] md:text-3xl">
                            Rental Bookings
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {rentals.length === 0
                                ? "No rental requests at the moment."
                                : `${rentals.length} rental ${
                                      rentals.length === 1
                                          ? "request"
                                          : "requests"
                                  } available.`}
                        </p>
                    </div>

                    {rentals.length > 0 && (
                        <div className="hidden rounded-xl bg-white px-4 py-3 shadow-sm sm:block">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Total Requests
                            </p>

                            <p className="mt-1 text-xl font-bold text-[#0a1f39]">
                                {rentals.length}
                            </p>
                        </div>
                    )}
                </div>

                {rentals.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0a1f39]">
                            <Car className="h-9 w-9 text-white" />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-[#0a1f39]">
                            No rental requests
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                            You currently do not have any rental requests.
                            New customer requests will appear here
                            automatically.
                        </p>

                        <button
                            type="button"
                            onClick={() => fetchRentals(true)}
                            disabled={refreshing}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0b2c54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#11345f] disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    refreshing ? "animate-spin" : ""
                                }`}
                            />
                            Check Again
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rentals.map((rental) => (
                            <article
                                key={rental._id}
                                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative h-52 overflow-hidden bg-gray-100">
                                    <img
                                        src={getVehicleImage(rental.vehicle)}
                                        alt={formatVehicleName(rental.vehicle)}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null;
                                            event.currentTarget.src =
                                                PLACEHOLDER_IMAGE;
                                        }}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-[#0a1f39] shadow-sm">
                                        {rental.vehicleType || "Vehicle"}
                                    </div>

                                    <div
                                        className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold capitalize shadow-sm ${getStatusClasses(
                                            rental.status
                                        )}`}
                                    >
                                        {rental.status}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-xs font-medium text-white/70">
                                            Booking Number
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-white">
                                            {rental.bookingNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#0a1f39]">
                                            {formatVehicleName(rental.vehicle)}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {rental.vehicle?.numberPlate ||
                                                rental.vehicleType}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0a1f39]">
                                            {getCustomerImage(rental.customer) ? (
                                                <img
                                                    src={getCustomerImage(
                                                        rental.customer
                                                    )}
                                                    alt={
                                                        rental.customer?.name ||
                                                        "Customer"
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-white" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Customer
                                            </p>

                                            <p className="truncate text-sm font-semibold text-[#0a1f39]">
                                                {rental.customer?.name ||
                                                    "Unknown customer"}
                                            </p>

                                            {rental.customer?.phone && (
                                                <p className="text-xs text-gray-500">
                                                    {rental.customer.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-gray-100 p-3">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-[#ee8d39]" />

                                                <span className="text-xs font-medium text-gray-400">
                                                    Start
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-[#0a1f39]">
                                                {formatDate(rental.startDate)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 p-3">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-[#ee8d39]" />

                                                <span className="text-xs font-medium text-gray-400">
                                                    Duration
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-[#0a1f39]">
                                                {rental.rentalDays}{" "}
                                                {rental.rentalDays === 1
                                                    ? "day"
                                                    : "days"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                                        <div className="flex gap-3">
                                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ee8d39]" />

                                            <div className="min-w-0">
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                    Pickup Location
                                                </p>

                                                <p className="mt-1 truncate text-sm font-semibold text-[#0a1f39]">
                                                    {rental.pickupLocation
                                                        ?.name ||
                                                        rental.pickupLocation
                                                            ?.address ||
                                                        "Pickup location"}
                                                </p>

                                                {rental.pickupLocation?.name &&
                                                    rental.pickupLocation
                                                        ?.address && (
                                                        <p className="mt-1 truncate text-xs text-gray-500">
                                                            {
                                                                rental
                                                                    .pickupLocation
                                                                    .address
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                                        <div className="flex gap-3">
                                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0a1f39]" />

                                            <div className="min-w-0">
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                    Return Location
                                                </p>

                                                <p className="mt-1 truncate text-sm font-semibold text-[#0a1f39]">
                                                    {rental.returnLocation
                                                        ?.name ||
                                                        rental.returnLocation
                                                            ?.address ||
                                                        "Return location"}
                                                </p>

                                                {rental.returnLocation?.name &&
                                                    rental.returnLocation
                                                        ?.address && (
                                                        <p className="mt-1 truncate text-xs text-gray-500">
                                                            {
                                                                rental
                                                                    .returnLocation
                                                                    .address
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#0a1f39] p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ee8d39]">
                                                <Wallet className="h-5 w-5 text-white" />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Total Price
                                                </p>

                                                <p className="text-lg font-bold text-white">
                                                    {formatCurrency(
                                                        rental.totalPrice
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">
                                                Per Day
                                            </p>

                                            <p className="text-sm font-semibold text-white">
                                                {formatCurrency(
                                                    rental.pricePerDay
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            {rental.rentalType === "with-driver"
                                                ? "With driver"
                                                : "Self drive"}
                                        </span>

                                        <span>
                                            Deposit:{" "}
                                            {formatCurrency(
                                                rental.securityDeposit
                                            )}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/transporter/profile/rental-requests/${rental._id}`}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2c54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#11345f]"
                                    >
                                        View Rental Details
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}