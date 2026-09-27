"use client";

import { Phone, Star } from "lucide-react";
import { MOCK_RIDE } from "./mockRide";

export function RiderRow() {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
                <p className="font-black text-slate-900">{MOCK_RIDE.passengerName}</p>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {MOCK_RIDE.passengerRating}
                </div>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white">
                <Phone size={14} />
                Call
            </button>
        </div>
    );
}

export function RouteCard() {
    return (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                    <span className="my-1 h-8 w-px bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Pickup</p>
                        <p className="text-sm font-bold text-slate-800">{MOCK_RIDE.pickupAddress}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Dropoff</p>
                        <p className="text-sm font-bold text-slate-800">{MOCK_RIDE.dropoffAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}