"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Car } from "lucide-react";
import { toast } from "sonner";

interface TransporterVehicle {
    _id: string;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
    brand: string;
    model: string;
    numberPlate: string;
    images?: string[];
    seats?: number;
    capacityKg?: number;
    year?: number;
    isAvailable: boolean;
    rentalAvailable: boolean;
}

export default function TransporterVehiclesPage() {
    const [vehicles, setVehicles] = useState<TransporterVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const res = await fetch("/api/transporter/vehicles", {
                    credentials: "include",
                    cache: "no-store",
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Failed to load vehicles");
                }

                setVehicles(data.vehicles);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load vehicles");
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    const toggleRental = async (vehicle: TransporterVehicle) => {
        const nextStatus = vehicle.rentalAvailable ? "unavailable" : "available";

        try {
            setUpdatingId(vehicle._id);

            const res = await fetch(
                `/api/transporter/vehicles/${vehicle._id}/rental-availability`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ status: nextStatus }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update rental availability");
            }

            setVehicles((current) =>
                current.map((v) =>
                    v._id === vehicle._id ? { ...v, rentalAvailable: data.rentalAvailable } : v
                )
            );

            toast.success(
                data.rentalAvailable
                    ? "Vehicle is now listed for rent"
                    : "Vehicle removed from rental listings"
            );
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                Loading your vehicles...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-[#0F172A]">My Vehicles</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Choose which of your vehicles customers can find in rental search.
                </p>
            </div>

            {vehicles.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    No vehicle found. Submit your KYC with vehicle details first.
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="relative h-40 bg-slate-100">
                                {vehicle.images?.[0] ? (
                                    <Image
                                        src={vehicle.images[0]}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-300">
                                        <Car size={40} />
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <h2 className="text-base font-bold text-slate-900">
                                    {vehicle.brand} {vehicle.model}
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    {vehicle.vehicleType} · {vehicle.seats ?? "N/A"} seats
                                    {vehicle.year ? ` · ${vehicle.year}` : ""}
                                </p>
                                <p className="mt-1 font-mono text-xs uppercase text-slate-600">
                                    {vehicle.numberPlate}
                                </p>

                                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Available for rent
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {vehicle.rentalAvailable
                                                ? "Visible in rental search"
                                                : "Hidden from rental search"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={vehicle.rentalAvailable}
                                        aria-label={`Toggle rental availability for ${vehicle.brand} ${vehicle.model}`}
                                        disabled={updatingId === vehicle._id}
                                        onClick={() => toggleRental(vehicle)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                                            vehicle.rentalAvailable ? "bg-[#ee8d39]" : "bg-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                                vehicle.rentalAvailable ? "translate-x-5" : "translate-x-0.5"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}