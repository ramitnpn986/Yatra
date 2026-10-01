"use client";

import { MapPin, Navigation, Users, X, Check, Car, Bike, Truck, Bus} from 'lucide-react';
import {NewRideRequest} from '@/types/rideRequest';

interface RideRequestPopupProps {
    request: NewRideRequest;
    onAccept: () => void;
    onReject: () => void;
}

const getVehicleIcon = (vehicleType: NewRideRequest["vehicleType"]) => {
    switch (vehicleType) {
        case "Bike":
            return <Bike size={22} />;

        case "Truck":
            return <Truck size={22} />;

        case "Bus":
            return <Bus size={22} />;

        case "Car":
        default:
            return <Car size={22} />;
    }
};

export default function RideRequestPopup({request,  onAccept,  onReject}: RideRequestPopupProps) {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-[#0F172A] px-5 py-4 text-white">
                    <div>
                        <p className="text-xs font-medium text-slate-300"> Yatra </p>
                        <h2 className="text-lg font-bold">  New Ride Request  </h2>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ee8d39]">
                        {getVehicleIcon(request.vehicleType)}
                    </div>
                </div>

                <div className="space-y-5 p-5">
                    <div className="flex gap-3">
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <MapPin size={19} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Pickup</p>
                            <p className="text-sm font-semibold text-gray-900"> {request.pickupLocation.address} </p>
                        </div>
                    </div>


                    <div className="flex gap-3">
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Navigation size={19} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">  Destination </p>
                            <p className=" text-sm font-semibold text-gray-900">  {request.dropoffLocation.address} </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className="text-xs text-gray-500"> Distance </p>
                            <p className="mt-1 text-sm font-bold">  {request.distanceKm} km </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className="text-xs text-gray-500">  Passenger </p>

                            <div className="mt-1 flex items-center justify-center gap-1 text-sm font-bold">
                                <Users size={14} />  {request.passengerCount}
                            </div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className="text-xs text-gray-500"> Vehicle </p>
                            <p className="mt-1 text-sm font-bold">  {request.vehicleType} </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-4 text-center">
                        <p className="text-xs font-medium text-blue-600">
                            Estimated Fare
                        </p>

                        <p className="mt-1 text-2xl font-bold text-blue-700">
                            Rs. {request.estimatedFare}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onReject}
                            className="flex items-center justify-center gap-2 rounded-xl  px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
                        >
                            <X size={18} />
                            Reject
                        </button>

                        <button
                            type="button"
                            onClick={onAccept}
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                            <Check size={18} />
                            Accept
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}