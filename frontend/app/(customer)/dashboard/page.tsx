
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {  MapPin, Car, Bike, Zap, Search, X, Clock, Users,} from "lucide-react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const RideMap = dynamic(() => import("../components/RideMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full flex items-center justify-center bg-gray-100">
            <p className="text-sm text-gray-500">Loading map...</p>
        </div>
    ),
});


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

const vehicles: Vehicle[] = [
    {
        id: 1,
        type: "car",
        lat: 27.6915,
        lng: 83.455,
        name: "Standard Car",
        seats: 4,
        price: 450,
        eta: 3,
    },
    {
        id: 2,
        type: "ev",
        lat: 27.698,
        lng: 83.448,
        name: "EV Green",
        seats: 4,
        price: 500,
        eta: 5,
    },
    {
        id: 3,
        type: "bike",
        lat: 27.686,
        lng: 83.442,
        name: "City Bike",
        seats: 1,
        price: 220,
        eta: 2,
    },
    {
        id: 4,
        type: "car",
        lat: 27.704,
        lng: 83.46,
        name: "Comfort Sedan",
        seats: 4,
        price: 400,
        eta: 6,
    },
];

export default function Page() {

    const [userCoords, setUserCoords] = useState<[number, number]>([27.700769, 83.448349,]);
    const [userAddress, setUserAddress] = useState("Current Location");
    const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
    const [destinationName, setDestinationName] = useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedType, setSelectedType] = useState<VehicleType | "all">("all");
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const [loadingLocation, setLoadingLocation] = useState(false);
    const [searching, setSearching] = useState(false);
    const [mapIcons, setMapIcons] = useState<any>(null);

    useEffect(() => {
        import("leaflet").then((module) => {
            const L = module.default; setMapIcons({
                car: L.icon({ iconUrl: "/car1.png", iconSize: [42, 42], iconAnchor: [21, 21], }),
                ev: L.icon({ iconUrl: "/ev_car.webp", iconSize: [42, 42], iconAnchor: [21, 21], }),
                bike: L.icon({ iconUrl: "/bike.webp", iconSize: [42, 42], iconAnchor: [21, 21], }),
                user: L.icon({ iconUrl: "/user.png", iconSize: [42, 42], iconAnchor: [21, 21], }),
                destination: L.icon({ iconUrl: "/destination.png", iconSize: [42, 42], iconAnchor: [21, 42], }),
            });
        });
    }, []);

    const getPlaceName = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );

            const data = await response.json();
            return data.display_name || "Selected Location";

        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            return "Selected Location";
        }
    };

    const handleCurrentLocation = () => {

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords: [number, number] = [position.coords.latitude, position.coords.longitude,];
                setUserCoords(coords);
                const address = await getPlaceName(coords[0], coords[1]);
                setUserAddress(address);
                setLoadingLocation(false);
            },
            () => {
                setLoadingLocation(false);
                alert("Unable to get your current location.");
            }
        );
    };

    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`);
            const data = await response.json();

            if (data.length === 0) {
                alert("Location not found.");
                return;
            }

            const location: [number, number] = [Number(data[0].lat), Number(data[0].lon),];

            setDestinationCoords(location);
            setDestinationName(data[0].display_name);

        } catch (error) {
            console.error("Search failed:", error);
            alert("Unable to search location.");
        } finally {
            setSearching(false);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setDestinationCoords([lat, lng]);
        setDestinationName("Fetching address...");
        const address = await getPlaceName(lat, lng);
        setDestinationName(address);
    };

    const clearDestination = () => {
        setSearchText("");
        setDestinationCoords(null);
        setDestinationName("");
    };

    const handleSearchKey = (event: React.KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") { handleSearch(); } };


    const filteredVehicles = selectedType === "all" ? vehicles : vehicles.filter((vehicle) => vehicle.type === selectedType);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6"> Let's get a ride today </h2>

                <div className="flex flex-wrap gap-6 justify-center mb-8">
                    <button onClick={() => setSelectedType("car")} className={`bg-gray-100 rounded-2xl flex flex-col gap-3 items-center p-4 w-44 border-2 transition ${selectedType === "car" ? "border-blue-500 bg-white shadow-md" : "border-transparent"}`} >
                        <Image src="/car1.png" width={120} height={80} alt="Car" className="h-16 object-contain" />
                        <span className="font-semibold text-gray-700 text-sm"> Car </span>
                    </button>

                    <button onClick={() => setSelectedType("ev")} className={`bg-gray-100 rounded-2xl flex flex-col gap-3 items-center p-4 w-44 border-2 transition ${selectedType === "ev" ? "border-blue-500 bg-white shadow-md" : "border-transparent"}`} >
                        <Image src="/ev_car.webp" width={120} height={80} alt="EV Car" className="h-16 object-contain" />
                        <span className="font-semibold text-gray-700 text-sm"> EV Car </span>
                    </button>

                    <button onClick={() => setSelectedType("bike")} className={`bg-gray-100 rounded-2xl flex flex-col gap-3 items-center p-4 w-44 border-2 transition ${selectedType === "bike" ? "border-blue-500 bg-white shadow-md" : "border-transparent"}`} >
                        <Image src="/bike.webp" width={120} height={80} alt="Bike" className="h-16 object-contain" />
                        <span className="font-semibold text-gray-700 text-sm"> Bike </span>
                    </button>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <button
                                onClick={handleCurrentLocation}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition w-full sm:w-auto"
                            >
                                <MapPin size={18} />
                                {loadingLocation ? "Locating..." : "Find your location"}
                            </button>

                            <p className="text-xs text-gray-500 truncate sm:max-w-[250px]">
                                <strong>Pickup:</strong> {userAddress}
                            </p>

                        </div>
                    </div>



                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2">

                        <div className="flex items-center">
                            <Search size={20} className="ml-2 text-gray-400 shrink-0" />

                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={handleSearchKey}
                                placeholder="Where do you want to go?"
                                className="flex-1 min-w-0 px-3 py-2 outline-none text-sm"
                            />

                            {searchText && (
                                <button
                                    onClick={clearDestination}
                                    className="p-2 rounded-full hover:bg-gray-100 shrink-0"
                                >
                                    <X size={18} />
                                </button>
                            )}

                            <button
                                onClick={handleSearch}
                                disabled={searching}
                                className="bg-black text-white px-4 py-2 rounded-xl font-medium text-sm shrink-0"
                            >
                                {searching ? "Searching..." : "Search"}
                            </button>

                        </div>
                    </div>

                </div>

                {destinationName && (
                    <div className="mb-6 w-fit max-w-full bg-white rounded-xl border border-gray-200 p-3 text-xs text-gray-600 shadow-sm">
                        <strong className="text-black">Destination:</strong>{" "}
                        {destinationName}
                    </div>
                )}

                <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200">

                    <RideMap
                        userCoords={userCoords}
                        destinationCoords={destinationCoords}
                        filteredVehicles={filteredVehicles}
                        selectedVehicle={selectedVehicle}
                        setSelectedVehicle={setSelectedVehicle}
                        handleMapClick={handleMapClick}
                    />


                    <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur rounded-2xl shadow-md p-1.5 flex gap-1">

                        <button onClick={() => setSelectedType("all")} className={` px-3 py-1.5 rounded-xl text-xs font-semibold 
                          ${selectedType === "all" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        >
                            All
                        </button>


                        <button onClick={() => setSelectedType("car")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1
                            ${selectedType === "car" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        > <Car size={14} />
                            Car
                        </button>


                        <button onClick={() => setSelectedType("ev")} className={` px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1
                            ${selectedType === "ev" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        >
                            <Zap size={14} />
                            EV
                        </button>


                        <button onClick={() => setSelectedType("bike")} className={` px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1
                            ${selectedType === "bike" ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        >
                            <Bike size={14} />
                            Bike
                        </button>

                    </div>


                    <div className="absolute bottom-4 left-4 right-4 z-[1000] max-w-md">
                        {selectedVehicle ? (
                            <div className="bg-white rounded-3xl shadow-xl p-5">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500"> Selected Vehicle </p>
                                        <h3 className="text-xl font-bold">{selectedVehicle.name}</h3>
                                    </div>

                                    <button onClick={() => setSelectedVehicle(null)} className="p-2 bg-gray-100 rounded-full">
                                        <X size={16} />
                                    </button>
                                </div>


                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <Clock size={16} className="mx-auto" />
                                        <p className="text-[10px] text-gray-500">  Arrival </p>
                                        <p className="font-bold text-sm"> {selectedVehicle.eta} min</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <Users size={16} className="mx-auto" />
                                        <p className="text-[10px] text-gray-500"> Seats </p>
                                        <p className="font-bold text-sm"> {selectedVehicle.seats}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <p className="text-[10px] text-gray-500"> Estimated </p>
                                        <p className="font-bold text-sm text-blue-600"> Rs. {selectedVehicle.price}</p>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl mt-4 font-bold text-sm">
                                    Request Ride
                                </button>

                            </div>

                        ) : (

                            <div className="bg-white rounded-3xl shadow-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold"> Nearby </p>
                                        <h3 className="text-sm font-bold"> Available Rides </h3>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                        {filteredVehicles.length} available
                                    </span>
                                </div>


                                <div className="flex gap-3 overflow-x-auto">
                                    {filteredVehicles.map(
                                        (vehicle) => (
                                            <button key={vehicle.id} onClick={() => setSelectedVehicle(vehicle)}
                                                className="min-w-[130px] border border-gray-200 hover:border-black rounded-2xl p-3 text-left bg-white shrink-0"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl">
                                                        <Image src={vehicle.type === "car" ? "/car1.png" : vehicle.type === "ev" ? "/EV-car.webp" : "/bike.webp"}
                                                            alt={vehicle.type}
                                                            width={45}
                                                            height={35}
                                                            className="w-11 h-9 object-contain"
                                                        />
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-green-600"> {vehicle.eta} min </span>
                                                </div>

                                                <p className="font-bold text-xs mt-2 truncate"> {vehicle.name} </p>
                                                <p className="text-[11px] text-gray-500"> Rs. {vehicle.price}</p>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

