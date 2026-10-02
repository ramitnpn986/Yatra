import { Server, Socket } from "socket.io";
import { registerRideHandlers } from "./rideHandler.js";
import { registerLocationHandlers } from "./locationHandler.js";
import { registerTransporterHandlers } from "./transporterHandler.js";
import { AuthenticatedSocket } from "../socketTypes.js";

export const handleSocketConnection = (io: Server, socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;

    const { id, role } =authenticatedSocket.user;

    const personalRoom = `${role}:${id}`;
    socket.join(personalRoom);

    console.log(`${role} ${id} joined personal room ${personalRoom}`);

    registerRideHandlers(socket);
    registerLocationHandlers(socket);
    // registerTransporterHandlers(socket); 

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${authenticatedSocket.id}`);
        console.log(`Reason: ${reason}`);
    });
};