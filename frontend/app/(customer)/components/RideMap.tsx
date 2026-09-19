"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type VehicleType = "car" | "ev" | "bike";

interface Vehicle {
  id: number;
  type: VehicleType;
  lat: number;
  lng: number;
  name: string;
  seats: number;
  price: number;
  eta: number;
}

interface RideMapProps {
  userCoords: [number, number];
  destinationCoords: [number, number] | null;
  filteredVehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  handleMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick,}: { onMapClick: (lat: number, lng: number) => void;}) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export default function RideMap({
  userCoords,
  destinationCoords,
  filteredVehicles,
  setSelectedVehicle,
  handleMapClick,
}: RideMapProps) {
  const [icons, setIcons] = useState<{
    car: L.Icon;
    ev: L.Icon;
    bike: L.Icon;
    user: L.Icon;
    destination: L.Icon;
  } | null>(null);

  useEffect(() => {
    setIcons({
      car: L.icon({
        iconUrl: "/car1.png",
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      }),

      ev: L.icon({
        iconUrl: "/ev_car.webp",
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      }),

      bike: L.icon({
        iconUrl: "/bike.webp",
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      }),

      user: L.icon({
        iconUrl: "/user.png",
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      }),

      destination: L.icon({
        iconUrl: "/destination.png",
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      }),
    });
  }, []);

  if (!icons) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    );
  }

  const routeCoords: [number, number][] = destinationCoords
    ? [
        userCoords,
        [
          (userCoords[0] + destinationCoords[0]) / 2,
          (userCoords[1] + destinationCoords[1]) / 2,
        ],
        destinationCoords,
      ]
    : [];

  return (
    <MapContainer
      center={userCoords}
      zoom={14}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={handleMapClick} />

      <Marker position={userCoords} icon={icons.user}>
        <Popup>Your current location</Popup>
      </Marker>

      {destinationCoords && (
        <Marker position={destinationCoords} icon={icons.destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {filteredVehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.lat, vehicle.lng]}
          icon={icons[vehicle.type]}
          eventHandlers={{
            click: () => setSelectedVehicle(vehicle),
          }}
        >
          <Popup>
            <div>
              <strong>{vehicle.name}</strong>
              <br />
              {vehicle.seats} seats
              <br />
              ETA: {vehicle.eta} min
              <br />
              Rs. {vehicle.price}
            </div>
          </Popup>
        </Marker>
      ))}

      {routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{
            color: "#2563eb",
            weight: 4,
            dashArray: "6, 6",
          }}
        />
      )}
    </MapContainer>
  );
}