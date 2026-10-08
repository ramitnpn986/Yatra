"use Client";

import {
    Car, MapPin, Phone, User, CalendarDays, Users, Weight, BadgeCheck, FileText,
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

interface Props {
    vehicle: Vehicle;
    transporter: Transporter;
}


export default function VehicleTransporterDetails({ vehicle, transporter }: Props) {
    return (
        <div className="my-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Transporter Details Card */}
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
                        {transporter.profileImage ? (
                            <Image
                                src={transporter.profileImage?.url}
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
                        <InfoRow
                            icon={<Phone size={18} />}
                            label="Phone"
                            value={transporter.phone}
                        />
                        <InfoRow
                            icon={<MapPin size={18} />}
                            label="Registered Location"
                            value={transporter.location?.address || "Location not available"}
                        />
                        <div className="px-4 grid grid-cols-1 gap-4">
                            {transporter.location?.district && (
                                <InfoRow
                                    icon={""}
                                    label="District"
                                    value={transporter.location.district}
                                />
                            )}
                            {transporter.location?.municipality && (
                                <InfoRow
                                    icon={""}
                                    label="Municipality"
                                    value={transporter.location.municipality}
                                />
                            )}
                            {transporter.location?.ward && (
                                <InfoRow
                                    icon={""}
                                    label="Ward"
                                    value={` ${transporter.location.ward}`}
                                />
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
                        <SpecCard
                            icon={<Car size={18} />}
                            label="Vehicle Type"
                            value={vehicle.vehicleType}
                        />
                        <SpecCard
                            icon={<Users size={18} />}
                            label="Seats"
                            value={`${vehicle.seats} Seats`}
                        />
                        <SpecCard
                            icon={<Weight size={18} />}
                            label="Capacity"
                            value={`${vehicle.capacityKg} kg`}
                        />
                        <SpecCard
                            icon={<CalendarDays size={18} />}
                            label="Year"
                            value={vehicle.year.toString()}
                        />
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


function InfoRow({ icon, label, value, }: { icon: React.ReactNode; label: string; value: string; }) {
    return (<div className="flex items-start gap-3">
        <div className="mt-0.5 text-gray-500">{icon}</div>
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400"> {label} </p>
            <p className="mt-0.5 break-words text-sm font-medium text-gray-800"> {value} </p>
        </div>
    </div>);

}


function SpecCard({ icon, label, value, }: { icon: React.ReactNode; label: string; value: string; }) {

    return (<div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500"> {icon} <span className="text-xs">{label}</span> </div>
        <p className="mt-2 font-semibold text-gray-900">{value}</p>
    </div>);
}


function StatusBadge({ label, active, activeText, inactiveText, }: { label: string; active: boolean; activeText: string; inactiveText: string; }) { return (<div className="rounded-xl border border-gray-200 p-4"> <p className="text-xs text-gray-500">{label}</p> <div className="mt-2 flex items-center gap-2"> <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`} /> <span className={`text-sm font-semibold ${active ? "text-green-700" : "text-red-700"}`} > {active ? activeText : inactiveText} </span> </div> </div>); }