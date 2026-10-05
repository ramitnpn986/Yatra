"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Save } from "lucide-react";

const LocationPicker = dynamic(
    () => import("@/app/(customer)/components/LocationPicker"),
    { ssr: false }
);

type LocationData = {
    latitude: number;
    longitude: number;
    address: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
};

const TransporterLocationSelection = () => {
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [savedLocation, setSavedLocation] = useState<LocationData | null>(null);

    const router = useRouter();

    const [location, setLocation] = useState({
        latitude: 27.7172,
        longitude: 85.3240,
        address: "Kathmandu, Nepal",
        province: "N/A",
        district: "N/A",
        municipality: "N/A",
        ward: "N/A",
    });

    useEffect(() => {
        const fetchExistingLocation = async () => {
            setAddressLoading(true);

            try {
                const res = await fetch("/api/transporter/profile", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    if ([401, 403, 404].includes(res.status)) {
                        router.replace("/transporter/login");
                        return;
                    }

                    throw new Error(
                        data.message || "Failed to fetch profile"
                    );
                }

                if (data.success && data.transporter?.location) {
                    const loc = data.transporter.location;

                    const initialData = {
                        latitude: loc?.coordinates?.[1] ?? 27.7172,
                        longitude: loc?.coordinates?.[0] ?? 85.3240,
                        address: loc?.address || "Not available",
                        province: loc?.province || "N/A",
                        district: loc?.district || "N/A",
                        municipality: loc?.municipality || "N/A",
                        ward: loc?.ward || "N/A",
                    };

                    setLocation(initialData);
                    setSavedLocation(initialData);
                }
            } catch (err) {
                console.error( "Failed to fetch transporter profile:",err);
                toast.error(err instanceof Error ? err.message : "Failed to load location");
            } finally {
                setAddressLoading(false);
            }
        };

        fetchExistingLocation();
    }, []);

    const fetchAddress = async (lat: number, lng: number) => {
        setAddressLoading(true);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                {
                    headers: {  "Accept-Language": "np"},
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch address");
            }

            const data = await res.json();
            const addrComponents = data.address || {};

            const extractedDetails = {
                address: data.display_name || "Custom Pin",
                province: addrComponents.state || "N/A",
                district: addrComponents.county || "N/A",
                municipality:
                    addrComponents.municipality ||
                    addrComponents.city ||
                    addrComponents.town ||
                    addrComponents.village ||
                    "N/A",
                ward: addrComponents.ward || "N/A",
            };

            setLocation((prev) => ({ ...prev, ...extractedDetails}));
        } catch (err) {
            console.error("Failed to parse address components", err);
            toast.error("Failed to fetch address details. Please try again.");
            setLocation((prev) => ({...prev, address: "Manual location pin"}));
        } finally {
            setAddressLoading(false);
        }
    };

    const handleLocationSelect = ([lat, lng]: [number, number]) => {
        if (!isEditMode) return;
        setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng}));
        fetchAddress(lat, lng);
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser.");
            return;
        }

        if (!isEditMode) {
            setIsEditMode(true);
            toast.info("Map editing enabled via current location detection.");
        }

        setAddressLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setLocation((prev) => ({...prev, latitude, longitude}));
                fetchAddress(latitude, longitude);
                toast.success("Current location detected!");
            },
            (error) => {
                setAddressLoading(false);

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Please allow location access in your browser settings."); 
                        break;

                    default:
                        toast.error("Could not obtain wireless location access.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    };

    const toggleEditMode = () => {
        setIsEditMode(true);
        toast.info("Map editing enabled. Click anywhere to move pin.");
    };

    const cancelEdit = () => {
        if (savedLocation) {
            setLocation(savedLocation);
        }
        setIsEditMode(false);
        toast.warning("Changes discarded");
    };

    const submitHandler = async () => {
        try {
            setLoading(true);

            const payload = {
                location: {
                    type: "Point",
                    coordinates: [
                        Number(location.longitude),
                        Number(location.latitude),
                    ],
                    address: location.address,
                    province: location.province,
                    district: location.district,
                    municipality: location.municipality,
                    ward: location.ward,
                },
            };

            const res = await fetch(
                `/api/transporter/set-location`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to update location"
                );
            }

            toast.success("Location updated successfully!");

            setSavedLocation(location);
            setIsEditMode(false);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to update";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const mapCoordinates = useMemo(
        () =>
            [
                location.latitude,
                location.longitude,
            ] as [number, number],
        [location.latitude, location.longitude]
    );

    return (
        <div className="min-h-screen bg-[#f5f7fa] p-4 font-sans lg:p-6">
          
            <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0a1f39]">
                        Base Location
                    </h1>

                    <p className="mt-1 text-sm font-medium text-[#b0aeae]">
                        Manage your transporter service area
                    </p>
                </div>

                <div className="flex gap-3">
                    {isEditMode ? (
                        <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-2.5 text-sm font-bold text-red-500 shadow-sm transition-all hover:bg-red-50"
                        >
                            Discard Changes
                        </button>
                    ) : (
                        <button
                            onClick={toggleEditMode}
                            className="flex items-center gap-2 rounded-xl bg-[#ee8d39] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ee8d39]/20 transition-all hover:bg-[#f59d50]"
                        >
                            <MapPin size={17} />
                            Update Service Area
                        </button>
                    )}
                </div>
            </div>

            <main className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 lg:grid-cols-12">
            
                <div className="space-y-6 lg:col-span-4">
                    <div className="overflow-hidden rounded-2xl border border-[#0b2c54]/10 bg-white shadow-sm">
                        <div className="bg-[#0a1f39] px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ee8d39] text-white">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        {isEditMode
                                            ? "Select New Base"
                                            : "Current Location"}
                                    </h2>

                                    <p className="text-xs text-[#b0aeae]">
                                        Your registered service location
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={
                                    addressLoading || loading
                                }
                                className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5f7fa] px-4 py-3 text-sm font-bold text-[#0b2c54] transition-all hover:bg-[#0b2c54]/10 disabled:opacity-50"
                            >
                                <Navigation size={16} />

                                {addressLoading
                                    ? "Locating..."
                                    : "Use Current Location"}
                            </button>

                            <div className="rounded-2xl border border-[#0b2c54]/10 bg-[#f5f7fa] p-5">
                                <span className="mb-2 block text-[10px] font-black uppercase tracking-wide text-[#b0aeae]">
                                    Location Address
                                </span>

                                {addressLoading ? (
                                    <div className="flex items-center gap-2 py-1">
                                        <span className="text-sm font-bold italic text-[#b0aeae]">
                                            Updating...
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold leading-6 text-[#0a1f39]">
                                        {location.address}
                                    </p>
                                )}

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="rounded-xl border border-[#0b2c54]/10 bg-white p-3">
                                        <span className="text-[10px] font-semibold text-[#b0aeae]">
                                            Province
                                        </span>

                                        <span className="block truncate text-sm font-bold text-[#0a1f39]">
                                            {location.province}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-[#0b2c54]/10 bg-white p-3">
                                        <span className="text-[10px] font-semibold text-[#b0aeae]">
                                            District
                                        </span>

                                        <span className="block truncate text-sm font-bold text-[#0a1f39]">
                                            {location.district}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-[#0b2c54]/10 bg-white p-3">
                                        <span className="text-[10px] font-semibold text-[#b0aeae]">
                                            Municipality
                                        </span>

                                        <span className="block truncate text-sm font-bold text-[#0a1f39]">
                                            {location.municipality}
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-[#0b2c54]/10 bg-white p-3">
                                        <span className="text-[10px] font-semibold text-[#b0aeae]">
                                            Ward No.
                                        </span>

                                        <span className="block text-sm font-black text-[#ee8d39]">
                                            {location.ward}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isEditMode && (
                                <div className="mt-6">
                                    <button
                                        onClick={submitHandler}
                                        disabled={
                                            loading ||
                                            addressLoading
                                        }
                                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#ee8d39] py-3.5 font-bold text-white shadow-lg shadow-[#ee8d39]/20 transition-all hover:bg-[#f59d50] disabled:bg-slate-200"
                                    >
                                        <Save size={17} />

                                        {loading
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`relative h-[500px] overflow-hidden rounded-2xl border bg-white p-3 shadow-sm transition-all lg:col-span-8 ${
                        isEditMode
                            ? "border-[#ee8d39] ring-4 ring-[#ee8d39]/10"
                            : "border-[#0b2c54]/10"
                    }`}
                >
                    <div className="h-full w-full overflow-hidden rounded-xl">
                        <LocationPicker
                            onSelect={handleLocationSelect}
                            currentCoords={mapCoordinates}
                            isEditable={isEditMode}
                        />
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <div
                            className={`whitespace-nowrap rounded-full px-6 py-2.5 text-[11px] font-black text-white shadow-2xl backdrop-blur-md transition-colors ${
                                isEditMode
                                    ? "bg-[#ee8d39]"
                                    : "bg-[#0a1f39]/90"
                            }`}
                        >
                            {isEditMode
                                ? "Click Map to Change Location"
                                : "Location Locked"}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TransporterLocationSelection;