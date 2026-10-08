"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
    MapPin,
    CalendarDays,
    Users,
    Car,
    Search,
    ArrowRight,
    ShieldCheck,
    Wallet,
    Send,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import RentalVehicleCard from "@/app/(customer)/components/RentalVehicleCard";

type Coordinates = [number, number];

interface SelectedLocation {
    type: "Point";
    coordinates: Coordinates;
    address: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
}

interface Vehicle {
    id: string;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
    brand: string;
    model: string;
    numberPlate: string;
    images: string[];
    seats: number;
    capacityKg: number;
    year: number;
}

interface Transporter {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
    location: SelectedLocation;
}

interface AvailableVehicle {
    distanceKm: number;
    vehicle: Vehicle;
    transporter: Transporter;
}

interface RentalSearchResponse {
    success: boolean;
    count: number;
    data: AvailableVehicle[];
}

const LocationPicker = dynamic(
    () => import("@/app/(customer)/components/LocationPicker1"),
    { ssr: false }
);

export default function RentalSearchForm() {
    const [vehicles, setVehicles] = useState<AvailableVehicle[]>([]);

    const [pickupLocation, setPickupLocation] =
        useState<SelectedLocation | null>(null);

    const [destinationLocation, setDestinationLocation] =
        useState<SelectedLocation | null>(null);

    const [destinationPlaces, setDestinationPlaces] = useState("");

    const [vehicleType, setVehicleType] = useState("");

    const [passengers, setPassengers] = useState("1");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [estimatedBudget, setEstimatedBudget] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const totalDays = useMemo(() => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const difference = end.getTime() - start.getTime();

        if (difference <= 0) return 0;

        return Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    }, [startDate, endDate]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pickupLocation) {
            toast.error("Please select a pickup location");
            return;
        }

        if (!destinationLocation) {
            toast.error("Please select a destination location");
            return;
        }

        if (!vehicleType) {
            toast.error("Please select a preferred vehicle");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select journey dates");
            return;
        }

        if (totalDays <= 0) {
            toast.error("End date must be after start date");
            return;
        }

        const searchData = {
            pickupLocation: pickupLocation.coordinates,
            vehicleType,
            passengers: Number(passengers),
            startDate,
            endDate,
        };

        try {
            const res = await fetch(
                "/api/customer/rental/search",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(searchData),
                }
            );

            const data: RentalSearchResponse =
                await res.json();

            if (!res.ok) {
                toast.error(
                    (data as any).message ||
                    "Failed to search vehicles"
                );
                return;
            }

            console.log("Rental search information:", {
                pickupLocation,
                destinationLocation,
                destinationPlaces,
                passengers,
                vehicleType,
                startDate,
                endDate,
                estimatedBudget,
            });

            toast.success("Vehicles found");

            setVehicles(data.data);
        } catch (error) {
            console.error(
                "Rental search error:",
                error
            );

            toast.error(
                "Something went wrong while searching vehicles"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">

            <div className="relative mx-auto mt-4 min-h-[350px] w-full max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1f39] via-[#0f2d52] to-[#071526] p-10 text-white shadow-2xl">

               {/* basic information of transporter */}
            </div>


            <form
                id="rental-form"
                onSubmit={handleSearch}
                className="mx-auto my-8 max-w-5xl rounded-3xl bg-white p-6 shadow-xl sm:p-8"
            >

                {/* HEADER */}
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0a1f39] sm:text-3xl">
                        Rental Request
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Enter your journey details to find
                        available rental vehicles.
                    </p>
                </div>

                <div className="space-y-8">

                    {/* MAP LOCATIONS */}
                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* PICKUP */}
                        <div>
                            <div className="mb-2.5 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MapPin
                                        size={18}
                                        className="text-[#ee8d39]"
                                    />
                                    Pickup Location
                                </label>

                                {pickupLocation && (
                                    <span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] text-[#ee8d39]">
                                        Selected
                                    </span>
                                )}
                            </div>

                            <div className="h-[280px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                                <LocationPicker
                                    currentCoords={
                                        pickupLocation
                                            ? [
                                                pickupLocation.coordinates[1],
                                                pickupLocation.coordinates[0],
                                            ]
                                            : [27.700769, 83.448349]
                                    }
                                    isEditable={true}
                                    onSelect={(location) => {
                                        setPickupLocation(location);
                                    }}
                                />
                            </div>

                            {pickupLocation && (
                                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {pickupLocation.address}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {pickupLocation.municipality &&
                                            `${pickupLocation.municipality}, `}

                                        {pickupLocation.district &&
                                            `${pickupLocation.district}, `}

                                        {pickupLocation.province}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* DESTINATION */}
                        <div>
                            <div className="mb-2.5 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MapPin
                                        size={18}
                                        className="text-red-500"
                                    />
                                    Destination Location
                                </label>

                                {destinationLocation && (
                                    <span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] text-[#ee8d39]">
                                        Selected
                                    </span>
                                )}
                            </div>

                            <div className="h-[280px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                                <LocationPicker
                                    currentCoords={
                                        destinationLocation
                                            ? [
                                                destinationLocation.coordinates[1],
                                                destinationLocation.coordinates[0],
                                            ]
                                            : [27.7172, 85.3240]
                                    }
                                    isEditable={true}
                                    onSelect={(location) => {
                                        setDestinationLocation(location);
                                    }}
                                />
                            </div>

                            {destinationLocation && (
                                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {destinationLocation.address}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {destinationLocation.municipality &&
                                            `${destinationLocation.municipality}, `}

                                        {destinationLocation.district &&
                                            `${destinationLocation.district}, `}

                                        {destinationLocation.province}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* DESTINATION PLACES */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <MapPin size={16} />
                            Destination Places
                        </label>

                        <input
                            type="text"
                            value={destinationPlaces}
                            onChange={(e) =>
                                setDestinationPlaces(e.target.value)
                            }
                            placeholder="e.g. Pokhara, Mustang, Manakamana"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                        />
                    </div>

                    {/* PERSON + VEHICLE */}
                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Users size={16} />
                                Total Persons
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={passengers}
                                onChange={(e) =>
                                    setPassengers(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                                placeholder="Number of persons"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Car size={16} />
                                Preferred Vehicle
                            </label>

                            <select
                                value={vehicleType}
                                onChange={(e) =>
                                    setVehicleType(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            >
                                <option value="">
                                    Select vehicle
                                </option>
                                <option value="Bike">
                                    Bike
                                </option>
                                <option value="Car">
                                    Car
                                </option>
                                <option value="Truck">
                                    Truck
                                </option>
                                <option value="Bus">
                                    Bus
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* DATES */}
                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <CalendarDays size={16} />
                                Starting Date of Journey
                            </label>

                            <input
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <CalendarDays size={16} />
                                Ending Date of Journey
                            </label>

                            <input
                                type="date"
                                min={startDate || today}
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>

                    </div>

                    {/* BUDGET */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <Wallet size={16} />
                            Estimated Budget / Booking Cost
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                                Rs.
                            </span>

                            <input
                                type="number"
                                min="0"
                                value={estimatedBudget}
                                onChange={(e) =>
                                    setEstimatedBudget(e.target.value)
                                }
                                placeholder="Enter your estimated budget"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row">

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Duration:
                            </span>

                            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#0a1f39] shadow-sm">
                                {totalDays > 0
                                    ? `${totalDays} ${
                                        totalDays === 1
                                            ? "day"
                                            : "days"
                                    }`
                                    : "Select valid dates"}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0a1f39]/10 transition hover:bg-[#132d4d] active:scale-[0.99] sm:w-auto"
                        >
                            Request
                            <Send size={18} className="rotate-45 text-blue-400" /> 
                        </button>

                    </div>

                </div>
            </form>

            {vehicles.length > 0 && (
                <div className="mx-auto mt-8 max-w-7xl">

                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-[#0a1f39]"> Available Vehicles </h2>

                        <p className="text-sm text-gray-500">
                            {vehicles.length} vehicles available near your pickup location
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((item) => (
                            <RentalVehicleCard
                                key={item.vehicle.id}
                                item={item}
                                onSelect={(selectedVehicle) => {
                                    console.log(
                                        "Selected vehicle:",
                                        selectedVehicle
                                    );
                                }}
                            />
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}