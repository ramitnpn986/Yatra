"use client";

import { useSocket } from "./useSocket";

export const useTransporterSocket = () =>{
       const { socket, connected} = useSocket();
       return { socket,  connected}
}