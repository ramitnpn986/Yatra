"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react"; import "./leafletIcon";

type Coordinates = [number, number];

interface ChangeViewProps {
    center: Coordinates;
}

interface LocationPickerProps {
    onSelect: (coordinates: Coordinates) => void;
    currentCoords: Coordinates;
    isEditable: boolean;
}

const ChangeView = ({ center }: ChangeViewProps) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [center, map]);
    return null;
};

const LocationMarker = ({ position, setPosition, onSelect, isEditable, }: {
    position: Coordinates;
    setPosition: React.Dispatch<React.SetStateAction<Coordinates>>;
    onSelect: (coordinates: Coordinates) => void;
    isEditable: boolean;
}) => {
    useMapEvents({ click(e) {
            if (!isEditable) return;
            const location: Coordinates = [e.latlng.lat, e.latlng.lng,];
            setPosition(location);
            onSelect(location);
        },
    });
    return <Marker position={position} />;
};


const LocationPicker = ({
  onSelect,
  currentCoords,
  isEditable,
}: LocationPickerProps) => {
  const [position, setPosition] = useState<Coordinates>(currentCoords);

  useEffect(() => {
    setPosition(currentCoords);
  }, [currentCoords]);

  return (
    <MapContainer  center={position} zoom={13} className="h-full w-full">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <ChangeView center={position} />
      <LocationMarker position={position} setPosition={setPosition} onSelect={onSelect} isEditable={isEditable}/>
    </MapContainer>
  );
};

export default LocationPicker;