import { Socket } from "socket.io"
import jwt from 'jsonwebtoken'
import { AuthenticatedSocket, SocketRole } from "./socketTypes.js"

interface JwtPayload {
    adminId?: string;
    customerId?: string;
    transporterId?: string;
    role?: "admin" | "customer" | "transporter";
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
    try {

        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
            return next(new Error("Authentication Required"));
        }

        const token = cookies
            .split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("Authentication token missing"));
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT SECRET is not configured");
            return next(new Error("Server configuration error"));
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        let userId: string | undefined;
        let role: SocketRole | undefined;

        if (decoded.customerId && decoded.role == "customer") {
            userId = decoded.customerId;
            role = "customer";
        }

        if (decoded.transporterId && decoded.role == "transporter") {
            userId = decoded.transporterId;
            role = "transporter";
        }
        
        if (!userId || !role) {
            return next(new Error("Invalid socket user"));
        }

        const authenticatedSocket = socket as AuthenticatedSocket;

        authenticatedSocket.user = {
            id: userId,
            role,
        };

        next();

    } catch (err) {
        console.log("Socket authentication error: ", err);
        next(new Error("Invalid or expired authentication token"))
    }
}