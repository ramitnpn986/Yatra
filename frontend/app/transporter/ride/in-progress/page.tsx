"use client";

// MOCKUP — static data, no socket/API wiring yet.
// Real version: live location streams to the customer app in real
// time via socket while this screen is active.

import { Route } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RouteCard } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function RideInProgressPage() {
    return (
        <MapPanel>
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-teal-700 p-4 text-white">
                    <div className="flex items-center gap-2">
                        <Route size={16} />
                        <span className="text-sm font-bold">Ride in progress</span>
                    </div>
                    <span className="text-sm font-bold">{MOCK_RIDE.etaMin} min left</span>
                </div>
                <RouteCard />
                <button className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-black text-white">
                    I've Arrived at Destination
                </button>
            </div>
        </MapPanel>
    );
}