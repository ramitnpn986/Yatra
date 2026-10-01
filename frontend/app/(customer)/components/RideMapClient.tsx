"use client";

import dynamic from "next/dynamic";

const RideMap = dynamic(() => import("./RideMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <p className="text-sm text-gray-500">Loading map...</p>
        </div>
    ),
});

export default RideMap; 