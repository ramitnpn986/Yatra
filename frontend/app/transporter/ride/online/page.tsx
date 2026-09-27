"use client";

// MOCKUP — static, no socket/API wiring yet.
// Real version: sets isAvailable back to true via the same
// /api/transporter/availability endpoint used on the profile page.

import { Wifi } from "lucide-react";
import MapPanel from "../_shared/MapPanel";

export default function BackOnlinePage() {
    return (
        <MapPanel>
            <div className="space-y-4 text-center">
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                    <Wifi size={28} className="mx-auto mb-3 text-teal-600" />
                    <p className="font-black text-slate-900">You're back online</p>
                    <p className="mt-1 text-xs text-slate-500">Ready for the next ride request</p>
                </div>
            </div>
        </MapPanel>
    );
}