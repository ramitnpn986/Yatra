"use client";

import {
    Car, MapPin, Phone, User, CalendarDays, Users, Weight, BadgeCheck,
} from "lucide-react";
import Image from "next/image";

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
    };
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

interface Props {
    vehicle: Vehicle;
    transporter: Transporter;
}

export default function VehicleTransporterDetails({ vehicle, transporter }: Props) {
    return (
        <div className="my-4 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <User size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Transporter Details
                            </h2>
                            <p className="text-sm text-gray-500">Vehicle owner information</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4">
                        {transporter.profileImage?.url ? (
                            <Image
                                src={transporter.profileImage.url}
                                alt={transporter.name}
                                width={72}
                                height={72}
                                className="h-[72px] w-[72px] rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gray-500 text-gray-500">
                                <User size={32} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900"> {transporter.name} </h3>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                 
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-500">
                                <Phone size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400"> Phone </p>
                                <p className="mt-0.5 break-words text-sm font-medium text-gray-800"> {transporter.phone} </p>
                            </div>
                        </div>

       
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-500">
                                <MapPin size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400"> Registered Location </p>
                                <p className="mt-0.5 break-words text-sm font-medium text-gray-800"> {transporter.location?.address || "Location not available"} </p>
                            </div>
                        </div>

                        <div className="px-4 grid grid-cols-1 gap-4">
                            {transporter.location?.district && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-500"></div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400"> District </p>
                                        <p className="mt-0.5 break-words text-sm font-medium text-gray-800"> {transporter.location.district} </p>
                                    </div>
                                </div>
                            )}

                            {transporter.location?.municipality && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-500"></div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400"> Municipality </p>
                                        <p className="mt-0.5 break-words text-sm font-medium text-gray-800"> {transporter.location.municipality} </p>
                                    </div>
                                </div>
                            )}

                            {transporter.location?.ward && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-500"></div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400"> Ward </p>
                                        <p className="mt-0.5 break-words text-sm font-medium text-gray-800"> {` ${transporter.location.ward}`} </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex mt-10 items-center gap-3">
                        <BadgeCheck className="text-green-600" size={18} />
                        <p className="font-medium text-green-800">Verified Transporter</p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative h-64 w-full bg-gray-100">
                    {vehicle.images && vehicle.images.length > 0 ? (
                        <Image
                            src={vehicle.images[0]}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            <Car size={60} strokeWidth={1.5} />
                        </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-gray-800 shadow">
                        {vehicle.vehicleType}
                    </div>
                    {vehicle.rentalAvailable && (
                        <div className="absolute right-2 top-3 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                            Available
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900"> {vehicle.brand} {vehicle.model} </h2>
                            <p className="mt-1 text-sm text-gray-500">{vehicle.numberPlate}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Car size={18} />
                                <span className="text-xs">Vehicle Type</span>
                            </div>
                            <p className="mt-2 font-semibold text-gray-900">{vehicle.vehicleType}</p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Users size={18} />
                                <span className="text-xs">Seats</span>
                            </div>
                            <p className="mt-2 font-semibold text-gray-900">{`${vehicle.seats} Seats`}</p>
                        </div>

   
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Weight size={18} />
                                <span className="text-xs">Capacity</span>
                            </div>
                            <p className="mt-2 font-semibold text-gray-900">{`${vehicle.capacityKg} kg`}</p>
                        </div>

            
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <CalendarDays size={18} />
                                <span className="text-xs">Year</span>
                            </div>
                            <p className="mt-2 font-semibold text-gray-900">{vehicle.year.toString()}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500">
                            Registration Number
                        </p>
                        <p className="mt-1 text-lg font-bold tracking-wider text-gray-900">
                            {vehicle.numberPlate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}