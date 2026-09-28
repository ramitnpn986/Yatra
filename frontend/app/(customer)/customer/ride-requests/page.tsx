"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    ArrowRight, Bike, Bus,
    Car, Clock, MapPin,
    RefreshCw, Truck,
} from "lucide-react"

type RideStatus = "pending" | "accepted" | "expired" | "cancelled";

type RideRequest = {
    _id: string;
    pickupLocation: {
        address: string;
        type: "Point";
        coordinates: number[]
    },
    dropoffLocation: {
        address: string;
        type: "Point";
        coordinates: number[]
    },
    distanceKm: number;
    estimatedFare?: number;
    vehicleTypes?: "Bike" | "Car" | "Truck" | "Bus";
    passengerCount: number;
    status: RideRequest;
    expiresAt: string;
    acceptedBy?: string;
    acceptedAt?: string;
    cancelledAt?: string;
    createdAt: string;
}


const RideRequestsPage = () => {
   const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");


    return (
        <div>
            ride request
        </div>
    )
}

export default RideRequestsPage