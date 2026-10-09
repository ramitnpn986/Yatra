"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
    MapPin,
    CalendarDays,
    Users,
    Car,
    Wallet,
    Send,
    Calculator,
} from "lucide-react";
import { toast } from "sonner";
import VehicleTransporterDetails from "@/app/(customer)/components/VehicleTransporterDetails";
import RentalPriceCard from "@/app/(customer)/components/RentalPriceCard";

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
    _id: string;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
    transporter?: string;
    brand: string;
    model: string;
    numberPlate: string;
    images: string[];
    seats: number;
    capacityKg: number;
    year: number;
    isAvailable?: boolean;
    rentalAvailable?: boolean;
}

interface Transporter {
    _id: string;
    name: string;
    phone: string;
    profileImage?: {
        url?: string;
    }
    location?: {
        type: "Point";
        coordinates: [number, number];
        address: string;
        province?: string;
        district?: string;
        municipality?: string;
        ward?: string;
    };
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


    const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<SelectedLocation | null>(null);
    const [destinationPlaces, setDestinationPlaces] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [rentalType, setRentalType] = useState("");
    const [totalPassengers, setPassengers] = useState("1");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [estimatedBudget, setEstimatedBudget] = useState("");
    const params = useParams();
    const vehicleId = params.vehicleId as string;
    const [calculateLoading, setCalculateLoading] = useState(false);
    const [routeCalculation, setRouteCalculation] = useState<any>(null);

    const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
    const [transporter, setTransporter] = useState<Transporter | null>(null);


    const [fetchLoading, setFetchLoading] = useState(true);

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



