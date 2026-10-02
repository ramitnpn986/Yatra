"use client";

import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

interface UseRideRoomProps {
    rideId: string;
    enabled?: boolean;
}

export const useRideRoom = ({ rideId, enabled = true }: UseRideRoomProps) => {
    const {socket, connected} = useSocket();

    useEffect(() => {
        if (!enabled || !connected || !rideId) return;

        socket.emit(SOCKET_EVENTS.RIDE.JOIN, rideId);

        const handleJoined = (data: {rideId: string}) => {
            console.log(`Joined ride room: ${data.rideId}`);
        }

        const handleError = (error: {message: string}) => {
            console.error(`Error joining ride room: ${error.message}`);
        }

        socket.on(SOCKET_EVENTS.RIDE.JOINED, handleJoined);
        socket.on(SOCKET_EVENTS.RIDE.ERROR, handleError);

        return () => {
          
            socket.off(SOCKET_EVENTS.RIDE.JOINED, handleJoined);
            socket.off(SOCKET_EVENTS.RIDE.ERROR, handleError);

            if(socket.connected) {
                socket.emit(SOCKET_EVENTS.RIDE.LEAVE, rideId);
            }
        };

    },[socket, connected, rideId, enabled]);

    return { socket, connected };
}