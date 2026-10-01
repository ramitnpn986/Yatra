import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../socketTypes.js";
import { SOCKET_EVENTS } from "../socketEvents.js";

export const registerTransporterHandlers = (socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;

    socket.on(SOCKET_EVENTS.TRANSPORTER.JOIN, async () => {
        try {

            if (authenticatedSocket.user.role !== "transporter") {
                return socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                    message: "Only transporters can join transporter room",
                });
            }

            const room = `transporter:${authenticatedSocket.user.id}`;
            await socket.join(room);
            console.log(`Transporter ${authenticatedSocket.user.id} joined ${room}`);

            socket.emit(SOCKET_EVENTS.TRANSPORTER.JOINED, {
                message: "Successfully joined transporter room",
            });

        } catch (err) {
            console.error("Transporter room error: ", err);
            socket.emit(SOCKET_EVENTS.SYSTEM.ERROR, {
                message: "Unable to join transporter room"
            })
        }

    })

}