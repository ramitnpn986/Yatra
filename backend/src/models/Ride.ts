import mongoose, { Schema } from "mongoose";

const rideSchema = new mongoose.Schema({

    rideRequest: {
        type: Schema.Types.ObjectId,
        ref: "RideRequest",
        unique: true,
        required: true
    },

    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    transporter: {
        type: Schema.Types.ObjectId,
        ref: "TransportProvider",
        required: true,
    },

    pickupLocation: {
        address: {
            type: String,
            requred: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    dropoffLocation: {
        address: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number],
            required: true,
        },
    },

    distanceKm: {
        type: Number,
        required: true,
        min: 0,
    },

    estimatedFare: {
        type: Number,
        required: true,
        min: 0,
    },

    finalFare: {
        type: Number,
        min: 0
    },
    vehicleType: {
        type: String,
        enum: ["Bike", "Car", "Truck", "Bus"],
        required: true
    },
    passengerCount: {
        type: Number,
        min: 1,
        default: 1
    },
    status: {
        type: String,
        emum: [
            "confirmed",
            "driver_arriving",
            "driver_arrived",
            "started",
            "arrived_destination",
            "completed",
            "cancelled"
        ],
        default: "confirmed"
    },
    cancelledBy: {
        type: String,
        enum: ["customer", "transporter", "admin"]
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },

    acceptedAt: {
        type: Date,
    },

    driverArrivedAt: {
        type: Date,
    },

    startedAt: {
        type: Date,
    },
    arrivedDestinationAt: {
        type: Date,
    },

    completedAt: {
        type: Date,
    },

    cancelledAt: {
        type: Date,
    },

})


export const Ride = mongoose.model("Ride", rideSchema);