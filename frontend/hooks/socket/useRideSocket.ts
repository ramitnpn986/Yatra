

"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { NewRideRequest } from "@/types/rideRequest";

export const useRideSocket = () => {
    const { socket, connected } = useSocket();

    const [newRideRequest, setNewRideRequest] = useState<NewRideRequest | null>(null);
    useEffect(() => {
        if (!connected) return;

        const handleNewRideRequest = (request: NewRideRequest) => {
            console.log("NEW RIDE REQUEST", request)
            setNewRideRequest(request)
        }

        socket.on("new_ride_request", handleNewRideRequest)

        return () => {
            socket.off("new_ride_request", handleNewRideRequest)
        }
    },[socket, connected]);

        const clearRideRequest = () => {
        setNewRideRequest(null);
    };

    return {
        newRideRequest,
        clearRideRequest,
        connected,
    };


}