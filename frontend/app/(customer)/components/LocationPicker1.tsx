"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";

import { useEffect, useState } from "react";
import "./leafletIcon";

type Coordinates = [number, number];

export interface SelectedLocation {
    type: "Point";
    coordinates: Coordinates;

    address: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
}

interface LocationPickerProps {
    onSelect: (location: SelectedLocation) => void;
    currentCoords: Coordinates;
    isEditable: boolean;
}

interface LocationMarkerProps {
    position: Coordinates;
    setPosition: React.Dispatch< React.SetStateAction<Coordinates>>;
    onSelect: (location: SelectedLocation) => void;
    isEditable: boolean;
}

const ChangeView = ({ center}: { center: Coordinates;}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [center, map]);

    return null;
};

const LocationMarker = ({
    position,
    setPosition,
    onSelect,
    isEditable,
}: LocationMarkerProps) => {
    const [loading, setLoading] = useState(false);

    useMapEvents({
        click: async (e) => {
            if (!isEditable || loading) return;

            const latitude = e.latlng.lat;
            const longitude = e.latlng.lng;

            // Leaflet uses [lat, lng]
            const leafletCoordinates: Coordinates = [
                latitude,
                longitude,
            ];

            setPosition(leafletCoordinates);
            setLoading(true);

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            "Accept-Language": "en",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch location information"
                    );
                }

                const data = await response.json();

                const address = data.address || {};
                const selectedLocation: SelectedLocation = {
                    type: "Point",
                    coordinates: [
                        longitude,
                        latitude,
                    ],

                    address: data.display_name || "",
                    province: address.state || address.province || "",
                    district:
                        address.state_district ||
                        address.district ||
                        address.county ||
                        "",
                    municipality:
                        address.municipality ||
                        address.city ||
                        address.town ||
                        address.village ||
                        "",
                    ward:
                        address.ward ||
                        address.city_district ||
                        address.suburb ||
                        "",
                };

                onSelect(selectedLocation);
            } catch (error) {
                console.error("Reverse geocoding failed:", error);
                onSelect({
                    type: "Point",
                    coordinates: [ longitude, latitude],
                    address: "",
                    province: "",
                    district: "",
                    municipality: "",
                    ward: "",
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
            <Marker position={position} />

            {loading && (
                <div className="absolute right-3 top-3 z-[1000] rounded-lg bg-white px-3 py-2 text-xs shadow-md">
                    Getting location...
                </div>
            )}
        </>
    );
};

const LocationPicker1 = ({ onSelect, currentCoords, isEditable}: LocationPickerProps) => {
    const [position, setPosition] = useState<Coordinates>(currentCoords);

    useEffect(() => {
        setPosition(currentCoords);
    }, [currentCoords]);

    return (
        <MapContainer center={position} zoom={13} className="h-full w-full">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <ChangeView center={position} />
            <LocationMarker
                position={position}
                setPosition={setPosition}
                onSelect={onSelect}
                isEditable={isEditable}
            />
        </MapContainer>
    );
};

export default LocationPicker1;