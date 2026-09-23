// verifies jwt and identifies customer and transporter

import { Socket } from "socket.io" // this is just Typescript type for one connected Socket.IO client
import jwt from 'jsonwebtoken'    // normaly to verify 
import { parse } from 'cookie'    //  converts a raw cookiew header string to a javascript object
import { AuthenticatedSocket, SocketRole } from "./socketTypes.js"

interface JwtPayload {    // expectted information inside our jwt
    adminId?: string;
    customerId?: string;
    transporterId?: string;
    role?: "admin" | "customer" | "transporter";
}


// this middleware runs whenever a client tries to establish a socket.io connection

// flow is : frontend -> socket.connect() -> socket.io server -> socketAuth() -> verify cookie -> allow or reject connection

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
    try {

        const cookies = socket.handshake.headers.cookie;   // getting cookies from the socket.io handshake
        //  when the browser establishes the socket.io connection, the browser sends http headers during handshake
        //   socket.handshake.headers.cookie gives us that raw string


        if (!cookies) {
            return next(new Error("Authentication Required"));
        }

        const parsedCookies = parse(cookies);       // convert the cookie header into an object 
        const token = parsedCookies.token;          


        // if the cookie exists but doesn't contain 'token' the socket connection can not be authenticated 

        if (!token) {         
            return next(new Error("Authentication token missing"));
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT SECRET is not configured");
            return next(new Error("Server configuration error"));
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;


        // we don't know yet whether this is a customer or transporter

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


        //  we should have userId = mongodb id  and role 
        if (!userId || !role) {
            return next(new Error("Invalid socket user"));
        }

        // converting the normal socket into our custom authenticatedsocket
        const authenticatedSocket = socket as AuthenticatedSocket;

        // storing authenticated user information on the socket . now other socket handlers can access it
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