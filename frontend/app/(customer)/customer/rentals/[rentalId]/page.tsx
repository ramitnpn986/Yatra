
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    CarFront,
    CheckCircle2,
    Clock3,
    CreditCard,
    MapPin,
    Navigation,
    Package,
    RefreshCw,
    Route,
    ShieldCheck,
    UserRound,
    Users,
    Wallet,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/app/(customer)/components/StatusBadge";
import { InfoItem } from "@/app/(customer)/components/InfoItem";
import LocationItem from "@/app/(customer)/components/LocationItem";



type Customer = {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
};

type Transporter = {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    location?: Location;
};

type Vehicle = {
    _id?: string;
    vehicleType?: string;
    brand?: string;
    model?: string;
    numberPlate?: string;
    images?: string[];
    seats?: number;
    capacityKg?: number;
    year?: number;
};

type RentalRequest = {
    _id: string;
    bookingNumber: string;
    customer: Customer | string;
    transporter: Transporter | string;
    vehicle: Vehicle | string;
    vehicleType: string;
    rentalType: "self-drive" | "with-driver";
    pickupLocation: Location;
    destinations: Location[];
    returnLocation: Location;
    totalPassengers: number;
    totalEstimatedDistanceKm: number;
    estimatedDurationMinutes?: number;
    startDate: string;
    endDate: string;
    rentalDays: number;
    status: string;
    rejectedReason?: string;
    baseRentalPrice: number;
    includedDistanceKm: number;
    extraDistanceKm: number;
    extraDistanceCost: number;
    driverCost: number;
    pricePerDay: number;
    totalPrice: number;
    securityDeposit: number;
    cancelledBy?: string;
    cancelledReason?: string;
    documentsSubmitted: boolean;
    paymentStatus: string;
    requestedAt: string;
    acceptedAt?: string;
    rejectedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    createdAt?: string;
    updatedAt?: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    data?: RentalRequest;
};

const money = (amount?: number) => `Rs. ${(amount ?? 0).toLocaleString("en-IN")}`;

const formatDate = (value?: string) => {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value?: string) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatStatus = (value?: string) =>
    value ? value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Unknown";



