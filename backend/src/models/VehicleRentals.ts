import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

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
            validate: {
                validator: (value: number[]) =>
                    value.length === 2 &&
                    value[0] >= -180 &&
                    value[0] <= 180 &&
                    value[1] >= -90 &&
                    value[1] <= 90,
                message:"Coordinates must be [longitude, latitude]",
            },
        },
    },
    { _id: false }
);

const vehicleRentalSchema = new mongoose.Schema(
    {
        bookingNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        transporter: {
            type: Schema.Types.ObjectId,
            ref: "TransportProvider",
            required: true,
        },

        vehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },

        vehicleType: {
            type: String,
            enum: ["Bike", "Car", "Truck", "Bus"],
            required: true,
        },

        rentalType: {
            type: String,
            enum: ["self-drive", "with-driver"],
            required: true,
        },

        pickupLocation: {
            type: locationSchema,
            required: true,
        },

        destinations: {
            type: [locationSchema],
            required: true,
            validate: {
                validator: (value: unknown[]) => value.length > 0,
                message: "At least one destination is required",
            },
        },
        totalPassengers :{
              type: Number,
              required: true,
        },

        returnLocation: {
            type: locationSchema,
            required: true,
        },

        totalEstimatedDistanceKm: {
            type: Number,
            required: true,
            min: 0,
        },

        estimatedDurationMinutes: {
            type: Number,
            min: 0,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        rentalDays: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "rejected",
                "active",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        rejectedReason: {
            type: String,
            trim: true,
        },

        baseRentalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        includedDistanceKm: {
            type: Number,
            required: true,
            min: 0,
        },

        extraDistanceKm: {
            type: Number,
            default: 0,
            min: 0,
        },

        extraDistanceCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        driverCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        pricePerDay: {
            type: Number,
            required: true,
            min: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        securityDeposit: {
            type: Number,
            default: 0,
            min: 0,
        },


        cancelledBy: {
            type: String,
            enum: ["customer", "transporter", "admin"],
        },

        cancelledReason: {
            type: String,
            trim: true,
        },

        documentsSubmitted: {
            type: Boolean,
            default: false,
        },

        paymentStatus: {
            type: String,
            enum: [
                "unpaid",
                "deposit_paid",
                "fully_paid",
                "refunded",
            ],
            default: "unpaid",
        },

        requestedAt: {
            type: Date,
            default: Date.now,
        },

        acceptedAt: {
            type: Date,
        },

        rejectedAt: {
            type: Date,
        },

        startedAt: {
            type: Date,
        },

        completedAt: {
            type: Date,
        },

        cancelledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const VehicleRental = mongoose.model( "VehicleRental", vehicleRentalSchema);