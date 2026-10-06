
"use client";

import Image from "next/image";
import {
    MapPin,
    Users,
    Weight,
    Car,
    Phone,
    CalendarDays,
    ShieldCheck,
} from "lucide-react";

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

export interface AvailableVehicle {
    distanceKm: number;
    vehicle: Vehicle;
    transporter: Transporter;
}

interface RentalVehicleCardProps {
    item: AvailableVehicle;
    onSelect?: (item: AvailableVehicle) => void;
}

export default function RentalVehicleCard({
    item,
    onSelect,
}: RentalVehicleCardProps) {
    const { vehicle, transporter, distanceKm } = item;

    const vehicleImage = vehicle.images?.[0];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-52 w-full bg-gray-100">
                {vehicleImage ? (
                    <Image
                        src={vehicleImage}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Car className="h-16 w-16 text-gray-300" />
                    </div>
                )}

                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-gray-800 shadow">
                    {vehicle.vehicleType}
                </div>

                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
                    <MapPin className="h-3.5 w-3.5" />
                    {distanceKm} km
                </div>
            </div>

            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {vehicle.year} • {vehicle.numberPlate}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{vehicle.seats} Seats</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{vehicle.capacityKg} kg</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                        {transporter.profileImage ? (
                            <Image
                                src={transporter.profileImage}
                                alt={transporter.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                                {transporter.name ?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                            <p className="truncate text-sm font-semibold text-gray-900"> {transporter.name} </p>
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />  {transporter.phone}
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                    <div className="flex gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <div>
                            <p className="text-xs font-medium text-gray-700"> Transporter Location  </p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">  {transporter.location.address}  </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onSelect?.(item)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    <CalendarDays className="h-4 w-4" />
                    View Details & Book
                </button>
            </div>
        </div>
    );
}