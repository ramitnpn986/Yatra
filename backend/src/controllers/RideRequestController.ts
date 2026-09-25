
import { Request, Response } from "express";
import RideRequest from "../models/RideRequest.js";
import { Ride } from "../models/Ride.js";
import { TransportProvider } from "../models/TransportProvider.js";
import Customer from "../models/Customer.js";
import mongoose from 'mongoose';



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


export const acceptRideRequest = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();

    try {
        if (!req.user?.transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        const transporterId = req.user.transporterId;
        const rideRequestId = String(req.params.rideRequestId);

        if (!mongoose.Types.ObjectId.isValid(rideRequestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride request ID",
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });
        }

        if (transporter.verificationStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Your KYC is not verified",
            });
        }

        if (!transporter.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "You are currently unavailable",
            });
        }

        if (transporter.isBlocked) {
            return res.status(400).json({
                success: false,
                message: "You are currently not able to accept this request",
            });
        }

        const rideRequest = await RideRequest.findOne({
            _id: rideRequestId,
            status: "pending",
            expiresAt: { $gt: new Date() },
            acceptedBy: null,
        });

        if (!rideRequest) {
            return res.status(409).json({
                success: false,
                message: "Ride request is no longer available",
            });
        }

        if (transporter.vehicle !== rideRequest.vehicleType) {
            return res.status(403).json({
                success: false,
                message: "Your vehicle type does not match this ride",
            });
        }

        const acceptedAt = new Date();

        session.startTransaction();
        const acceptedRequest =
            await RideRequest.findOneAndUpdate(
                {
                    _id: rideRequestId,
                    status: "pending",
                    expiresAt: { $gt: acceptedAt },
                    acceptedBy: null,
                    vehicleType: transporter.vehicle,
                },
                {
                    $set: {
                        status: "accepted",
                        acceptedBy: transporterId,
                        acceptedAt,
                    },
                },
                {
                    new: true,
                    session,
                }
            );

        if (!acceptedRequest) {
            await session.abortTransaction();

            return res.status(409).json({
                success: false,
                message: "Ride request is no longer available",
            });
        }


        const ride = new Ride({
            rideRequest: acceptedRequest._id,
            customer: acceptedRequest.customer,
            transporter: transporterId,
            pickupLocation: acceptedRequest.pickupLocation,
            dropoffLocation: acceptedRequest.dropoffLocation,
            distanceKm: acceptedRequest.distanceKm,
            estimatedFare: acceptedRequest.estimatedFare,
            vehicleType: acceptedRequest.vehicleType,
            passengerCount: acceptedRequest.passengerCount,
            status: "confirmed",
            requestedAt: acceptedRequest.createdAt,
            acceptedAt,
        });

        await ride.save({ session });


        await TransportProvider.findByIdAndUpdate(transporterId, { isAvailable: false }, { session });

        await session.commitTransaction();

        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${acceptedRequest.customer}`).emit(
                "ride_accepted",
                {
                    rideId: ride._id,
                    rideRequestId: acceptedRequest._id,
                    status: ride.status,
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Ride accepted successfully",
            ride,
        });

    } catch (err) {
        await session.abortTransaction();
        console.error("Accept ride error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    } finally {
        await session.endSession();
    }
};


export const cancelRideRequest = async (req: Request, res: Response) => {
    try {
        if (!req.user?.customerId) {
            return res.status(401).json({
                success: false,
                message: " you must be customer for cancel req"
            })
        }

        const customerId = req.user?.customerId;
        const rideRequestId = String(req.params.rideRequestId)

        if (!mongoose.Types.ObjectId.isValid(rideRequestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride request ID",
            });
        }

        const rideRequest = await RideRequest.findOneAndUpdate({
            _id: rideRequestId,
            customer: customerId,
            status: "pending"
        }, {
            $set: {
                status: "cancelled",
                cancelledAt: new Date(),
            }
        }, {
            new: true,
        })

        if (!rideRequest) {
            return res.status(404).json({
                success: false,
                message:
                    "Ride request not found or cannot be cancelled",
            });
        }

        const io= req.app.get("io");
        if(io){
            io.emit("ride_request_cancelled",{rideRequestId: rideRequest._id})
        }


    } catch (err) {
        console.error("Cancel ride request error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel ride request",
        });
    }
}


