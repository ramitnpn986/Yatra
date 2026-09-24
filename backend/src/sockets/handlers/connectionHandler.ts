//   connection/ disconnection logic


import { Server, Socket } from 'socket.io';
import { registerRideHandlers } from './rideHandler.js'
import { registerLocationHandlers } from "./locationHandler";
import { AuthenticatedSocket } from "../socketTypes";

export const handleSocketConnection = (io: Server, socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;
    registerRideHandlers(socket);
    registerLocationHandlers(socket);

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${authenticatedSocket.id}`);
        console.log(`Reason: ${reason}`);
    });
}