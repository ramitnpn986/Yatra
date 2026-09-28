import { Request, Response } from "express";
import { Ride } from "../models/Ride.js";



export const getAllRideOfAnUser = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;

        if (!customerId) {
            return res.status(401).json({
                message: " User authentication is required",
                success: "false"
            })
        }

        const allRides = await Ride.find({ customer: customerId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Ride requests fetched successfully",
            count: allRides.length,
            rideRequests: allRides,
        });

    } catch (err) {
        console.error("Get all ride requests of an user error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all rides",
        });
    }
}


export const getRideByIdOfAnUser = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;
        const { rideId } = req.params;

        if (!customerId) {
            return res.status(401).json({
                message: " User authentication is required",
                success: "false"
            })
        }

        const ride = await Ride.findOne({ customer: customerId, _id: rideId });

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride  not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ride data fetched successfully",
            ride,
        });

    } catch (err) {
        console.error("Get ride error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch ride information",
        });
    }
}