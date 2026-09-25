import mongoose, { Schema } from "mongoose";


const RideRequestSchema = new mongoose.Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        pickupLocation: {
            address: {
                type: String,
                required: true,
                trim: true
            },

            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
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
                default: "Point",
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
            min: 0,
        },


        vehicleType: {
            type: String,
            enum: ["Bike", "Car", "Truck", "Bus"],
        },

        passengerCount: {
            type: Number,
            min: 1,
            default: 1,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "expired",
                "cancelled"
            ],
            default: "pending"
        },

        expiresAt: {
            type: Date,
            required: true
        },

        acceptedBy: {
            type: Schema.Types.ObjectId,
            ref: "TransportProvider"
        },

        acceptedAt: {
            type: Date,
        },

        cancelledAt: {
            type: Date,
        },

    }, { timestamps: true });

RideRequestSchema.index({
    pickupLocation: "2dsphere",
});

const RideRequest = mongoose.model("RideRequest", RideRequestSchema);
export default RideRequest;