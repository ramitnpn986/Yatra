"use client";

/**
 * Shared two-column layout: real map (pickup/dropoff + OSRM route) on
 * the side, step content as children. Used by every page under
 * transporter/ride/* so the map markup isn't duplicated seven times.
 */

import dynamic from "next/dynamic";
import { MOCK_RIDE } from "./mockRide";

const RideRouteMap = dynamic(() => import("./RideRouteMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center bg-slate-100">
            <p className="text-xs font-bold text-slate-400">Loading map...</p>
        </div>
    ),
});

export default function MapPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_420px]">
                <div className="order-1 h-72 overflow-hidden rounded-2xl border border-slate-200 shadow-sm lg:sticky lg:top-6 lg:order-2 lg:h-[calc(100vh-48px)]">
                    <RideRouteMap
                        pickupCoords={MOCK_RIDE.pickupCoords}
                        dropoffCoords={MOCK_RIDE.dropoffCoords}
                        pickupLabel={MOCK_RIDE.pickupAddress}
                        dropoffLabel={MOCK_RIDE.dropoffAddress}
                    />
                </div>

                <div className="order-2 max-w-md lg:order-1 lg:max-w-none">
                    {children}
                </div>
            </div>
        </div>
    );
}