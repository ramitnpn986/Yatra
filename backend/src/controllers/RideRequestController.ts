import { Request, Response } from "express";
import RideRequest from "../models/RideRequest.js";
import { Ride } from "../models/Ride.js";
import { TransportProvider } from "../models/TransportProvider.js";
import Customer from "../models/Customer.js";

import mongoose from 'mongoose';
import { VehicleRental } from "../models/VehicleRentals.js";
import { Vehicle } from "../models/Vehicle.js";

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
            "vehicle.type": vehicleType,
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

        if (transporter.vehicle?.type !== rideRequest.vehicleType) {
            return res.status(403).json({
                success: false,
                message: "Your vehicle type does not match this ride",
            });
        }

        const acceptedAt = new Date();

        session.startTransaction();
        const acceptedRequest =  await RideRequest.findOneAndUpdate(
                {
                    _id: rideRequestId,
                    status: "pending",
                    expiresAt: { $gt: acceptedAt },
                    acceptedBy: null,
                    vehicleType: transporter.vehicle?.type,
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

        const io = req.app.get("io");
        if (io) {
            io.emit("ride_request_cancelled", { rideRequestId: rideRequest._id })
        }


   return res.status(200).json({
    success:true,
    message:"Ride request cancelled successfully",
    rideRequest,
   });
}catch(err){
    console.error("Cancel ride request error:",err);
    return res.status(500).json({
        success:false,
        message:"Failed to cancel ride request",
    });
}
}

export const getAllRideReqsOfAnUser = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;
        console.log("i am called")

        if (!customerId) {
            return res.status(401).json({
                message: " User authentication is required",
                success: false
            })
        }

        const allRideRequests = await RideRequest.find({ customer: customerId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Ride requests fetched successfully",
            count: allRideRequests.length,
            rideRequests: allRideRequests,
        });

    } catch (err) {
        console.error("Get all ride requests of an user error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel ride request",
        });
    }
}

export const getRideReqByIdOfAnUser = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;
        const { rideRequestId } = req.params;

        if (!customerId) {
            return res.status(401).json({
                message: " User authentication is required",
                success: false
            });
        }

        const rideRequest = await RideRequest.findOne({ customer: customerId, _id: rideRequestId });

        if (!rideRequest) {
            return res.status(404).json({
                success: false,
                message: "Ride request not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ride requests fetched successfully",
            rideRequest,
        });

    } catch (err) {
        console.error("Get ride error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel ride request",
        });
    }
}

