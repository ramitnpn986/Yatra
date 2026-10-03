"use client";

import { getSocket } from "@/lib/socket";
import RideRequestPopup from "./RideRequestPopup";
import { NewRideRequest } from "@/types/rideRequest";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RideNotificationListener() {
    const [rideRequest, setRideRequest] = useState<NewRideRequest | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socket = getSocket();

        const handleConnect = () => {
            console.log("transporter socket connected:", socket.id);
        };

        const handleRideRequest = (request: NewRideRequest) => {
            console.log("New ride request received:", request);
            setRideRequest(request);
        };

        const handleRentalRequest = (request: { rentalId: string; vehicleType?: string }) => {
            console.log("New rental request received:", request);
            toast.info(`New rental request${request.vehicleType ? ` for ${request.vehicleType}` : ""}`);
            window.dispatchEvent(new Event("rental-request-received"));
        };

        const handleConnectError = (error: Error) => {
            console.error(
                "Transporter socket connection error:",
                error.message
            );
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("new_ride_request", handleRideRequest);
        socket.on("new_rental_request", handleRentalRequest);

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("new_ride_request", handleRideRequest);
            socket.off("new_rental_request", handleRentalRequest);
        };
    }, []);

    const handleReject = () => {
        if (!rideRequest) return;
        console.log( "Ride request rejected:", rideRequest.rideRequestId);
        setRideRequest(null);
    };

    const handleAccept = async () => {
        if (!rideRequest) return;

        try {
            setLoading(true);

            const res = await fetch(`/api/ride-request/accept/${rideRequest.rideRequestId}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to accept ride request"
                );
            }

            console.log("Ride accepted:", data);
            setRideRequest(null);
            toast.success("Ride accepted successfully");
        } catch (err) {
            console.error("Failed to accept ride:", err);
            toast.error( err instanceof Error? err.message: "Failed to accept ride request");
        } finally {
            setLoading(false);
        }
    };

    if (!rideRequest) {
        return null;
    }

    return (
        <RideRequestPopup
            request={rideRequest}
            onAccept={handleAccept}
            onReject={handleReject}
            loading={loading}
        />
    );
}