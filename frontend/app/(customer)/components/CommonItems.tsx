export interface Ride {
    _id: string;
    rideRequest: string;
    customer: string;
    transporter: string;
    pickupLocation: Location;
    dropoffLocation: Location;
    distanceKm: number;
    estimatedFare: number;
    finalFare?: number;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
    passengerCount: number;
    status: | "confirmed" | "driver_arriving" | "driver_arrived" | "started" | "arrived_destination" | "completed" | "cancelled";
    cancelledBy?: "customer" | "transporter" | "admin";
    requestedAt: string;
    acceptedAt?: string;
    driverArrivedAt?: string;
    startedAt?: string;
    arrivedDestinationAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Location {
    address: string;
    type: string;
    coordinates: number[];
}

import { Bike, Bus, Car, CheckCircle2, Clock, MapPin, Navigation, Route, Truck, XCircle } from "lucide-react";

export const getVehicleIcon = (vehicleType: Ride["vehicleType"]) => {
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

export const getVehicleStyle = (vehicleType: Ride["vehicleType"]) => {
    switch (vehicleType) {
        case "Bike":
            return "bg-orange-50 text-orange-600";

        case "Truck":
            return "bg-purple-50 text-purple-600";

        case "Bus":
            return "bg-indigo-50 text-indigo-600";

        default:
            return "bg-blue-50 text-blue-600";
    }
};

export const getStatus = (status: Ride["status"]) => {
    switch (status) {
        case "confirmed":
            return {
                label: "Confirmed",
                className: "bg-blue-50 text-blue-700 border-blue-200",
                icon: <CheckCircle2 size={15} />,
            };

        case "driver_arriving":
            return {
                label: "Driver Arriving",
                className: "bg-amber-50 text-amber-700 border-amber-200",
                icon: <Navigation size={15} />,
            };

        case "driver_arrived":
            return {
                label: "Driver Arrived",
                className: "bg-purple-50 text-purple-700 border-purple-200",
                icon: <MapPin size={15} />,
            };

        case "started":
            return {
                label: "Ride Started",
                className: "bg-indigo-50 text-indigo-700 border-indigo-200",
                icon: <Route size={15} />,
            };

        case "arrived_destination":
            return {
                label: "Arrived",
                className: "bg-green-50 text-green-700 border-green-200",
                icon: <CheckCircle2 size={15} />,
            };

        case "completed":
            return {
                label: "Completed",
                className: "bg-green-50 text-green-700 border-green-200",
                icon: <CheckCircle2 size={15} />,
            };

        case "cancelled":
            return {
                label: "Cancelled",
                className: "bg-red-50 text-red-700 border-red-200",
                icon: <XCircle size={15} />,
            };

        default:
            return {
                label: status,
                className: "bg-gray-50 text-gray-700 border-gray-200",
                icon: <Clock size={15} />,
            };
    }
};

export const formatDate = (date?: string) => {
    if (!date) return " ";

    return new Date(date).toLocaleString("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};