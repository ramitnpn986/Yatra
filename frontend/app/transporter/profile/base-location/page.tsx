"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";

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
        ward: "N/A"
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
                    throw new Error(data.message || "Failed to fetch profile");
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
                console.error("Failed to fetch transporter profile:", err);
                toast.error(err instanceof Error? err.message: "Failed to load location");
            } finally {
                setAddressLoading(false);
            }
        };
        fetchExistingLocation();
    }, []);


    const fetchAddress = async (lat: number, lng: number) => {
        setAddressLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                { headers: { "Accept-Language": "np" } }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch address")
            }

            const data = await res.json();
            const addrComponents = data.address || {};

            const extractedDetails = {
                address: data.display_name || "Custom Pin",
                province: addrComponents.state || "N/A",
                district: addrComponents.county || "N/A",
                municipality: addrComponents.municipality || addrComponents.city || addrComponents.town || addrComponents.village || "N/A",
                ward: addrComponents.ward || "N/A"
            };

            setLocation((prev) => ({
                ...prev,
                ...extractedDetails
            }));

        } catch (err) {
            console.error("Failed to parse address components", err);
            setLocation((prev) => ({ ...prev, address: "Manual location pin" }));
        } finally {
            setAddressLoading(false);
        }
    };

    const handleLocationSelect = ([lat, lng]: [number, number]) => {
        if (!isEditMode) return;
        setLocation(prev => ({ ...prev, latitude: lat, longitude: lng }));
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
                setLocation((prev) => ({ ...prev, latitude, longitude }));
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
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const toggleEditMode = () => {
        setIsEditMode(true);
        toast.info("Map editing enabled. Click anywhere to move pin.");
    };

    const cancelEdit = () => {
        if (savedLocation) setLocation(savedLocation);
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
                        Number(location.latitude)
                    ],
                    address: location.address,
                    province: location.province,
                    district: location.district,
                    municipality: location.municipality,
                    ward: location.ward
                }
            };

            const res = await fetch(`/api/transporter/setlocation`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update location");
            }

            toast.success("Location updated successfully!");
            setSavedLocation(location);
            setIsEditMode(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-2 lg:p-4 font-sans">
            <div className="max-w-7xl mx-auto mb-6  flex justify-end items-center">
                <div className="flex gap-3">
                    {isEditMode ? (
                        <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-all shadow-sm text-sm font-black uppercase tracking-tighter"
                        >
                            Discard Changes
                        </button>
                    ) : (
                        <button
                            onClick={toggleEditMode}
                            className="flex items-center gap-2 bg-orange-600 px-5 py-2.5 rounded-xl text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 text-sm font-semibold"
                        >
                            Update Service Area
                        </button>
                    )}
                </div>
            </div>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm ">
                        <div className="flex items-center gap-4 mb-6">
                            <h1 className="text-2xl font-black text-slate-900"> {isEditMode ? "Select New Base" : "Current Location"} </h1>
                        </div>

                        <button type="button" onClick={getCurrentLocation} disabled={addressLoading || loading}
                            className="w-full mb-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold py-2 px-4 rounded-xl transition-all text-xs"
                        >
                            {addressLoading ? "Locating..." : "Use Current Location"}
                        </button>

                        <div className={`p-5 rounded-2xl transition-all`}>
                            <span className="text-[10px] font-black  text-slate-400 block mb-2">Location Address</span>
                            {addressLoading ? (
                                <div className="flex items-center gap-2 py-1 ">
                                    <span className="text-sm font-bold text-slate-400 italic">Updating...</span>
                                </div>
                            ) : (<p className="text-sm font-bold text-slate-800"> {location.address} </p>)}

                            <div className="mt-4  border-slate-200/60 grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                                <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                                    <span className="text-[10px]  text-slate-400 ">Province</span>
                                    <span className="text-slate-800 truncate block">{location.province}</span>
                                </div>
                                <div className="bg-slate-50/80 p-2  border-slate-100">
                                    <span className="text-[10px]  text-slate-400 ">District</span>
                                    <span className="text-slate-800 truncate block">{location.district}</span>
                                </div>
                                <div className="bg-slate-50/80 p-2  border-slate-100">
                                    <span className="text-[10px]  text-slate-400 ">Municipality</span>
                                    <span className="text-slate-800 truncate block">{location.municipality}</span>
                                </div>
                                <div className="bg-slate-50/80 p-2  border-slate-100">
                                    <span className="text-[10px]  text-slate-400 ">Ward No.</span>
                                    <span className="text-orange-600 font-black block">{location.ward}</span>
                                </div>
                            </div>
                        </div>

                        {isEditMode && (
                            <div className="mt-8">
                                <button
                                    onClick={submitHandler}
                                    disabled={loading || addressLoading}
                                    className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-200 text-white font-black py-4 rounded shadow-xl transition-all flex items-center justify-center gap-3 "
                                >
                                    {loading ? <>loading ....</> : <>Save Changes </>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`lg:col-span-8 bg-white p-4 rounded-2xl shadow-sm border transition-all h-[500px] relative overflow-hidden ${isEditMode ? 'border-orange-400 ring-4 ring-orange-50' : 'border-slate-200'}`}>
                    <div className="w-full h-full overflow-hidden ">
                        <LocationPicker
                            key={`${location.latitude}-${location.longitude}`}
                            onSelect={handleLocationSelect}
                            currentCoords={[location.latitude, location.longitude]}
                            isEditable={isEditMode}
                        />
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                        <div className={`${isEditMode ? 'bg-orange-600' : 'bg-slate-900/80'} backdrop-blur-md text-white text-[11px] font-black px-6 py-2 rounded-full  shadow-2xl transition-colors`}>
                            {isEditMode ? "Click Map to Change Location" : "Location Locked"}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default TransporterLocationSelection;