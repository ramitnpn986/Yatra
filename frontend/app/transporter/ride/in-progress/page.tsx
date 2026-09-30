"use client";

import { Route } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RouteCard } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function RideInProgressPage() {
    return (
        <MapPanel>
            <div className="space-y-4">

                <div className="flex items-center justify-between rounded-xl bg-[#0a1f39] p-4 text-white">

                    <div className="flex items-center gap-2">
                        <Route
                            size={16}
                            className="text-[#ee8d39]"
                        />

                        <span className="text-sm font-bold">
                            Ride in progress
                        </span>
                    </div>

                    <span className="text-sm font-bold text-[#ee8d39]">
                        {MOCK_RIDE.etaMin} min left
                    </span>

                </div>

                <RouteCard />

                <button
                    type="button"
                    className="w-full rounded-xl bg-[#ee8d39] py-3.5 text-sm font-black text-white transition hover:bg-[#f59d50]"
                >
                    I've Arrived at Destination
                </button>

            </div>
        </MapPanel>
    );
}