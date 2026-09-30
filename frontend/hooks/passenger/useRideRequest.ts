
"use client";
import { useState } from 'react';
import { CreateRideRequestData } from "@/types/rideRequest";


export const useRideRequest = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createRequest = async (data: CreateRideRequestData) => {
        setLoading(true);
        setError(null);
        try {

            const res = await fetch("/api/ride-request/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to create ride request")
            }

            return result;

        } catch (err) {
            console.log(err);
            const message = err instanceof Error ? err.message : "Failed to create ride request";
            setError(message);
            throw err;
        } finally {
            setLoading(false)
        }

    }

    return {
        createRequest,
        loading,
        error
    }

}