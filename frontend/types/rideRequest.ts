export interface CreateRideRequestData {
    pickupLocation: {
        address: string;
        coordinates: [number, number];
    };

    dropoffLocation: {
        address: string;
        coordinates: [number, number];
    };

    distanceKm: number;
    estimatedFare: number;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
    passengerCount?: number;
} 