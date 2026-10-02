"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "@/lib/socketEvents";

interface TransporterLocation {
     rideId: string;
     userId: string;
     role: "transporter" | "customer";
     coordinates: [number, number];
     accuracy?: number;
     heading?: number;
     speed?: number;
     timestamp: number;
}

export const useTransporterLocation = (rideId: string) =>{
      const { socket, connected} = useSocket();
      const [transporterLocation, setTransporterLocation] = useState<TransporterLocation | null> (null);

      useEffect(()=>{
        if(!rideId || !connected) return;

        const handleLocationUpdate = (data: TransporterLocation) => {
            if(data.rideId !== rideId) return;
            if(data.role !== "transporter") return;
            setTransporterLocation(data);
        }

        socket.on(SOCKET_EVENTS.LOCATION.UPDATED, handleLocationUpdate);

        return () => {
            socket.off(SOCKET_EVENTS.LOCATION.UPDATED, handleLocationUpdate);
        };
      }, [socket, connected, rideId]);

      return { transporterLocation, connected}
}