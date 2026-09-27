"use client";

// MOCKUP — static data, no socket/API wiring yet.
// Real version: "Confirm Payment Collected" calls a backend endpoint
// that marks the Ride as completed/paid.

import { Banknote, CheckCircle2 } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function RideCompletedPage() {
    return (
        <MapPanel>
            <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-teal-600" />
                    <p className="font-black text-slate-900">Ride completed</p>
                    <p className="mt-1 text-xs text-slate-500">
                        {MOCK_RIDE.distanceKm} km · {MOCK_RIDE.pickupAddress} → {MOCK_RIDE.dropoffAddress}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Fare</span>
                        <span className="font-black text-slate-900">Rs. {MOCK_RIDE.fare}</span>
                    </div>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-black text-white">
                    <Banknote size={18} />
                    Confirm Payment Collected
                </button>
            </div>
        </MapPanel>
    );
}