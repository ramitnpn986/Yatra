
import mongoose from "mongoose";

const transportProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [4, "Transporter name must consist at least 4 characters"],
            maxLength: [50, "Transporter name must not exceed 50 characters"],
        },

        phone: {
            type: String,
            required: true,
            match: [/^(98|97)\d{8}$/, "Please enter a valid Nepali mobile number"],
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        transporterRole: {
            type: String,
            enum: ["rider", "booking-partner"],
            default: "rider",
            required: true,
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

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },

            address: { type: String, },
            province: { type: String, },
            district: { type: String, },
            municipality: { type: String, },
            ward: { type: String, }
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
            lastUpdatedAt: {
                type: Date,
                default: Date.now,
            },
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


        documents: {
            citizenshipCard: String,
            drivingLicense: String,
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

        verifiedAt: Date,

        isAvailable: {
            type: Boolean,
            default: true,
        },

        isBlocked: {
            type: Boolean,
            default: false,
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
            lastUpdatedAt: new Date(),
        };
    }
});


transportProviderSchema.index({
    currentLocation: "2dsphere",
});

export const TransportProvider = mongoose.model("TransportProvider", transportProviderSchema);
