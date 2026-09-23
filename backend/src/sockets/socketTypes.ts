//   typescript types for sockets/events

import { Socket } from 'socket.io';

export type SocketRole = "customer" | "transporter";

export interface SocketUser {
     id: string;
     role: SocketRole;
}

export interface AuthenticatedSocket extends Socket {
    user: SocketUser;
}

export interface JoinRidePayload {
     rideId : string
}

export interface LeaveRidePayload {
     rideId : string
}

export interface LocationUpdatePayload {
    rideId: string;
    coordinates: [number, number];
    accuracy?: number;
    heading?: number;
    speed?: number;
}

export interface LocationUpdatedPayload {
    userId: string;
    role: SocketRole;
    coordinates: [number, number];
    accuracy?: number;
    heading?: number;
    speed?: number;
    timestamp: number;
}