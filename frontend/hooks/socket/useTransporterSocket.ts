
"use client";

import { useEffect } from "react";
import { useSocket } from "./useSocket";

export const useTransporterSocket = () =>{
       const { socket, connected} = useSocket();

       useEffect(()=>{
            if(!connected) return;
            socket.emit("transporter:join");
            const handleJoined = (data: unknown) =>{
                console.log("Joined transporter room:", data);
            }

            socket.on("transporter:joined", handleJoined);
            return ()=>{
                 socket.off("transporter:joined", handleJoined);
            }
       },[socket, connected]);

       return {
         socket, 
         connected
       }
}