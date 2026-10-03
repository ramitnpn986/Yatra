import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema({

    transporter: {
        type: Schema.Types.ObjectId,
        ref: "Transporter",
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
    images: [
        {
            type: String,
            trim: true,
        },
    ],
    seats:{
        type: Number,
        required: true,
        min: 1,
    },
    year :{
         type: Number,
         min: 1900,
            max: new Date().getFullYear(),
    }


},{timestamps: true});


export const Vehicle = mongoose.model("Vehicle", vehicleSchema);