"use client";

import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

interface UseRideLocationProps {
    rideId: string;
    enabled: boolean;
}

export const useRideLocation = ({
    rideId,
    enabled,
}: UseRideLocationProps) => {
    const { socket, connected } = useSocket();

    useEffect(() => {
        if (!enabled || !connected || !rideId) return;

        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const {
                    latitude,
                    longitude,
                    accuracy,
                    heading,
                    speed,
                } = position.coords;

                socket.emit(SOCKET_EVENTS.LOCATION.UPDATE, {
                    rideId,
                    coordinates: [longitude, latitude],
                    accuracy: accuracy ?? undefined,
                    heading: heading ?? undefined,
                    speed: speed ?? undefined,
                });
            },
            (error) => {
                console.error("Location error:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 3000,
                timeout: 10000,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [socket, connected, rideId, enabled]);
};