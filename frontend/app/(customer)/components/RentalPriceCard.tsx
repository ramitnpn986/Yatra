"use client";

import {
    AlertTriangle,
    CalendarDays,
    CarFront,
    CheckCircle2,
    Clock,
    MapPin,
    Route,
    ShieldCheck,
    Wallet,
} from "lucide-react";

type Destination = {
    name: string;
    coordinates: [number, number];
};

type PricingDetails = {
    pricePerDay: number;
    baseRentalPrice: number;
    includedDistanceKm: number;
    extraDistanceKm: number;
    extraDistanceCost: number;
    driverCost: number;
    rentalCost: number;
    securityDeposit: number;
    estimatedTotal: number;
};

type RentalPriceData = {
    distanceKm: number;
    durationMinutes: number;
    rentalDays: number;
    totalPassengers: number;
    vehicleType: string;
    rentalType: string;
    destinations: Destination[];
    invalidPlaces?: string[];
    pricing: PricingDetails;
};

type RentalPriceCardProps = {
    data: RentalPriceData;
    pickupAddress?: string;
    destinationAddress?: string;
    onConfirm?: () => void;
};

// Helpers
const formatMoney = (amount: number) => `NPR ${amount.toLocaleString("en-IN")}`;

const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes} min`;
    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const formatVehicleType = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

const formatRentalType = (value: string) =>
    value === "with-driver" ? "With driver" : "Self-drive";

export default function RentalPriceCard({
    data,
    pickupAddress,
    destinationAddress,
    onConfirm,
}: RentalPriceCardProps) {
    const { pricing } = data;
    const hasInvalidPlaces = Boolean(data.invalidPlaces?.length);

    return (
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
 
            <div className="bg-[#0F172A] text-white sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/15 p-3">
                        <CarFront size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                            Rental price estimate
                        </h2>
                        <p className="mt-1 text-sm text-emerald-50">
                            {formatVehicleType(data.vehicleType)} ·{" "}
                            {formatRentalType(data.rentalType)}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-emerald-50">
                            <Route size={16} />
                            Total distance
                        </div>
                        <p className="mt-1 text-lg font-bold">
                            {data.distanceKm.toFixed(2)} km
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-emerald-50">
                            <Clock size={16} />
                            Driving time
                        </div>
                        <p className="mt-1 text-lg font-bold">
                            {formatDuration(data.durationMinutes)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">

                <section>
                    <h3 className="mb-4 font-semibold text-gray-900">Your journey</h3>
                    <div className="relative space-y-5 pl-1">
         
                        <div className="absolute bottom-4 left-[11px] top-4 border-l-2 border-dashed border-gray-300" />
                        <div className="relative flex gap-3">
                            <MapPin
                                size={23}
                                className="shrink-0 fill-emerald-100 text-emerald-600"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500">Pickup</p>
                                <p className="break-words font-medium text-gray-800">
                                    {pickupAddress}
                                </p>
                            </div>
                        </div>

                    
                        {data.destinations.map((destination, index) => (
                            <div
                                key={`${destination.name}-${index}`}
                                className="relative flex gap-3"
                            >
                                <MapPin
                                    size={23}
                                    className="shrink-0 fill-blue-100 text-blue-600"
                                />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">Stop {index + 1}</p>
                                    <p className="break-words font-medium text-gray-800">
                                        {destination.name}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="relative flex gap-3">
                            <MapPin
                                size={23}
                                className="shrink-0 fill-red-100 text-red-600"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500">Return</p>
                                <p className="break-words font-medium text-gray-800">
                                    {destinationAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

  
                {hasInvalidPlaces && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-2">
                            <AlertTriangle
                                size={20}
                                className="mt-0.5 shrink-0 text-amber-600"
                            />
                            <div>
                                <p className="font-semibold text-amber-900">
                                    Some destinations need attention
                                </p>
                                <p className="mt-1 text-sm text-amber-800">We could not locate:</p>
                                <ul className="mt-1 list-inside list-disc text-sm text-amber-800">
                                    {data.invalidPlaces?.map((place, index) => (
                                        <li key={`${place}-${index}`}>{place}</li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-sm text-amber-800">
                                    These places are excluded from the current route and price
                                    estimate.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <section className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-200 p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays size={17} />
                            Rental duration
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                            {data.rentalDays} days
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CarFront size={17} />
                            Passengers
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900"> {data.totalPassengers} </p>
                    </div>
                </section>

                <section>
                    <h3 className="mb-4 font-semibold text-gray-900">Price breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Daily rental</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {formatMoney(pricing.pricePerDay)} × {data.rentalDays} days
                                </p>
                            </div>
                            <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                                {formatMoney(pricing.baseRentalPrice)}
                            </p>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800"> Included distance </p>
                                <p className="mt-1 text-xs text-gray-500"> {pricing.includedDistanceKm} km </p>
                            </div>
                            <p className="text-sm text-gray-600">Included</p>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800">  Extra distance </p>
                                <p className="mt-1 text-xs text-gray-500"> {pricing.extraDistanceKm.toFixed(2)} km </p>
                            </div>
                            <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                                {formatMoney(pricing.extraDistanceCost)}
                            </p>
                        </div>

                        {data.rentalType === "with-driver" && (
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-800"> Driver allowance </p>
                                    <p className="mt-1 text-xs text-gray-500"> Per day X {data.rentalDays} days </p>
                                </div>
                                <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {formatMoney(pricing.driverCost)}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-3 border-t border-dashed border-gray-300 pt-5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-gray-700">Rental cost</span>
                        <span className="text-lg font-bold text-gray-900">
                            {formatMoney(pricing.rentalCost)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ShieldCheck size={18} className="text-emerald-600" />
                            Refundable deposit
                        </div>
                        <span className="font-semibold text-gray-800">
                            {formatMoney(pricing.securityDeposit)}
                        </span>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-4">
                        <p className="text-sm font-medium text-emerald-800"> Estimated total </p>
                        <p className="mt-1 text-3xl font-bold text-emerald-800">  {formatMoney(pricing.estimatedTotal)}  </p>
                        <p className="mt-2 text-xs leading-5 text-emerald-700">
                            Includes the rental cost and refundable security deposit. Fuel,
                            tolls, parking and other unlisted charges may be extra.
                        </p>
                    </div>
                </section>


                <div className="flex items-start gap-2 text-xs leading-5 text-gray-500">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    <p>  This is an estimate. The final price and vehicle availability must be confirmed before booking. </p>
                </div>

                {onConfirm && (
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={hasInvalidPlaces}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        <Wallet size={19} />
                        Continue to booking
                    </button>
                )}
            </div>
        </div>
    );
}