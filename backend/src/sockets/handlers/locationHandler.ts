//  Real-time GPS updates

import { Socket } from "socket.io";
import { AuthenticatedSocket, LocationUpdatePayload } from "../socketTypes.js";
import { SOCKET_EVENTS } from "../socketEvents.js";


export const registerLocationHandlers = (socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;

    socket.on(SOCKET_EVENTS.LOCATION.UPDATE, async (payload: LocationUpdatePayload) => {
        try {
            const { rideId, coordinates, accuracy, heading, speed } = payload;

            if (!rideId) {
                return socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                    message: "Ride ID is required",
                });
            }

            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                return socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                    message: "Invalid coordinates",
                });
            }

            const [longitude, latitude] = coordinates;

            if (typeof longitude !== "number" || typeof latitude !== "number") {
                return socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                    message: "Coordinates must be numbers",
                });
            }

            if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                return socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                    message: "Invalid longitude or latitude",
                });
            }

            const room = `ride:${rideId}`;
            const rooms = authenticatedSocket.rooms;

            if (!rooms.has(room)) {
                return socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                    message: "You are not connected to this ride",
                });
            }

            const locationData = {
                userId: authenticatedSocket.user.id,
                role: authenticatedSocket.user.role,
                coordinates: [longitude, latitude] as [number, number],
                accuracy,
                heading,
                speed,
                timestamp: Date.now(),
            };

            socket.to(room).emit(SOCKET_EVENTS.LOCATION.UPDATED, locationData);


        } catch (err) {
            console.error("Location update socket error:", err);
            socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                message: "Unable to process location update",
            });
        }
    })
}