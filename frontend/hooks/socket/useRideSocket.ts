"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { NewRideRequest } from "@/types/rideRequest";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

export const useRideSocket = () => {
    const { socket, connected } = useSocket();
    const [newRideRequest, setNewRideRequest] = useState<NewRideRequest | null>(null);

    useEffect(() => {
        if (!connected) return;

        const handleNewRideRequest = (request: NewRideRequest) => {
            console.log("NEW RIDE REQUEST", request)
            setNewRideRequest(request)
        }

        socket.on( SOCKET_EVENTS.RIDE.NEW_REQUEST, handleNewRideRequest);

        return () => {
            socket.off(SOCKET_EVENTS.RIDE.NEW_REQUEST, handleNewRideRequest)
        }
    }, [socket, connected]);

    const clearRideRequest = () => {
        setNewRideRequest(null);
    };

    return {
        newRideRequest,
        clearRideRequest,
        connected,
    };


}