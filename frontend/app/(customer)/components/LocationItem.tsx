import { MapPin, Navigation } from "lucide-react";

type Location = {
    name: string;
    address: string;
    type: "Point";
    coordinates: [number, number];
};

function LocationItem({
    location,
    label,
    index,
}: {
    location: Location;
    label: string;
    index: number;
}) {
    return (
        <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
                <div
                    className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${index === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                        }`}
                >
                    {index === 0 ? ( <Navigation size={17} /> ) : ( <MapPin size={17} /> )}
                </div>

                <div className="h-full min-h-6 w-px bg-gray-200" />
            </div>

            <div className="min-w-0 flex-1 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {label}
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                    {location?.name || "Unnamed location"}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                    {location?.address || "Address not available"}
                </p>
                {location?.coordinates?.length === 2 && (
                    <p className="mt-1 text-xs text-gray-400">
                        {location.coordinates[1].toFixed(5)},{" "}
                        {location.coordinates[0].toFixed(5)}
                    </p>
                )}
            </div>
        </div>
    );
}


export default LocationItem;