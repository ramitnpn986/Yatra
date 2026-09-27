"use client";

// MOCKUP — static data, no socket/API wiring yet.
// Real version: transporter's live location streams via socket,
// "I've Arrived" triggers a status update to the backend.

import { Clock } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RiderRow, RouteCard } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function HeadingToPickupPage() {
    return (
        <MapPanel>
            <div className="space-y-4">
                <RiderRow />
                <RouteCard />
                <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-400" />
                        <span className="text-sm font-bold">{MOCK_RIDE.etaMin} min to pickup</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{MOCK_RIDE.distanceKm} km</span>
                </div>
                <button className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-black text-white">
                    I've Arrived at Pickup
                </button>
            </div>
        </MapPanel>
    );
}