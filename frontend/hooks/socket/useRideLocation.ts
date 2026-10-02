"use client";

import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

interface UseRideLocationProps {
    rideId: string;
    enabled?: boolean;
}

export const useRideLocation = ({ rideId, enabled = true }: UseRideLocationProps) => {
    const { socket, connected } = useSocket();

    useEffect(() => {
        if (!enabled || !connected || !rideId) return;

        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        const activeId = navigator.geolocation.watchPosition((position) => {

            const { latitude, longitude, accuracy, heading, speed } = position.coords;
            socket.emit(SOCKET_EVENTS.RIDE.LOCATION_UPDATE, {
                rideId,
                coordinates: [
                    longitude,
                    latitude,
                ],
                accuracy : accuracy ?? undefined,
                heading : heading ?? undefined,
                speed : speed ?? undefined
            })
        },(error) =>{
            console.error("Error getting location:", error);
        },{
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        })

        return () => {
            navigator.geolocation.clearWatch(activeId);
        }
    }, [socket, connected, rideId, enabled]);

}