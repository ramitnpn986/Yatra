"use client";

import { MapPin } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { RiderRow } from "../_shared/StepPieces";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function ArrivedAtPickupPage() {
    return (
        <MapPanel>
            <div className="space-y-4">

                <div className="rounded-2xl border border-[#0b2c54]/10 bg-white p-6 text-center shadow-sm">

                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#ee8d39]/10">
                        <MapPin
                            size={28}
                            className="text-[#ee8d39]"
                        />
                    </div>

                    <p className="font-black text-[#0a1f39]">
                        You've arrived at pickup
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#6b7280]">
                        Waiting for {MOCK_RIDE.passengerName} to confirm
                    </p>

                </div>

                <RiderRow />

                <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-[#0b2c54]/10 py-3.5 text-sm font-black text-[#6b7280]"
                >
                    Start Ride — waiting for passenger
                </button>

                <p className="text-center text-[11px] font-medium text-[#6b7280]">
                    Button enables once the passenger confirms pickup on their side
                </p>

            </div>
        </MapPanel>
    );
}