import { Request, Response } from "express";
import RideRequest from "../models/RideRequest.js";
import { Ride } from "../models/Ride.js";
import { TransportProvider } from "../models/TransportProvider.js";
import Customer from "../models/Customer.js";

export const createRideRequest = async (req: Request, res: Response) => {
    try {


        if (!req.user?.customerId) {
            return res.status(400).json({
                message: " Customer authentication required",
                success: false
            });
        }

        const customerId = req.user?.customerId;
        const customer = await Customer.findById(customerId).select("-password");

        if (customer?.isBlocked) {
            return res.status(400).json({
                message: "Your can not make ride request",
                success: false
            });
        }


        const { pickupLocation, dropoffLocation, distanceKm, estimatedFare, vehicleType, passengerCount } = req.body;

        if (!pickupLocation.coordinates || pickupLocation.coordinates.length !== 2 ||
            !dropoffLocation.coordinates || dropoffLocation.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination coordinates"
            })
        }


        if (distanceKm === undefined || estimatedFare === undefined || !vehicleType) {
            return res.status(400).json({
                success: false,
                message: "distance, fare and vehicle type are required",
            });
        }

        const hasOtherRideRequest = await RideRequest.findOne({
            customer: customerId,
            status: "pending",
            expiresAt: { $gt: new Date() }
        })

        if (hasOtherRideRequest) {
            return res.status(409).json({
                success: false,
                message: "You already have an active ride request",
                rideRequest: hasOtherRideRequest,
            });
        }

        const expiresAt = new Date(
            Date.now() + 60 * 1000
        );

        const rideRequest = await RideRequest.create({
            customer: customerId,
            pickupLocation: {
                address: pickupLocation.address,
                type: "Point",
                coordinates: pickupLocation.coordinates,
            },
            dropoffLocation: {
                address: dropoffLocation.address,
                type: "Point",
                coordinates: dropoffLocation.coordinates,
            },
            distanceKm,
            estimatedFare,
            vehicleType,
            passengerCount: passengerCount || 1,
            status: "pending",
            expiresAt,

        })

        const nearbyTransporters = await TransportProvider.find({
            isAvailable: true,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
            vehicleType,
            currentLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: pickupLocation.coordinates,
                    },
                    $maxDistance: 5000
                }
            }
        }).limit(5);


        const io = req.app.get("io");

        if (io) {
            for (const transporter of nearbyTransporters) {
                io.to(`transporter:${transporter._id}`).emit(
                    "new_ride_request",
                    {
                        rideRequestId: rideRequest._id,
                        pickupLocation: rideRequest.pickupLocation,
                        dropoffLocation: rideRequest.dropoffLocation,
                        distanceKm: rideRequest.distanceKm,
                        estimatedFare: rideRequest.estimatedFare,
                        vehicleType: rideRequest.vehicleType,
                        passengerCount: rideRequest.passengerCount,
                    }
                );
            }
        }

        return res.status(201).json({
            success: true,
            message: "Ride request created ",
            rideRequest,
            nearbyTransporters

        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });

    }
}