export const vehicleRentalRequest = async (req: Request, res: Response) => {
    try {
        if (!req.user?.customerId) {
            return res.status(400).json({
                message: "Customer authentication required",
                success: false
            });
        }

        const customerId = req.user?.customerId;
        const customer = await Customer.findById(customerId).select("-password");

        if (customer?.isBlocked) {
            return res.status(400).json({
                message: "You can not make a rental request",
                success: false
            });
        }

        const {
            transporterId,
            vehicleId,
            vehicleType,
            rentalType,
            pickupLocation,
            returnLocation,
            startDate,
            endDate,
            pricePerDay,
            securityDeposit,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(transporterId) || !mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({
                success: false,
            message: "Invalid transporter or vehicle ID",
            });
        }

        if (!pickupLocation?.coordinates || pickupLocation.coordinates.length !== 2 ||
            !returnLocation?.coordinates || returnLocation.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Invalid pickup or return coordinates"
            })
        }

        if (!vehicleType || !rentalType || !startDate || !endDate || pricePerDay === undefined) {
            return res.status(400).json({
                success: false,
                message: "Vehicle type, rental type, dates and price are required",
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
                message: "This provider's KYC is not verified",
            });
        }

        if (transporter.vehicle?.type !== vehicleType) {
            return res.status(403).json({
                success: false,
                message: "Provider's vehicle type does not match this request",
            });
        }

        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            transporter: transporterId,
            vehicleType,
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Selected vehicle not found",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({
                success: false,
                message: "endDate must be after startDate",
            });
        }

        const hasOtherPendingRequest = await VehicleRental.findOne({
            customer: customerId,
            status: "pending",
        });

        if (hasOtherPendingRequest) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending rental request",
                rental: hasOtherPendingRequest,
            });
        }

        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = days * pricePerDay;
        const bookingNumber = `YR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const rental = await VehicleRental.create({
            bookingNumber,
            customer: customerId,
            transporter: transporterId,
            vehicle: vehicle._id,
            vehicleType,
            rentalType,
            pickupLocation: {
                address: pickupLocation.address,
                type: "Point",
                coordinates: pickupLocation.coordinates,
            },
            returnLocation: {
                address: returnLocation.address,
                type: "Point",
                coordinates: returnLocation.coordinates,
            },
            startDate: start,
            endDate: end,
            rentalDays: days,
            pricePerDay,
            totalPrice,
            securityDeposit: securityDeposit || 0,
            status: "pending",
        });

        const io = req.app.get("io");
        if (io) {
            io.to(`transporter:${transporterId}`).emit("new_rental_request", {
                rentalId: rental._id,
                vehicleType: rental.vehicleType,
                startDate: rental.startDate,
                endDate: rental.endDate,
                totalPrice: rental.totalPrice,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Rental request submitted",
            rental,
        });

    } catch (err) {
        console.error("Create rental request error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const acceptRentalRequest = async (req: Request, res: Response) => {
    try {
        if (!req.user?.transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        const transporterId = req.user.transporterId;
        const rentalId = String(req.params.rentalId);

        if (!mongoose.Types.ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental ID",
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });
        }

        if (transporter.isBlocked) {
            return res.status(400).json({
                success: false,
                message: "You are currently not able to accept this request",
            });
        }

        const rental = await VehicleRental.findOneAndUpdate(
            {
                _id: rentalId,
                transporter: transporterId,
                status: "pending",
            },
            {
                $set: {
                    status: "confirmed",
                    acceptedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!rental) {
            return res.status(409).json({
                success: false,
                message: "Rental request is no longer available",
            });
        }

        const io = req.app.get("io");
        if (io) {
            io.to(`customer:${rental.customer}`).emit("rental_accepted", {
                rentalId: rental._id,
                status: rental.status,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rental request accepted",
            rental,
        });

    } catch (err) {
        console.error("Accept rental request error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const rejectRentalRequest = async (req: Request, res: Response) => {
    try {
        if (!req.user?.transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        const transporterId = req.user.transporterId;
        const rentalId = String(req.params.rentalId);
        const { reason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental ID",
            });
        }

        const rental = await VehicleRental.findOneAndUpdate(
            {
                _id: rentalId,
                transporter: transporterId,
                status: "pending",
            },
            {
                $set: {
                    status: "rejected",
                    rejectedAt: new Date(),
                    ...(reason ? { rejectedReason: reason } : {}),
                },
            },
            { new: true }
        );

        if (!rental) {
            return res.status(409).json({
                success: false,
                message: "Rental request is no longer available",
            });
        }

        const io = req.app.get("io");
        if (io) {
            io.to(`customer:${rental.customer}`).emit("rental_rejected", {
                rentalId: rental._id,
                status: rental.status,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rental request rejected",
            rental,
        });

    } catch (err) {
        console.error("Reject rental request error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const cancelRentalRequest = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;
        const transporterId = req.user?.transporterId;

        if (!customerId && !transporterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const rentalId = String(req.params.rentalId);
        const { reason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental ID",
            });
        }

        const rental = await VehicleRental.findById(rentalId);

        if (!rental) {
            return res.status(404).json({
                success: false,
                message: "Rental not found",
            });
        }

        const isOwner = customerId && rental.customer.toString() === customerId;
        const isProvider = transporterId && rental.transporter.toString() === transporterId;

        if (!isOwner && !isProvider) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this rental",
            });
        }

        if (["completed", "cancelled", "rejected"].includes(rental.status)) {
            return res.status(400).json({
                success: false,
                message: `This rental is already ${rental.status} and cannot be cancelled`,
            });
        }

        rental.status = "cancelled";
        rental.cancelledAt = new Date();
        rental.cancelledBy = isOwner ? "customer" : "transporter";
        if (reason) rental.cancelledReason = reason;
        await rental.save();

        const io = req.app.get("io");
        if (io) {
            io.emit("rental_cancelled", { rentalId: rental._id });
        }

        return res.status(200).json({
            success: true,
            message: "Rental cancelled successfully",
            rental,
        });

    } catch (err) {
        console.error("Cancel rental request error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel rental request",
        });
    }
}

export const payRentalDeposit = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;
        const rentalId = String(req.params.rentalId);

        if (!customerId) return res.status(401).json({ success: false, message: "Customer authentication required" });
        if (!mongoose.Types.ObjectId.isValid(rentalId)) return res.status(400).json({ success: false, message: "Invalid rental ID" });

        const rental = await VehicleRental.findOne({ _id: rentalId, customer: customerId });
        if (!rental) return res.status(404).json({ success: false, message: "Rental not found" });
        if (!["confirmed", "active"].includes(rental.status)) return res.status(400).json({ success: false, message: "Deposit can be paid after rental confirmation" });
        if (rental.paymentStatus !== "unpaid") return res.status(400).json({ success: false, message: `Deposit is already ${rental.paymentStatus}` });

        rental.paymentStatus = "deposit_paid";
        await rental.save();

        req.app.get("io")?.to(`transporter:${rental.transporter}`).emit("rental_deposit_paid", { rentalId: rental._id, paymentStatus: rental.paymentStatus });
        return res.status(200).json({ success: true, message: "Security deposit paid", rental });
    } catch (err) {
        console.error("Pay rental deposit error:", err);
        return res.status(500).json({ success: false, message: "Failed to pay security deposit" });
    }
};


export const getMyRentals = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Customer authentication required",
            });
        }

        const rentals = await VehicleRental.find({
            customer: customerId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Rentals fetched successfully",
            count: rentals.length,
            rentals,
        });
    } catch (err) {
        console.error("Get customer rentals error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rentals",
        });
    }
};


export const getPendingRentalRequests = async (
    req: Request,
    res: Response
) => {
    try {
        const transporterId = req.user?.transporterId;

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        const rentals = await VehicleRental.find({
            transporter: transporterId,
            status: { $in: ["pending", "confirmed", "active"] },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Active rental requests fetched successfully",
            count: rentals.length,
            rentals,
        });
    } catch (err) {
        console.error("Get pending rental requests error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending rental requests",
        });
    }
};


export const getRentalProviders = async (req: Request, res: Response) => {
    try {
        const providers = await TransportProvider.find({
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
            "vehicle.type": { $exists: true },
        }).select("name phone vehicle pricePerKm").sort({ name: 1 }).lean();

        const providersWithVehicles = await Promise.all(providers.map(async (provider) => {
            let vehicle = await Vehicle.findOne({ transporter: provider._id }).lean();

            if (!vehicle && provider.vehicle?.type) {
                vehicle = await Vehicle.findOneAndUpdate(
                    { transporter: provider._id },
                    {
                        transporter: provider._id,
                        vehicleType: provider.vehicle.type,
                        brand: "Yatra Fleet",
                        model: provider.vehicle.type,
                        images: provider.vehicle.vehiclePhoto ? [provider.vehicle.vehiclePhoto] : [],
                        seats: provider.vehicle.type === "Bike" ? 1 : provider.vehicle.type === "Bus" ? 30 : 4,
                        year: new Date().getFullYear(),
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                ).lean();
            }

            return {
                ...provider,
                vehicles: vehicle ? [vehicle] : [],
            };
        }));

        return res.status(200).json({ success: true, providers: providersWithVehicles });
    } catch (err) {
        console.error("Get rental providers error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch rental providers" });
    }
};


export const startRental = async (req: Request, res: Response) => {
    try {
        const transporterId = req.user?.transporterId;
        const rentalId = String(req.params.rentalId);

        if (!transporterId) return res.status(401).json({ success: false, message: "Transporter authentication required" });
        if (!mongoose.Types.ObjectId.isValid(rentalId)) return res.status(400).json({ success: false, message: "Invalid rental ID" });

        const rental = await VehicleRental.findOneAndUpdate(
            { _id: rentalId, transporter: transporterId, status: "confirmed" },
            { $set: { status: "active", startedAt: new Date() } },
            { new: true },
        );

        if (!rental) return res.status(409).json({ success: false, message: "Only confirmed rentals can be started" });
        req.app.get("io")?.to(`customer:${rental.customer}`).emit("rental_started", { rentalId: rental._id, status: rental.status });
        return res.status(200).json({ success: true, message: "Rental started", rental });
    } catch (err) {
        console.error("Start rental error:", err);
        return res.status(500).json({ success: false, message: "Failed to start rental" });
    }
};


export const completeRental = async (req: Request, res: Response) => {
    try {
        const transporterId = req.user?.transporterId;
        const rentalId = String(req.params.rentalId);

        if (!transporterId) return res.status(401).json({ success: false, message: "Transporter authentication required" });
        if (!mongoose.Types.ObjectId.isValid(rentalId)) return res.status(400).json({ success: false, message: "Invalid rental ID" });

        const rental = await VehicleRental.findOneAndUpdate(
            { _id: rentalId, transporter: transporterId, status: "active" },
            { $set: { status: "completed", completedAt: new Date() } },
            { new: true },
        );

        if (!rental) return res.status(409).json({ success: false, message: "Only active rentals can be completed" });
        req.app.get("io")?.to(`customer:${rental.customer}`).emit("rental_completed", { rentalId: rental._id, status: rental.status });
        return res.status(200).json({ success: true, message: "Rental completed", rental });
    } catch (err) {
        console.error("Complete rental error:", err);
        return res.status(500).json({ success: false, message: "Failed to complete rental" });
    }
};

export const searchAvailableVehicles = async (req: Request, res: Response) => {
    try {
        const { vehicleType, startDate, endDate } = req.body;

        if (!vehicleType || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Vehicle type and rental dates are required",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({
                success: false,
                message: "endDate must be after startDate",
            });
        }

        const providers = await TransportProvider.find({
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
            "vehicle.type": vehicleType,
        }).select("name phone vehicle pricePerKm");

        const providerIds = providers.map((p) => p._id);

        const overlappingRentals = await VehicleRental.find({
            transporter: { $in: providerIds },
            status: { $in: ["pending", "confirmed", "active"] },
            startDate: { $lt: end },
            endDate: { $gt: start },
        }).select("transporter");

        const bookedTransporterIds = new Set(
            overlappingRentals.map((r) => r.transporter.toString())
        );

        const availableProviders = providers.filter(
            (p) => !bookedTransporterIds.has(p._id.toString())
        );

        return res.status(200).json({
            success: true,
            count: availableProviders.length,
            providers: availableProviders,
        });

    } catch (err) {
        console.error("Search available vehicles error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to search available vehicles",
        });
    }
};