    const fetchVehicleDetails = async () => {
        if (!vehicleId) return;
        setFetchLoading(true);
        try {
            const res = await fetch(`/api/customer/rental/request/vehicle/${vehicleId}`, {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            })

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch vehicle details");
            }

            setVehicleData(data.vehicle);
            setTransporter(data.transporter);
            console.log(data.vehicle, data.transporter);

        } catch (err) {
            console.log("errr: ", err);
            toast.error(err instanceof Error ? err.message : "Failed to fetch vehicle details");

        } finally {
            setFetchLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicleDetails();
    }, [vehicleId]);



    const handleCalculate = async () => {
        if (!pickupLocation) {
            toast.error("Please select a pickup location");
            return;
        }

        if (!destinationLocation) {
            toast.error("Please select a return location");
            return;
        }

        if (!destinationPlaces.trim()) {
            toast.error("Please enter destination places");
            return;
        }

        if (!vehicleType || !rentalType) {
            toast.error("Please select a vehicle type and rental type");
            return;
        }

        if (!startDate || !endDate || totalDays <= 0) {
            toast.error("Please select valid journey dates");
            return;
        }

        const destinations = destinationPlaces
            .split(",")
            .map((place) => place.trim())
            .filter(Boolean);

        setCalculateLoading(true);
        setRouteCalculation(null);

        try {
            const res = await fetch("/api/customer/rental/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                cache: "no-store",
                body: JSON.stringify({
                    pickupLocation,
                    destinations,
                    returnLocation: destinationLocation,
                    vehicleType,
                    rentalType,
                    totalPassengers: Number(totalPassengers),
                    startDate,
                    endDate,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to calculate route and price"
                );
            }

            // Do not allow a booking estimate with unresolved destinations.
            if (data.data.invalidPlaces?.length > 0) {
                setRouteCalculation(data.data);
                toast.error(
                    `Please correct invalid destinations: ${data.data.invalidPlaces.join(", ")} `
                );
                return;
            }

            setRouteCalculation(data.data);
            toast.success("Route and estimated price calculated");
        } catch (error) {
            console.error("Calculate rental error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to calculate route and price"
            );
        } finally {
            setCalculateLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!routeCalculation) {
            toast.error("Please calculate the route and price first");
            return;
        }

        if (routeCalculation.invalidPlaces?.length > 0) {
            toast.error("Please correct invalid destinations and calculate again");
            return;
        }

        if (!pickupLocation || !destinationLocation) {
            toast.error("Please select pickup and return locations");
            return;
        }

        if (!transporter?._id || !vehicleId) {
            toast.error("Vehicle or transporter information is missing");
            return;
        }

        if (!vehicleType || !rentalType) {
            toast.error("Please select vehicle and rental types");
            return;
        }

        if (!startDate || !endDate || totalDays <= 0) {
            toast.error("Please select valid journey dates");
            return;
        }

        const destinations = routeCalculation.destinations.map(
            (destination: {
                name: string;
                coordinates: [number, number];
            }) => ({
                name: destination.name,
                address: destination.name,
                type: "Point" as const,
                coordinates: destination.coordinates,
            })
        );

        if (destinations.length === 0) {
            toast.error("No valid destinations were calculated");
            return;
        }

        try {
            const res = await fetch("/api/customer/rental/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                cache: "no-store",
                body: JSON.stringify({
                    transporterId: transporter._id,
                    vehicleId,
                    vehicleType,
                    rentalType,
                    pickupLocation,
                    destinations,
                    returnLocation: destinationLocation,
                    startDate,
                    endDate,

                    // Results from the successful calculation.
                    distanceKm: routeCalculation.distanceKm,
                    durationMinutes: routeCalculation.durationMinutes,
                    totalPassengers: Number(totalPassengers),
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || "Rental request failed");
            }

            toast.success("Rental request submitted successfully");
        } catch (error) {
            console.error("Rental request error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to submit rental request"
            );
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 pb-12">

            {vehicleData && transporter && (
                <VehicleTransporterDetails vehicle={vehicleData} transporter={transporter} />
            )}

            <div className="mx-auto my-8 max-w-5xl rounded-3xl bg-white p-6 shadow-xl sm:p-8">
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0a1f39] sm:text-3xl">
                        Rental Request
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">  Enter your journey details to send rental provider. </p>
                </div>

                <div className="space-y-8">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                            <div className="mb-2.5 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MapPin size={18} className="text-[#ee8d39]" />
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
                                    currentCoords={pickupLocation ? [pickupLocation.coordinates[1], pickupLocation.coordinates[0]] : [27.700769, 83.448349]}
                                    isEditable={true}
                                    onSelect={(location) => { setPickupLocation(location); }}
                                />
                            </div>

                            {pickupLocation && (
                                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {pickupLocation.address}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {pickupLocation.municipality && `${pickupLocation.municipality}, `}
                                        {pickupLocation.district && `${pickupLocation.district}, `}
                                        {pickupLocation.province}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2.5 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MapPin size={18} className="text-red-500" />
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
                                            ? [destinationLocation.coordinates[1],
                                            destinationLocation.coordinates[0]] : [27.7172, 85.3240]
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
                                        {destinationLocation.municipality && `${destinationLocation.municipality}, `}
                                        {destinationLocation.district && `${destinationLocation.district}, `}
                                        {destinationLocation.province}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

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

                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Users size={16} />
                                Total Persons
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={totalPassengers}
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
                                onChange={(e) => setStartDate(e.target.value)}
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
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            />
                        </div>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

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
                                    onChange={(e) => setEstimatedBudget(e.target.value)}
                                    placeholder="Enter your estimated budget"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Car size={16} />
                                Preferred rentalType
                            </label>

                            <select
                                value={rentalType}
                                onChange={(e) => setRentalType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0a1f39] focus:bg-white focus:ring-2 focus:ring-[#0a1f39]/10"
                            >
                                <option value="">
                                    Select vehicle
                                </option>
                                <option value="self-drive">
                                    self-drive
                                </option>
                                <option value="with-driver">
                                    with-driver
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row">

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Duration:
                            </span>

                            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#0a1f39] shadow-sm">
                                {totalDays > 0 ? `${totalDays} ${totalDays === 1 ? "day" : "days"} ` : "Select valid dates"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={handleCalculate}
                                disabled={calculateLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#132d4d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {calculateLoading ? "Calculating..." : "Calculate"}
                                <Calculator size={18} className="text-blue-400" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSubmit()}
                                disabled={!routeCalculation || calculateLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f39] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#132d4d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Request
                                <Send size={18} className="rotate-45 text-blue-400" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-10">
                {routeCalculation && (
                    <RentalPriceCard
                        data={routeCalculation}
                        pickupAddress={pickupLocation?.address}
                        destinationAddress={destinationLocation?.address}
                        onConfirm={() => handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}