export default function RentalRequestDetailsPage() {
    const params = useParams<{ rentalId: string }>();
    const rentalId = params.rentalId;

    const [rental, setRental] = useState<RentalRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRental = useCallback(async () => {
        if (!rentalId) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/customer/rental/request/${encodeURIComponent(rentalId)}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const result: ApiResponse = await response.json();

            if (!response.ok || !result.success || !result.data) {
                throw new Error(
                    result.message || "Unable to load rental request details."
                );
            }

            setRental(result.data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading the booking."
            );
        } finally {
            setLoading(false);
        }
    }, [rentalId]);

    useEffect(() => {
        void fetchRental();
    }, [fetchRental]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                    <div className="h-8 w-56 rounded-lg bg-gray-200" />
                    <div className="h-44 rounded-2xl bg-gray-200" />
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="h-72 rounded-2xl bg-gray-200" />
                        <div className="h-72 rounded-2xl bg-gray-200" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !rental) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <XCircle
                        size={44}
                        className="mx-auto text-red-500"
                    />
                    <h1 className="mt-4 text-xl font-bold text-gray-900">
                        Unable to load booking
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {error || "Rental request not found."}
                    </p>

                    <button
                        onClick={() => void fetchRental()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <div className="mt-4">
                        <Link
                            href="/customer/rental"
                            className="text-sm font-medium text-gray-600 hover:text-orange-600"
                        >
                            Back to rentals
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const vehicle = typeof rental.vehicle === "object" ? rental.vehicle : null;
    const customer = typeof rental.customer === "object" ? rental.customer : null;
    const transporter = typeof rental.transporter === "object" ? rental.transporter : null;

    const vehicleName = [vehicle?.brand, vehicle?.model,].filter(Boolean).join(" ") || rental.vehicleType;

    const routeLocations = [
        {
            location: rental.pickupLocation,
            label: "Pickup location",
        },
        ...(rental.destinations ?? []).map((location, index) => ({
            location,
            label: `Destination ${index + 1}`,
        })),
        {
            location: rental.returnLocation,
            label: "Return location",
        },
    ];

    const duration = rental.estimatedDurationMinutes;

    const durationLabel =
        duration == null
            ? "Not available"
            : duration >= 60
                ? `${Math.floor(duration / 60)} hr ${duration % 60} min`
                : `${duration} min`;

    return (
        <main className="min-h-screen bg-gray-50 pb-12">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 p-6 text-white shadow-lg sm:p-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-orange-200">
                                Vehicle rental booking
                            </div>

                            <h1 className="mt-3 break-all text-2xl font-bold sm:text-3xl">
                                {rental.bookingNumber}
                            </h1>

                            <p className="mt-2 text-sm text-gray-300">
                                Requested on {formatDateTime(rental.requestedAt)}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <StatusBadge value={rental.status} />
                                <StatusBadge value={rental.paymentStatus} />
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/15 bg-white/10 p-5 sm:min-w-52">
                            <p className="text-sm text-gray-300">
                                Total estimated price
                            </p>
                            <p className="mt-2 text-3xl font-bold">
                                {money(rental.totalPrice)}
                            </p>
                            <p className="mt-2 text-xs text-gray-300">
                                Security deposit: {money(rental.securityDeposit)}
                            </p>
                        </div>
                    </div>
                </div>


                {rental.status === "rejected" && rental.rejectedReason && (
                    <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <XCircle className="mt-0.5 shrink-0" size={20} />
                        <div>
                            <p className="font-semibold">Request rejected</p>
                            <p className="mt-1">{rental.rejectedReason}</p>
                        </div>
                    </div>
                )}

                {rental.status === "cancelled" && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                        <p className="font-semibold">This booking has been cancelled.</p>
                        {rental.cancelledBy && (
                            <p className="mt-1"> Cancelled by: {formatStatus(rental.cancelledBy)} </p>
                        )}
                    </div>
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                    <CarFront size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Vehicle details
                                </h2>
                            </div>
                            <div className="flex flex-col gap-5 sm:flex-row">
                                <div className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:w-56">
                                    {vehicle?.images?.[0] ? (
                                        <Image
                                            src={vehicle.images[0]}
                                            alt={vehicleName}
                                            width={448}
                                            height={176}
                                            className="h-full w-full object-cover"
                                            sizes="(max-width: 640px) 100vw, 224px"
                                        />
                                    ) : (
                                        <CarFront
                                            size={64}
                                            className="text-gray-300"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-bold text-gray-900"> {vehicleName} </h3>

                                    {vehicle?.numberPlate && (
                                        <div className="mt-3 inline-block rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold tracking-wider text-gray-800">
                                            {vehicle.numberPlate}
                                        </div>
                                    )}

                                    <div className="mt-5 grid grid-cols-2 gap-4">
                                        <InfoItem label="Model year" value={vehicle?.year ?? "—"} />
                                        <InfoItem label="Seats" value={vehicle?.seats ?? "—"} />
                                        <InfoItem
                                            label="Load capacity"
                                            value={vehicle?.capacityKg != null ? `${vehicle.capacityKg.toLocaleString()} kg` : "—"}
                                        />
                                        <InfoItem
                                            label="Rental type"
                                            value={formatStatus(rental.rentalType)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                    <Route size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Your journey
                                </h2>
                            </div>
                            <div className="mb-5 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
                                <InfoItem label="Distance" value={`${rental.totalEstimatedDistanceKm.toLocaleString()} km`}
                                />
                                <InfoItem label="Travel time" value={durationLabel} />
                                <InfoItem
                                    label="Passengers"
                                    value={
                                        <span className="inline-flex items-center gap-1">
                                            <Users size={15} />
                                            {rental.totalPassengers}
                                        </span>
                                    }
                                />
                                <InfoItem
                                    label="Rental days"
                                    value={rental.rentalDays}
                                />
                            </div>

                            <div className="pt-2">
                                {routeLocations.map((item, index) => (
                                    <LocationItem
                                        key={`${item.label}-${index}`}
                                        location={item.location}
                                        label={item.label}
                                        index={index}
                                    />
                                ))}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Coordinates are shown as latitude, longitude.
                                The stored coordinate order is longitude, latitude.
                            </p>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                    <CalendarDays size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Rental schedule
                                </h2>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        Start date
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-gray-900">
                                        {formatDate(rental.startDate)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        End date
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-gray-900">
                                        {formatDate(rental.endDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-3 rounded-xl  p-2">
                                <p className="font-semibold text-gray-900">
                                    {rental.rentalDays}{" "}
                                    {rental.rentalDays === 1 ? "day" : "days"} rental
                                </p>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                        <UserRound size={18} />
                                    </div>
                                    <h2 className="text-sm font-bold text-gray-900">
                                        Customer and transporter
                                    </h2>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="rounded-xl border border-gray-200 p-4">
                                        <p className="text-xs font-semibold capitalized tracking-wide text-gray-500">
                                            Customer
                                        </p>
                                        <h3 className="mt-3 font-bold text-gray-900">
                                            {customer?.name || "Customer details unavailable"}
                                        </h3>
                                        {customer?.email && (
                                            <p className="mt-2 break-all text-sm text-gray-600">
                                                {customer.email}
                                            </p>
                                        )}
                                        {customer?.phone && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                {customer.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-xl border border-gray-200 p-4">
                                        <p className="text-xs font-semibold capitalized tracking-wide text-gray-500">
                                            Transporter
                                        </p>
                                        <h3 className="mt-3 font-bold text-gray-900">
                                            {transporter?.name ||
                                                "Transporter details unavailable"}
                                        </h3>
                                        {transporter?.email && (
                                            <p className="mt-2 break-all text-sm text-gray-600">
                                                {transporter.email}
                                            </p>
                                        )}
                                        {transporter?.phone && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                {transporter.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <h2 className="text-sm font-bold text-gray-900">
                                        Booking timeline
                                    </h2>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        {
                                            label: "Request submitted",
                                            date: rental.requestedAt,
                                        },
                                        {
                                            label: "Booking accepted",
                                            date: rental.acceptedAt,
                                        },
                                        {
                                            label: "Rental started",
                                            date: rental.startedAt,
                                        },
                                        {
                                            label: "Rental completed",
                                            date: rental.completedAt,
                                        },
                                    ]
                                        .filter((item) => item.date)
                                        .map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-start gap-3"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.label}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {formatDateTime(item.date)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                    {rental.rejectedAt && (
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Request rejected
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {formatDateTime(rental.rejectedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {rental.cancelledAt && (
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Booking cancelled
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {formatDateTime(rental.cancelledAt)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>


                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                    <Wallet size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Price breakdown
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Rental price
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {rental.rentalDays} days ×{" "}
                                            {money(rental.pricePerDay)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {money(rental.baseRentalPrice)}
                                    </p>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Driver cost
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {rental.rentalType === "with-driver"
                                                ? "Driver included in estimate"
                                                : "Self-drive"}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {money(rental.driverCost)}
                                    </p>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Extra distance cost
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {rental.extraDistanceKm ?? 0} extra km
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {money(rental.extraDistanceCost)}
                                    </p>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Included distance
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {rental.includedDistanceKm.toLocaleString()} km
                                    </p>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-semibold text-gray-900">
                                            Estimated rental total
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {money(rental.totalPrice)}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-orange-50 p-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900"> Security deposit </p>
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-orange-700">
                                        {money(rental.securityDeposit)}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-gray-600">
                                        Deposit shown separately from the rental total.
                                        Confirm the final payable amount with the provider.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Payment status
                                        </span>
                                    </div>
                                    <StatusBadge value={rental.paymentStatus} />
                                </div>

                                <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Documents
                                        </span>
                                    </div>
                                    <span
                                        className={`text-xs font-semibold ${rental.documentsSubmitted
                                            ? "text-green-700"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {rental.documentsSubmitted
                                            ? "Submitted"
                                            : "Not submitted"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <h3 className="font-bold text-gray-900">
                                Need help?
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Contact your transporter or support team if
                                you have questions about this booking.
                            </p>

                            {transporter?.phone && (
                                <a
                                    href={`tel:${transporter.phone}`}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    Contact transporter
                                </a>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
