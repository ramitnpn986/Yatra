"use client";

// MOCKUP — static data, no socket/API wiring yet.
// Real version: "Start Ride" enables once the passenger confirms
// pickup on their side (a socket event from the customer app).

import { MapPin } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RiderRow } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function ArrivedAtPickupPage() {
    return (
        <MapPanel>
            <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <MapPin size={28} className="mx-auto mb-2 text-teal-600" />
                    <p className="font-black text-slate-900">You've arrived at pickup</p>
                    <p className="mt-1 text-xs text-slate-500">Waiting for {MOCK_RIDE.passengerName} to confirm</p>
                </div>
                <RiderRow />
                <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-slate-200 py-3.5 text-sm font-black text-slate-400"
                >
                    Start Ride — waiting for passenger
                </button>
                <p className="text-center text-[11px] text-slate-400">
                    Button enables once the passenger confirms pickup on their side
                </p>
            </div>
        </MapPanel>
    );
}