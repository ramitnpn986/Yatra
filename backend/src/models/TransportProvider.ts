import  validator  from 'validator';
import mongoose from "mongoose";


const transportProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [4, "Transporter name must consist at least 4 characters"],
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        phone: {
            type: String,
            required: true,
            match: [/^(98|97)\d{8}$/, "Please enter a valid Nepali mobile number"],
        },

        profileImage: {
            url: {
                type: String,
                default: "",
            },
            public_id: {
                type: String,
                default: "",
            },
        },
        role:{
            type: String,
            enum: ["rider","booking-partner"],
            default: "rider"
        },
        location:  {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],  // [longitude, latitude]
                required: true,
            },

            address: { type: String,  },
            province: { type: String,  },
            district: { type: String,  },
            municipality: { type: String, },
            ward: { type: String, }
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isKycCompleted: {
            type: Boolean,
            default: false,
        },

        isKycDataSubmitted: {
            type: Boolean,
            default: false,
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        verifiedAt: Date,

        documents: {
            citizenshipCard: String,
            drivingLicense: String,
            vehicleRegistration: String,
        },

        vehicle: {
            type: {
                type: String,
                enum: ["Bike", "Car", "Truck", "Bus"],
                required: false,
            },
            vehiclePhoto: {
                type: String,
            },
            numberPlate: {
                type: String,
                required: false,
            },
            capacityKg: {
                type: Number,
                required: false,
            },
        },

        serviceAreas: [
            {
                type: String,
            },
        ],

        pricePerKm: {
            type: Number,
            required: false,
        },

        currentLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [85.3240, 27.7172],
            },
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
        resetOtp: {
            type: String
        },
        otpExpire: {
            type: Date
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }

);


transportProviderSchema.pre("save", async function () {

    if (this.isNew && this.location?.coordinates) {

        this.currentLocation = {
            type: "Point",
            coordinates: this.location.coordinates,
        };
    }
});


transportProviderSchema.index({
    currentLocation: "2dsphere",
});

export const TransportProvider = mongoose.model("TransportProvider", transportProviderSchema);
