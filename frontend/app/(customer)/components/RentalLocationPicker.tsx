// "use client";

// /**
//  * Replaces the broken "LocationPicker1" import in booking-filter/page.tsx.
//  * Single map, two sequential taps: first sets pickup, second sets return.
//  * Matches the reference design — labeled pins, "tap to set" helper text,
//  * clean pickup/return summary below.
//  *
//  * Reverse geocoding reuses the same Nominatim call pattern already used
//  * in (customer)/dashboard/page.tsx (getPlaceName), extended to also pull
//  * an approximate Nepal admin breakdown from Nominatim's address object.
//  * Nominatim's fields don't map 1:1 onto Nepal's province/district/
//  * municipality/ward system, so this is a best-effort approximation —
//  * good enough for display, not guaranteed precise.
//  */

// import { useState } from "react";
// import {
//     MapContainer,
//     TileLayer,
//     Marker,
//     Tooltip,
//     useMapEvents,
// } from "react-leaflet";
// import "./leafletIcon";
// import L from "leaflet";

// type Coordinates = [number, number];

// export interface SelectedLocation {
//     type: "Point";
//     coordinates: Coordinates; // [lat, lng] — caller converts to [lng, lat] for the backend if needed
//     address: string;
//     province: string;
//     district: string;
//     municipality: string;
//     ward: string;
// }

// interface RentalLocationPickerProps {
//     pickup: SelectedLocation | null;
//     returnLoc: SelectedLocation | null;
//     onPickupSelect: (location: SelectedLocation) => void;
//     onReturnSelect: (location: SelectedLocation) => void;
//     center?: Coordinates;
// }

// const pickupIcon = L.icon({
//     iconUrl: "/user.png",
//     iconSize: [36, 36],
//     iconAnchor: [18, 18],
// });

// const returnIcon = L.icon({
//     iconUrl: "/destination.png",
//     iconSize: [36, 36],
//     iconAnchor: [18, 36],
// });

// async function reverseGeocode(lat: number, lng: number): Promise<SelectedLocation> {
//     const fallback: SelectedLocation = {
//         type: "Point",
//         coordinates: [lat, lng],
//         address: "Selected location",
//         province: "",
//         district: "",
//         municipality: "",
//         ward: "",
//     };

//     try {
//         const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
//         );
//         if (!res.ok) return fallback;

//         const data = await res.json();
//         const a = data.address || {};

//         return {
//             type: "Point",
//             coordinates: [lat, lng],
//             address: data.display_name || "Selected location",
//             province: a.state || "",
//             district: a.county || a.district || "",
//             municipality: a.city || a.town || a.village || a.municipality || "",
//             ward: a.suburb || a.neighbourhood || "",
//         };
//     } catch {
//         return fallback;
//     }
// }

// function ClickHandler({
//     onMapClick,
// }: {
//     onMapClick: (lat: number, lng: number) => void;
// }) {
//     useMapEvents({
//         click(e) {
//             onMapClick(e.latlng.lat, e.latlng.lng);
//         },
//     });
//     return null;
// }

// export default function RentalLocationPicker({
//     pickup,
//     returnLoc,
//     onPickupSelect,
//     onReturnSelect,
//     center = [27.700769, 83.448349],
// }: RentalLocationPickerProps) {
//     const [geocoding, setGeocoding] = useState(false);

//     const handleMapClick = async (lat: number, lng: number) => {
//         setGeocoding(true);
//         const location = await reverseGeocode(lat, lng);
//         setGeocoding(false);

//         if (!pickup) {
//             onPickupSelect(location);
//         } else if (!returnLoc) {
//             onReturnSelect(location);
//         }
//         // Both already set — tapping again does nothing; use the
//         // "Change" buttons below the map to re-pick either point.
//     };

//     const mapCenter: Coordinates = pickup?.coordinates || center;

//     return (
//         <div className="relative h-full w-full">
//             <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
//                 <TileLayer
//                     attribution="&copy; OpenStreetMap contributors"
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <ClickHandler onMapClick={handleMapClick} />

//                 {pickup && (
//                     <Marker position={pickup.coordinates} icon={pickupIcon}>
//                         <Tooltip permanent direction="top" className="!rounded-full !border-0 !bg-slate-900 !px-3 !py-1 !text-xs !font-bold !text-white">
//                             Pickup
//                         </Tooltip>
//                     </Marker>
//                 )}

//                 {returnLoc && (
//                     <Marker position={returnLoc.coordinates} icon={returnIcon}>
//                         <Tooltip permanent direction="top" className="!rounded-full !border-0 !bg-orange-500 !px-3 !py-1 !text-xs !font-bold !text-white">
//                             Return
//                         </Tooltip>
//                     </Marker>
//                 )}
//             </MapContainer>

//             <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow">
//                 {geocoding
//                     ? "Locating..."
//                     : !pickup
//                     ? "Tap the map to set pickup"
//                     : !returnLoc
//                     ? "Now tap the map to set return"
//                     : "Pickup and return set — use Change below to adjust"}
//             </div>
//         </div>
//     );
// }
