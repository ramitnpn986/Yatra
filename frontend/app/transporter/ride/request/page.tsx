"use client";

// MOCKUP — static data, no socket/API wiring yet.
// Real version: driven by an incoming "new_ride_request" socket event.

import { CheckCircle2, X } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RiderRow, RouteCard } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function IncomingRequestPage() {
    return (
        <MapPanel>
            <div className="space-y-4">
                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-orange-600">New ride request</p>
                    <p className="mt-1 text-3xl font-black text-slate-900">Rs. {MOCK_RIDE.fare}</p>
                    <p className="text-xs text-slate-500">{MOCK_RIDE.distanceKm} km · {MOCK_RIDE.vehicleType}</p>
                </div>

                <RouteCard />
                <RiderRow />

                <div className="flex gap-3">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-3.5 text-sm font-black text-slate-600">
                        <X size={18} />
                        Reject
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-black text-white">
                        <CheckCircle2 size={18} />
                        Accept
                    </button>
                </div>
                <p className="text-center text-[11px] text-slate-400">Auto-expires in 45s if no response</p>
            </div>
        </MapPanel>
    );
}