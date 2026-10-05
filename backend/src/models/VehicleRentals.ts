import mongoose, {Schema} from "mongoose";

const vehicleRentalSchema=new mongoose.Schema({
    bookingNumber: {
         type: String,
         required: true,
         unique: true,
         trim: true,

    },
    customer:{
        type:Schema.Types.ObjectId,
        ref:"Customer",
        required:true,
    },
    transporter:{
        type:Schema.Types.ObjectId,
        ref:"TransportProvider",
        required:true,
    },
    vehicle:{
        type:Schema.Types.ObjectId,
        ref:"Vehicle",
        required:true,
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
        address: { type: String, required: true, trim: true },
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
    },
 
    returnLocation: {
        address: { type: String, required: true, trim: true },
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
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
 
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected", "active", "completed", "cancelled"],
        default: "pending",
    },
 
    rejectedReason: {
        type: String,
    },
 
    cancelledBy: {
        type: String,
        enum: ["customer", "transporter", "admin"],
    },
 
    cancelledReason: {
        type: String,
    },
 
    documentsSubmitted: {
        type: Boolean,
        default: false,
    },
 
    paymentStatus: {
        type: String,
        enum: ["unpaid", "deposit_paid", "fully_paid", "refunded"],
        default: "unpaid",
    },
 
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
 
}, { timestamps: true });
 
export const VehicleRental = mongoose.model("VehicleRental", vehicleRentalSchema);