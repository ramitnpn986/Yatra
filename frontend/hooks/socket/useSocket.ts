"use client";

import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "@/lib/socket";

export const useSocket = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = connectSocket();

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
            setConnected(true);
        }


        const handleDisconnect = () => {
            console.log("Socket disconnected");
            setConnected(false);
        };

        const handleConnectError = (error: Error) => {
            console.error("Socket connection error:", error);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        if (socket.connected) {
            setConnected(true);
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
        }


    },[]);

     return {
        socket: getSocket(),
        connected,
    };


}