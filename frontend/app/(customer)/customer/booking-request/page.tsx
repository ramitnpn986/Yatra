"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, CalendarDays, Users, Car, Search, ArrowRight,  ShieldCheck } from "lucide-react";
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
    const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(null);
    const [vehicleType, setVehicleType] = useState("");
    const [passengers, setPassengers] = useState("1");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const totalDays = useMemo(() => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const difference = end.getTime() - start.getTime();

        if (difference <= 0) return 0;
        return Math.ceil(difference / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pickupLocation) {
            toast.error("Please select a pickup location");
            return;
        }

        if (!vehicleType) {
            toast.error("Please select a vehicle type");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select rental dates");
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
            const res = await fetch("/api/customer/rental/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(searchData),
            });

            const data: RentalSearchResponse = await res.json();

            if (!res.ok) {
                toast.error((data as any).message || "Failed to search vehicles");
                return;
            }

            console.log("Available vehicles:", data);

            toast.success("Vehicles found");
            setVehicles(data.data);

        } catch (error) {
            console.error("Rental search error:", error);
            toast.error("Something went wrong while searching vehicles");
        }
    };



    return (
        <div className="">
            <div className="relative mx-auto mt-4 min-h-[350px] w-full max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1f39] via-[#0f2d52] to-[#071526]  text-white shadow-2xl p-10">

                <div className="relative z-10 grid h-full items-center gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-5">

                        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gray-400">
                            <span>
                                Seamless Vehicle Rentals & booking for travels
                            </span>
                        </div>

                        <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                            Make Your Booking <br />

                            <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                                Fast, Simple & Reliable
                            </span>
                        </h1>

                        <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                            From daily city drives to heavy-duty transport, choose from
                            our wide fleet of verified Cars, Buses, Bikes, and Trucks.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck
                                    size={16}
                                    className="text-orange-400"
                                />
                                <span>100% Verified Vehicles</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="#search-form"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#ee8d39] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-400 active:scale-95"
                            >
                                Book Vehicle Now
                                <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-4 lg:col-span-7">
                        <div className=" relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md transition hover:-translate-y-1">
                            <div className="relative h-[310px] w-full overflow-hidden rounded-xl bg-slate-800/50">
                                <Image
                                    src="/Scorpio-jeep.jpg"
                                    alt="Cars"
                                    fill
                                    sizes="(max-width: 1024px) 33vw, 22vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <div className="mt-3 px-2 pb-2">
                                <h3 className="text-sm font-bold text-white">
                                    Cars
                                </h3>

                                <p className="text-[10px] text-slate-400">
                                    Sedans, SUVs & Hatchbacks
                                </p>
                            </div>
                        </div>



                        <div className=" relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md transition hover:-translate-y-1">
                            <div className="relative h-[310px] w-full overflow-hidden rounded-xl bg-slate-800/50">
                                <Image
                                    src="/busimg.jpg"
                                    alt="Buses"
                                    fill
                                    sizes="(max-width: 1024px) 33vw, 22vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <div className="mt-3 px-2 pb-2">
                                <h3 className="text-sm font-bold text-white">
                                    Buses
                                </h3>

                                <p className="text-[10px] text-slate-400">
                                    Mini & Luxury Travel
                                </p>
                            </div>
                        </div>


                        <div className=" relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md transition hover:-translate-y-1">
                            <div className="relative h-[310px] w-full overflow-hidden rounded-xl bg-slate-800/50">
                                <Image
                                    src="/truck.webp"
                                    alt="Trucks"
                                    fill
                                    sizes="(max-width: 1024px) 33vw, 22vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <div className="mt-3 px-2 pb-2">
                                <h3 className="text-sm font-bold text-white">
                                    Trucks
                                </h3>

                                <p className="text-[10px] text-slate-400">
                                    Cargo & Logistics
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <form onSubmit={handleSearch} className="mx-auto max-w-5xl my-8 bg-white rounded  p-6 shadow-xl  ring-slate-100 sm:p-8">
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0a1f39] sm:text-3xl">
                        Find a Rental Vehicle
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Select your pick-up and drop-off points, choose your vehicle, and pick your travel dates.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="grid gap-6 lg:grid-cols-2">

                        <div className="flex flex-col">
                            <div className="mb-2.5 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MapPin
                                        size={18}
                                        className="text-emerald-600"
                                    />

                                    Pickup Location
                                </label>

                                {pickupLocation && (
                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                                        {pickupLocation.municipality ||
                                            pickupLocation.district ||
                                            "Selected"}
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

                                    {pickupLocation.ward && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            Ward: {pickupLocation.ward}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Car size={16} />
                                Vehicle Type
                            </label>
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            >
                                <option value="">Select vehicle</option>
                                <option value="Bike">Bike</option>
                                <option value="Car">Car</option>
                                <option value="Truck">Truck</option>
                                <option value="Bus">Bus</option>
                            </select>
                        </div>


                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Users size={16} />
                                Passengers
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={passengers}
                                onChange={(e) => setPassengers(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>


                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <CalendarDays size={16} />
                                Start Date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>


                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <CalendarDays size={16} />
                                End Date
                            </label>
                            <input
                                type="date"
                                min={startDate || today}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Duration:
                            </span>
                            <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#0a1f39] shadow-sm border border-slate-200">
                                {totalDays > 0 ? `${totalDays} ${totalDays === 1 ? "day" : "days"}` : "Select valid dates"}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0a1f39]/10 transition hover:bg-[#132d4d] active:scale-[0.99] sm:w-auto"
                        >
                            <Search size={18} />
                            Search Available Vehicles
                        </button>
                    </div>
                </div>
            </form>

            {vehicles.length > 0 && (
                <div className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-gray-900"> Available Vehicles </h2>
                        <p className="text-sm text-gray-500"> {vehicles.length} vehicles available near your pickup location </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((item) => (
                            <RentalVehicleCard key={item.vehicle.id} item={item} onSelect={(selectedVehicle) => {
                                console.log("Selected vehicle:", selectedVehicle);
                            }}
                            />))}
                    </div>
                </div>
            )}
        </div>

    );
}