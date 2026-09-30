"use client";

import { Banknote, CheckCircle2 } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function RideCompletedPage() {
    return (
        <MapPanel>
            <div className="space-y-4">

                <div className="rounded-2xl border border-[#0b2c54]/10 bg-white p-6 text-center shadow-sm">

                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2
                            size={32}
                            className="text-emerald-600"
                        />
                    </div>

                    <p className="font-black text-[#0a1f39]">
                        Ride completed
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#6b7280]">
                        {MOCK_RIDE.distanceKm} km ·{" "}
                        {MOCK_RIDE.pickupAddress} →{" "}
                        {MOCK_RIDE.dropoffAddress}
                    </p>

                </div>

                <div className="rounded-xl border border-[#0b2c54]/10 bg-white p-4 shadow-sm">

                    <div className="flex items-center justify-between text-sm">

                        <span className="font-medium text-[#6b7280]">
                            Fare
                        </span>

                        <span className="font-black text-[#0a1f39]">
                            Rs. {MOCK_RIDE.fare}
                        </span>

                    </div>

                </div>

                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ee8d39] py-3.5 text-sm font-black text-white transition hover:bg-[#f59d50]"
                >
                    <Banknote size={18} />
                    Confirm Payment Collected
                </button>

            </div>
        </MapPanel>
    );
}