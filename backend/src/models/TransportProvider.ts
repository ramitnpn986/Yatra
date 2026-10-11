import mongoose from "mongoose";

const transportProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [
                4, "Transporter name must consist at least 4 characters",
            ],
            maxlength: [
                50, "Transporter name must not exceed 50 characters",
            ],
        },

        phone: {
            type: String,
            required: true,
            match: [
                /^(98|97)\d{8}$/,
                "Please enter a valid Nepali mobile number",
            ],
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
                default: undefined,
                validate: {
                    validator: (coordinates: number[] | undefined) => {
                        if (coordinates === undefined) return true;

                        return (
                            coordinates.length === 2 &&
                            coordinates.every(Number.isFinite) &&
                            coordinates[0] >= -180 &&
                            coordinates[0] <= 180 &&
                            coordinates[1] >= -90 &&
                            coordinates[1] <= 90
                        );
                    },
                    message:"Coordinates must be [longitude, latitude] with valid values.",
                },
            },

            address: String,
            province: String,
            district: String,
            municipality: String,
            ward: String,
        },

  
        currentLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number],
                default: undefined,
                validate: {
                    validator: (coordinates: number[] | undefined) => {
                        if (coordinates === undefined) return true;

                        return (
                            coordinates.length === 2 &&
                            coordinates.every(Number.isFinite) &&
                            coordinates[0] >= -180 &&
                            coordinates[0] <= 180 &&
                            coordinates[1] >= -90 &&
                            coordinates[1] <= 90
                        );
                    },
                    message:
                        "Coordinates must be [longitude, latitude] with valid values.",
                },
            },

            lastUpdatedAt: {
                type: Date,
                default: undefined,
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
    {
        timestamps: true,
    }
);

transportProviderSchema.pre("save", function () {
    if (!this.isNew) return;

    const coordinates = this.location?.coordinates;

    const hasValidCoordinates =
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        coordinates.every(Number.isFinite) &&
        coordinates[0] >= -180 &&
        coordinates[0] <= 180 &&
        coordinates[1] >= -90 &&
        coordinates[1] <= 90;

    if (hasValidCoordinates) {
        this.currentLocation = {
            type: "Point",
            coordinates: [...coordinates],
            lastUpdatedAt: new Date(),
        };
    } else {
    
        this.currentLocation = undefined;
    }
});

transportProviderSchema.index({
    currentLocation: "2dsphere",
});

export const TransportProvider = mongoose.model( "TransportProvider",  transportProviderSchema);