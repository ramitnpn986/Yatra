"use client";

import { Star } from "lucide-react";
import MapPanel from "../_shared/MapPanel";
import { MOCK_RIDE } from "../_shared/mockRide";

export default function RatePassengerPage() {
    return (
        <MapPanel>
            <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <p className="font-black text-slate-900">Rate your passenger</p>
                    <p className="mt-1 text-xs text-slate-500">{MOCK_RIDE.passengerName}</p>
                    <div className="mt-4 flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                                key={n}
                                size={28}
                                className={n <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                            />
                        ))}
                    </div>
                </div>
                <textarea
                    placeholder="Optional note about this ride"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                    rows={3}
                />
                <button className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-black text-white">
                    Submit Rating
                </button>
            </div>
        </MapPanel>
    );
}