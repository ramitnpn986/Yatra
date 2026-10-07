import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {
        transporter: {
            type: Schema.Types.ObjectId,
            ref: "TransportProvider",
            required: true,
        },

        vehicleType: {
            type: String,
            enum: ["Bike", "Car", "Truck", "Bus"],
            required: true,
        },

        brand: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        model: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        numberPlate: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        images: [
            {
                type: String,
                trim: true,
            },
        ],

        registrationDocument: {
            type: String,
        },

        seats: {
            type: Number,
            min: 1,
        },

        capacityKg: {
            type: Number,
            min: 0,
        },

        year: {
            type: Number,
            min: 1900,
            max: new Date().getFullYear(),
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        rentalAvailable: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

vehicleSchema.index({ transporter: 1 });

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);