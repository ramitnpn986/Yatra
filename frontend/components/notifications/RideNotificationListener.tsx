"use client";

import { getSocket } from "@/lib/socket";
import RideRequestPopup from "./RideRequestPopup"
import { NewRideRequest } from "@/types/rideRequest";
import { useEffect, useState } from "react";


export default function RideNotificationListener() {

    const [rideRequest, setRideRequest] = useState<NewRideRequest | null>(null);

    useEffect(() => {
        const socket = getSocket();

        const handleConnect = () => {
            console.log("transporter socket connected: ", socket.id);
        }

        const handleRideRequest = (request: NewRideRequest) => {
            console.log("New ride request received:", request);
            setRideRequest(request);
        };

        const handleConnectError = (error: Error) => {
            console.error("Transporter socket connection error:", error.message);
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("new_ride_request", handleRideRequest);

        if (!socket.connected) {
            socket.connect();
        }
        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("new_ride_request", handleRideRequest);
        };


    }, [])

    if (!rideRequest) {
        return null;
    }

    const handleReject = () => {
        console.log("Ride request rejected:", rideRequest.rideRequestId);
        setRideRequest(null);
    };

    const handleAccept = () => {
        console.log("Ride request accepted:", rideRequest.rideRequestId);
        setRideRequest(null);
    };


    return (
        <RideRequestPopup request={rideRequest} onAccept={handleAccept} onReject={handleReject} />
    )


}