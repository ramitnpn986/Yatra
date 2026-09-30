"use client";

import { CheckCircle2, X } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RiderRow, RouteCard } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function IncomingRequestPage() {
    return (
        <MapPanel>
            <div className="space-y-4">

                <div className="rounded-2xl border border-[#ee8d39]/30 bg-[#ee8d39]/10 p-5 text-center">

                    <p className="text-xs font-bold uppercase tracking-wide text-[#ee8d39]">
                        New ride request
                    </p>

                    <p className="mt-1 text-3xl font-black text-[#0a1f39]">
                        Rs. {MOCK_RIDE.fare}
                    </p>

                    <p className="text-xs font-medium text-[#6b7280]">
                        {MOCK_RIDE.distanceKm} km · {MOCK_RIDE.vehicleType}
                    </p>

                </div>

                <RouteCard />
            
                <RiderRow />

                <div className="flex gap-3">

                    <button
                        type="button"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0b2c54]/15 bg-white py-3.5 text-sm font-black text-[#0a1f39] transition hover:bg-[#f5f7fa]"
                    >
                        <X size={18} />
                        Reject
                    </button>

                    <button
                        type="button"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ee8d39] py-3.5 text-sm font-black text-white transition hover:bg-[#f59d50]"
                    >
                        <CheckCircle2 size={18} />
                        Accept
                    </button>

                </div>

                <p className="text-center text-[11px] font-medium text-[#6b7280]">
                    Auto-expires in 45s if no response
                </p>

            </div>
        </MapPanel>
    );
}