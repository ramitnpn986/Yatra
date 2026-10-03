"use client";

import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../../(customer)/components/leafletIcon";

type Coordinates = [number, number];

interface RideRouteMapProps {
    pickupCoords: Coordinates;
    dropoffCoords: Coordinates;
    pickupLabel?: string;
    dropoffLabel?: string;
}

const pickupIcon = L.icon({
    iconUrl: "/user.png",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

const dropoffIcon = L.icon({
    iconUrl: "/destination.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
});

function FitToRoute({ points }: { points: Coordinates[] }) {
    const map = useMap();
    useEffect(() => {
        if (!points || points.length === 0) return;
        if (!map || !map.getContainer()) return;
        const bounds = L.latLngBounds(points);
        if (!bounds.isValid()) return;
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }, [points, map]);
    return null;
}

export default function RideRouteMap({
    pickupCoords,
    dropoffCoords,
    pickupLabel = "Pickup",
    dropoffLabel = "Dropoff",
}: RideRouteMapProps) {
    const [routeCoordinates, setRouteCoordinates] = useState<Coordinates[]>([]);

    useEffect(() => {
        let cancelled = false;

        const fetchRoute = async () => {
            try {
                const [pLat, pLng] = pickupCoords;
                const [dLat, dLng] = dropoffCoords;

                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${pLng},${pLat};${dLng},${dLat}` +
                    `?overview=full&geometries=geojson&steps=false`;

                const res = await fetch(url);
                if (!res.ok) return;

                const data = await res.json();
                if (cancelled || data.code !== "Ok" || !data.routes?.length) return;

                const coords: Coordinates[] = data.routes[0].geometry.coordinates.map(
                    (point: [number, number]) => [point[1], point[0]]
                );

                setRouteCoordinates(coords);
            } catch {
                if (!cancelled) setRouteCoordinates([pickupCoords, dropoffCoords]);
            }
        };

        fetchRoute();
        return () => {
            cancelled = true;
        };
    }, [pickupCoords, dropoffCoords]);

    return (
        <MapContainer
            center={pickupCoords}
            zoom={14}
            scrollWheelZoom={true}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitToRoute points={routeCoordinates.length ? routeCoordinates : [pickupCoords, dropoffCoords]} />

            <Marker position={pickupCoords} icon={pickupIcon}>
                <Popup>
                    <div className="text-sm">
                        <strong>{pickupLabel}</strong>
                    </div>
                </Popup>
            </Marker>

            <Marker position={dropoffCoords} icon={dropoffIcon}>
                <Popup>
                    <div className="text-sm">
                        <strong>{dropoffLabel}</strong>
                    </div>
                </Popup>
            </Marker>

            {routeCoordinates.length > 0 && (
                <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                        color: "#f97316",
                        weight: 6,
                        opacity: 0.9,
                        lineCap: "round",
                        lineJoin: "round",
                    }}
                />
            )}
        </MapContainer>
    );
}