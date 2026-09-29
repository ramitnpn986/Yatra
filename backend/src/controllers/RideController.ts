import { Request, Response } from "express";
import { Ride } from "../models/Ride.js";

export const getAllRideOfAnUser = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "User authentication is required",
            });
        }

        const allRides = await Ride.find({
            customer: customerId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Rides fetched successfully",
            count: allRides.length,
            rides: allRides,
        });

    } catch (err) {
        console.error("Get all rides of a user error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch all rides",
        });
    }
};

export const getRideByIdOfAnUser = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;
        const { rideId } = req.params;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "User authentication is required",
            });
        }

        const ride = await Ride.findOne({
            _id: rideId,
            customer: customerId,
        });

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ride data fetched successfully",
            ride,
        });

    } catch (err) {
        console.error("Get ride by ID error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch ride information",
        });
    }
};