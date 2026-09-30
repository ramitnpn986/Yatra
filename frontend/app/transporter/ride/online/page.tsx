"use client";

import { Wifi } from "lucide-react";
import MapPanel from "../_shared/MapPanel";

export default function BackOnlinePage() {
    return (
        <MapPanel>
            <div className="space-y-4 text-center">

                <div className="rounded-2xl border border-[#0b2c54]/10 bg-white p-8 shadow-sm">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ee8d39]/10">
                        <Wifi
                            size={28}
                            className="text-[#ee8d39]"
                        />
                    </div>

                    <p className="font-black text-[#0a1f39]">
                        You're back online
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#6b7280]">
                        Ready for the next ride request
                    </p>

                </div>

            </div>
        </MapPanel>
    );
}