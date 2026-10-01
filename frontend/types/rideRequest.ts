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


export interface NewRideRequest {
      rideRequestId: string;
      pickupLocation:{
        address: string;
        type: "Point",
        coordinates: [number, number]
      };
      dropoffLocation:{
        address: string;
        type:"Point",
        coordinates: [number, number]
      };
      distanceKm: number;
      estimatedFare: number;

      vehicleType: "Bike" |"Car" | "Truck" | "Bus";
      passengerCount: number;
}