import { Request, Response } from "express";
import RideRequest from "../models/RideRequest.js";
import { Ride } from "../models/Ride.js";
import { TransportProvider } from "../models/TransportProvider.js";
import Customer from "../models/Customer.js";

import mongoose from 'mongoose';
import { VehicleRental } from "../models/VehicleRentals.js";
import { Vehicle } from "../models/Vehicle.js";

type Coordinates = [number, number];

interface RentalLocation {
    name?: string;
    address?: string;
    type?: "Point";
    coordinates: Coordinates;
}

interface Destination {
    name: string;
    address?: string;
    type?: "Point";
    coordinates: Coordinates;
}

interface RouteResult {
    totalDistanceKm: number;
    estimatedDurationMinutes: number;
}

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
    let transactionStarted = false;

    try {
        const transporterId = req.user?.transporterId;
        const rideRequestId = String(req.params.rideRequestId);

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(rideRequestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride request ID",
            });
        }

        const transporter = await TransportProvider.findOne({
            _id: transporterId,
            isActive: true,
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
            isAvailable: true,
        }).lean();

        if (!transporter) {
            return res.status(403).json({
                success: false,
                message: "Transporter is not authorized or is currently unavailable",
            });
        }

        const vehicle = await Vehicle.findOne({
            transporter: transporterId,
            isAvailable: true,
            vehicleType: {
                $in: ["Bike", "Car", "Truck", "Bus"],
            },
        }).lean();

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                message: "You do not have an available vehicle",
            });
        }

        const rideRequest = await RideRequest.findOne({
            _id: rideRequestId,
            status: "pending",
            expiresAt: { $gt: new Date() },
            acceptedBy: null,
        }).lean();

        if (!rideRequest) {
            return res.status(409).json({
                success: false,
                message: "Ride request is no longer available",
            });
        }

        if (vehicle.vehicleType !== rideRequest.vehicleType) {
            return res.status(403).json({
                success: false,
                message: "Your vehicle type does not match this ride",
            });
        }

        const acceptedAt = new Date();

        session.startTransaction();
        transactionStarted = true;


        const acceptedRequest = await RideRequest.findOneAndUpdate(
            {
                _id: rideRequestId,
                status: "pending",
                expiresAt: { $gt: acceptedAt },
                acceptedBy: null,
                vehicleType: vehicle.vehicleType,
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
            transactionStarted = false;

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

        await TransportProvider.findByIdAndUpdate(
            transporterId,
            {
                $set: {
                    isAvailable: false,
                },
            },
            {
                session,
            }
        );

        await session.commitTransaction();
        transactionStarted = false;

        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${acceptedRequest.customer}`).emit(
                "ride_accepted",
                {
                    rideId: ride._id,
                    rideRequestId: acceptedRequest._id,
                    transporterId,
                    vehicleId: vehicle._id,
                    vehicleType: vehicle.vehicleType,
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
        if (transactionStarted) {
            await session.abortTransaction();
        }

        console.error("Accept ride error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to accept ride request",
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
            success: true,
            message: "Ride request cancelled successfully",
            rideRequest,
        });
    } catch (err) {
        console.error("Cancel ride request error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel ride request",
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


export const vehicleRentalRequest = async ( req: Request, res: Response) => {
    try {
        const customerId = req.user?.customerId;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Customer authentication required",
            });
        }

        const customer = await Customer.findById(customerId).select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        if (customer.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "You cannot make a rental request",
            });
        }

        const {
            transporterId,
            vehicleId,
            vehicleType,
            rentalType,
            pickupLocation,
            destinations,
            returnLocation,
            startDate,
            endDate,
        } = req.body;



        if ( !mongoose.Types.ObjectId.isValid(transporterId) || !mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transporter or vehicle ID",
            });
        }


        if ( !vehicleType ||  !rentalType || !startDate || !endDate ||
            !pickupLocation || !returnLocation || !Array.isArray(destinations)
        ) {
            return res.status(400).json({
                success: false,
                message: "Vehicle, rental type, locations and dates are required",
            });
        }

        if (destinations.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one destination is required",
            });
        }

      

        const validateCoordinates = ( coordinates: unknown): coordinates is [number, number] => {
            if (!Array.isArray(coordinates)) {
                return false;
            }

            if (coordinates.length !== 2) {
                return false;
            }

            const [longitude, latitude] = coordinates;

            return (
                typeof longitude === "number" &&
                typeof latitude === "number" &&
                longitude >= -180 &&
                longitude <= 180 &&
                latitude >= -90 &&
                latitude <= 90
            );
        };

        if (!validateCoordinates(pickupLocation.coordinates)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pickup coordinates",
            });
        }

        if (!validateCoordinates(returnLocation.coordinates)) {
            return res.status(400).json({
                success: false,
                message: "Invalid return coordinates",
            });
        }

        for (const destination of destinations) {
            if ( !destination?.name || !validateCoordinates(destination.coordinates)) {
                return res.status(400).json({
                    success: false,
                    message: "Every destination must have a name and valid coordinates",
                });
            }
        }


        if (!["self-drive", "with-driver"].includes( rentalType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental type",
            });
        }


        const start = new Date(startDate);
        const end = new Date(endDate);

        if ( Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental dates",
            });
        }

        const rentalDays = Math.ceil(
            (end.getTime() - start.getTime()) /(1000 * 60 * 60 * 24)
        );

        if (rentalDays < 1) {
            return res.status(400).json({
                success: false,
                message: "Rental duration must be at least one day",
            });
        }


        const transporter = await TransportProvider.findOne({
                _id: transporterId,
                transporterRole: "booking-partner",
                isActive: true,
                isBlocked: false,
                isAvailable: true,
                isVerified: true,
                isKycCompleted: true,
                verificationStatus: "approved",
            });

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message:"Transporter is unavailable or not approved for rental service",
            });
        }


        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            transporter: transporterId,
            vehicleType,
            isAvailable: true,
            rentalAvailable: true,
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Selected vehicle is unavailable or not available for rental",
            });
        }


        const conflictingRental =
            await VehicleRental.findOne({
                vehicle: vehicleId,
                status: {
                    $in: [
                        "pending",
                        "confirmed",
                        "active",
                    ],
                },
                startDate: {
                    $lt: end,
                },
                endDate: {
                    $gt: start,
                },
            });

        if (conflictingRental) {
            return res.status(409).json({
                success: false,
                message:"This vehicle is already booked for the selected dates",
            });
        }

       
        const hasOtherPendingRequest = await VehicleRental.findOne({ customer: customerId, status: "pending"});

        if (hasOtherPendingRequest) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending rental request",
                rental: hasOtherPendingRequest,
            });
        }


        const routeLocations = [ pickupLocation, ...destinations, returnLocation];

        const coordinates = routeLocations.map((location) => `${location.coordinates[0]},${location.coordinates[1]}`).join(";");

        const routeUrl = `https://router.project-osrm.org/route/v1/driving/` + `${coordinates}?overview=false&steps=false`;

        const routeResponse = await fetch(routeUrl);

        if (!routeResponse.ok) {
            return res.status(400).json({
                success: false,
                message: "Unable to calculate route for selected locations",
            });
        }

        const routeData = await routeResponse.json();

        if ( !routeData.routes || !routeData.routes.length) {
            return res.status(400).json({
                success: false,
                message: "No route found for selected locations",
            });
        }

        const totalDistanceKm = Number(
            (routeData.routes[0].distance / 1000).toFixed(2)
        );

        const estimatedDurationMinutes = Math.round(
            routeData.routes[0].duration / 60
        );

        const rentalPricing =(vehicle as any).rentalPricing;

        const pricePerDay = Number(
            rentalPricing?.pricePerDay || 0
        );

        const includedKmPerDay = Number(
            rentalPricing?.includedKmPerDay || 0
        );

        const extraKmPrice = Number(
            rentalPricing?.extraKmPrice || 0
        );

        const driverAllowancePerDay = Number(
            rentalPricing?.driverAllowancePerDay || 0
        );

        const securityDeposit = Number(
            rentalPricing?.securityDeposit || 0
        );

        if (pricePerDay <= 0) {
            return res.status(400).json({
                success: false,
                message: "Rental pricing has not been configured for this vehicle",
            });
        }

    

        const baseRentalPrice = pricePerDay * rentalDays;
        const includedDistanceKm = includedKmPerDay * rentalDays;
        const extraDistanceKm = Math.max( 0, totalDistanceKm - includedDistanceKm);
        const extraDistanceCost = extraDistanceKm * extraKmPrice;
        const driverCost = rentalType === "with-driver"
                ? driverAllowancePerDay * rentalDays
                : 0;

        const totalPrice = baseRentalPrice + extraDistanceCost + driverCost;
        const bookingNumber =`YR-${Date.now()}-${Math.floor( Math.random() * 1000)}`;

        const rental = await VehicleRental.create({
            bookingNumber,
            customer: customerId,
            transporter: transporterId,
            vehicle: vehicle._id,
            vehicleType: vehicle.vehicleType,
            rentalType,

            pickupLocation: {
                name: pickupLocation.name || "",
                address: pickupLocation.address || "",
                type: "Point",
                coordinates: pickupLocation.coordinates,
            },

            destinations: destinations.map(
                (destination: any) => ({
                    name: destination.name,
                    address: destination.address || "",
                    type: "Point",
                    coordinates: destination.coordinates,
                })
            ),

            returnLocation: {
                name: returnLocation.name || "",
                address: returnLocation.address || "",
                type: "Point",
                coordinates: returnLocation.coordinates,
            },

            totalDistanceKm,
            estimatedDurationMinutes,
            startDate: start,
            endDate: end,
            rentalDays,
            pricePerDay,
            totalPrice,
            securityDeposit,
            status: "pending",
        });

     
        const io = req.app.get("io");

        if (io) {
            io.to(`transporter:${transporterId}`).emit(
                "new_rental_request",
                {
                    rentalId: rental._id,
                    bookingNumber: rental.bookingNumber,
                    vehicleId: vehicle._id,
                    vehicleType: rental.vehicleType,
                    rentalType: rental.rentalType,
                    pickupLocation: rental.pickupLocation,
                    destinations: rental.destinations,
                    returnLocation: rental.returnLocation,
                    totalDistanceKm: rental.totalDistanceKm,
                    estimatedDurationMinutes: rental.estimatedDurationMinutes,
                    startDate: rental.startDate,
                    endDate:rental.endDate,
                    rentalDays: rental.rentalDays,
                    pricePerDay: rental.pricePerDay,
                    totalPrice: rental.totalPrice,
                    securityDeposit: rental.securityDeposit,
                }
            );
        }

        return res.status(201).json({
            success: true,
            message: "Rental request submitted successfully",
            rental,
        });
    } catch (error) {
        console.error("Create vehicle rental request error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


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

        const transporter = await TransportProvider.findOne({
            _id: transporterId,
            transporterRole: "booking-partner",
            isActive: true,
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
        });

        if (!transporter) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept rental requests",
            });
        }

        const rental = await VehicleRental.findOne({
            _id: rentalId,
            transporter: transporterId,
            status: "pending",
        });

        if (!rental) {
            return res.status(404).json({
                success: false,
                message: "Rental request not found or is no longer pending",
            });
        }

        const vehicle = await Vehicle.findOne({
            _id: rental.vehicle,
            transporter: transporterId,
            isAvailable: true,
            rentalAvailable: true,
        });

        if (!vehicle) {
            return res.status(409).json({
                success: false,
                message: "The selected vehicle is no longer available for rental",
            });
        }

        const conflictingRental = await VehicleRental.findOne({
            _id: { $ne: rental._id },
            vehicle: rental.vehicle,
            status: { $in: ["confirmed", "active"] },
            startDate: { $lt: rental.endDate },
            endDate: { $gt: rental.startDate },
        });

        if (conflictingRental) {
            return res.status(409).json({
                success: false,
                message: "This vehicle is already booked for the requested dates",
            });
        }

        rental.status = "confirmed";
        rental.acceptedAt = new Date();

        await rental.save();
        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${rental.customer}`).emit(
                "rental_accepted",
                {
                    rentalId: rental._id,
                    bookingNumber: rental.bookingNumber,
                    vehicleId: rental.vehicle,
                    transporterId: rental.transporter,
                    status: rental.status,
                    startDate: rental.startDate,
                    endDate: rental.endDate,
                    totalPrice: rental.totalPrice,
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Rental request accepted",
            rental,
        });
    } catch (error) {
        console.error(
            "Accept rental request error:",
            error
        );

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


        const transporter = await TransportProvider.findOne({
            _id: transporterId,
            transporterRole: "booking-partner",
            isActive: true,
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
        });

        if (!transporter) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject rental requests",
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
                    ...(reason?.trim()
                        ? { rejectedReason: reason.trim(), }
                        : {}),
                },
            },
            {
                new: true,
            }
        );

        if (!rental) {
            return res.status(409).json({
                success: false,
                message: "Rental request not found or is no longer pending",
            });
        }

        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${rental.customer}`).emit(
                "rental_rejected",
                {
                    rentalId: rental._id,
                    bookingNumber: rental.bookingNumber,
                    status: rental.status,
                    rejectedReason:
                        rental.rejectedReason || null,
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Rental request rejected",
            rental,
        });
    } catch (error) {
        console.error("Reject rental request error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


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

        const isCustomer = !!customerId && rental.customer.toString() === customerId;
        const isTransporter = !!transporterId && rental.transporter.toString() === transporterId;

        if (!isCustomer && !isTransporter) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this rental",
            });
        }

        if (!["pending", "confirmed"].includes(rental.status)) {
            return res.status(400).json({
                success: false,
                message: `Rental cannot be cancelled because its current status is ${rental.status}`,
            });
        }

        if (isTransporter) {
            const transporter = await TransportProvider.findOne({
                _id: transporterId,
                transporterRole: "booking-partner",
                isActive: true,
                isBlocked: false,
                isVerified: true,
                isKycCompleted: true,
                verificationStatus: "approved",
            });

            if (!transporter) {
                return res.status(403).json({
                    success: false,
                    message: "Transporter is not authorized to cancel this rental",
                });
            }
        }

        rental.status = "cancelled";
        rental.cancelledAt = new Date();

        rental.cancelledBy = isCustomer ? "customer" : "transporter";

        if (reason?.trim()) {
            rental.cancelledReason = reason.trim();
        }

        await rental.save();

        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${rental.customer}`).emit(
                "rental_cancelled",
                {
                    rentalId: rental._id,
                    status: rental.status,
                    cancelledBy: rental.cancelledBy,
                    reason: rental.cancelledReason || null,
                }
            );

            io.to(`transporter:${rental.transporter}`).emit(
                "rental_cancelled",
                {
                    rentalId: rental._id,
                    status: rental.status,
                    cancelledBy: rental.cancelledBy,
                    reason: rental.cancelledReason || null,
                }
            );
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

        const rentals = await VehicleRental.find({ customer: customerId }).sort({ createdAt: -1 });

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


export const getPendingRentalRequests = async (req: Request, res: Response) => {
    try {
        const transporterId = req.user?.transporterId;

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        const transporter = await TransportProvider.findOne({
            _id: transporterId,
            transporterRole: "booking-partner",
            isActive: true,
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
        });

        if (!transporter) {
            return res.status(403).json({
                success: false,
                message: "Transporter is not authorized",
            });
        }

        const rentals = await VehicleRental.find({
            transporter: transporterId,
            status: {
                $in: ["pending", "confirmed", "active"],
            },
        }).populate("customer", "name phone profileImage")
            .populate(
                "vehicle",
                "vehicleType brand model numberPlate images seats capacityKg"
            )
            .sort({ createdAt: -1 })
            .lean();

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
            message: "Failed to fetch rental requests",
        });
    }
};


export const getRentalProviders = async (req: Request, res: Response) => {
    try {

        const providers = await TransportProvider.find({
            transporterRole: "booking-partner",
            isActive: true,
            isBlocked: false,
            isAvailable: true,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
        }).select("name phone profileImage location serviceAreas pricePerKm").sort({ name: 1 }).lean();


        const providersWithVehicles = await Promise.all(
            providers.map(async (provider) => {
                const vehicles = await Vehicle.find({
                    transporter: provider._id,
                    isAvailable: true,
                    rentalAvailable: true,
                }).select("vehicleType brand model numberPlate images seats capacityKg year").sort({ createdAt: -1 }).lean();

                return { ...provider, vehicles, };
            })
        );

        return res.status(200).json({
            success: true,
            providers: providersWithVehicles,
        });
    } catch (err) {
        console.error("Get rental providers error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rental providers",
        });
    }
};


export const startRental = async (req: Request, res: Response) => {
    try {
        const transporterId = req.user?.transporterId;
        const rentalId = String(req.params.rentalId);

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental ID",
            });
        }

        const transporter = await TransportProvider.findOne({
            _id: transporterId,
            transporterRole: "booking-partner",
            isActive: true,
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
        });

        if (!transporter) {
            return res.status(403).json({
                success: false,
                message: "Transporter is not authorized to start this rental",
            });
        }

        const rental = await VehicleRental.findOneAndUpdate(
            {
                _id: rentalId,
                transporter: transporterId,
                status: "confirmed",
            },
            {
                $set: {
                    status: "active",
                    startedAt: new Date(),
                },
            },
            {
                new: true,
            }
        );

        if (!rental) {
            return res.status(409).json({
                success: false,
                message: "Only confirmed rentals can be started",
            });
        }

        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${rental.customer}`).emit(
                "rental_started",
                {
                    rentalId: rental._id,
                    status: rental.status,
                    startedAt: rental.startedAt,
                }
            );

            io.to(`transporter:${rental.transporter}`).emit(
                "rental_started",
                {
                    rentalId: rental._id,
                    status: rental.status,
                    startedAt: rental.startedAt,
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Rental started successfully",
            rental,
        });

    } catch (err) {
        console.error("Start rental error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to start rental",
        });
    }
};


export const completeRental = async (req: Request, res: Response) => {
    try {
        const transporterId = req.user?.transporterId;
        const rentalId = String(req.params.rentalId);

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Transporter authentication required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental ID",
            });
        }


        const transporter = await TransportProvider.findOne({
            _id: transporterId,
            transporterRole: "booking-partner",
            isActive: true,
            isBlocked: false,
            isVerified: true,
            isKycCompleted: true,
            verificationStatus: "approved",
        });

        if (!transporter) {
            return res.status(403).json({
                success: false,
                message: "Transporter is not authorized to complete this rental",
            });
        }


        const rental = await VehicleRental.findOneAndUpdate(
            {
                _id: rentalId,
                transporter: transporterId,
                status: "active",
            },
            {
                $set: {
                    status: "completed",
                    completedAt: new Date(),
                },
            },
            {
                new: true,
            }
        );

        if (!rental) {
            return res.status(409).json({
                success: false,
                message: "Only active rentals can be completed",
            });
        }

        await Vehicle.findByIdAndUpdate(
            rental.vehicle,{
                 $set:{
                     isAvailable: true
                 }
            }
        )

        const io = req.app.get("io");

        if (io) {
            io.to(`customer:${rental.customer}`).emit(
                "rental_completed",
                {
                    rentalId: rental._id,
                    status: rental.status,
                    completedAt: rental.completedAt,
                }
            );

            io.to(`transporter:${rental.transporter}`).emit(
                "rental_completed",
                {
                    rentalId: rental._id,
                    status: rental.status,
                    completedAt: rental.completedAt,
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Rental completed successfully",
            rental,
        });

    } catch (err) {
        console.error("Complete rental error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to complete rental",
        });
    }
};


const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
};



const calculateRoute = async (locations: RentalLocation[]): Promise<RouteResult> => {
    const coordinates = locations.map((location) => {
        const [longitude, latitude] = location.coordinates;
        return `${longitude}, ${latitude}`;
    }).join(";");

    const url = `https://router.project-osrm.org/route/v1/driving/` + `${coordinates}?overview=false&steps=false`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to calculate road route");
    }

    const data = await res.json();

    if (!data.routes || !data.routes.length || typeof data.routes[0].distance !== "number") {
        throw new Error("No route found for the selected locations");
    }

    return {
        totalDistanceKm: data.routes[0].distance / 1000,
        estimatedDurationMinutes: data.routes[0].duration / 60,
    };

}



export const searchAvailable = async ( req: Request, res: Response) => {
    try {
        const { pickupLocation,  vehicleType,  passengers, startDate, endDate } = req.body;

        if ( !pickupLocation?.coordinates || !vehicleType || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Pickup location, vehicle type and rental dates are required",
            });
        }

        const [pickupLongitude, pickupLatitude] = pickupLocation.coordinates;

        if ( typeof pickupLongitude !== "number" || typeof pickupLatitude !== "number") {
            return res.status(400).json({
                success: false,
                message: "Invalid pickup coordinates",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if ( Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental dates",
            });
        }

        const passengerCount = Number(passengers || 1);

        if ( !Number.isInteger(passengerCount) || passengerCount < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid passenger count",
            });
        }


        const vehicles = await Vehicle.find({
            vehicleType,
            isAvailable: true,
            rentalAvailable: true,
            seats: { $gte: passengerCount},
        }).populate({
                path: "transporter",
                match: {
                    transporterRole: "booking-partner",
                    isAvailable: true,
                    isActive: true,
                    isBlocked: false,
                    isVerified: true,
                    isKycCompleted: true,
                    verificationStatus: "approved",
                },
                select: "name phone profileImage location currentLocation",
            })
            .lean();


        const validVehicles = vehicles.filter(
            (vehicle) => vehicle.transporter
        );

        const vehicleIds = validVehicles.map(
            (vehicle) => vehicle._id
        );

        const conflictingRentals =
            await VehicleRental.find({
                vehicle: {
                    $in: vehicleIds,
                },
                status: {
                    $in: [
                        "pending",
                        "confirmed",
                        "active",
                    ],
                },
                startDate: { $lt: end },
                endDate: {  $gt: start},
            }).select("vehicle").lean();

        const bookedVehicleIds = new Set(
            conflictingRentals.map((rental) => rental.vehicle.toString())
        );

       
        const availableVehicles = validVehicles.filter((vehicle) =>
             !bookedVehicleIds.has(vehicle._id.toString())
            );


        const results = availableVehicles.map((vehicle) => {
                const transporter = vehicle.transporter as any;
                let distanceKm = 0;
                if ( transporter?.location?.coordinates) {
                    const [ transporterLongitude, transporterLatitude] = transporter.location.coordinates;

                    distanceKm = calculateDistance(
                        pickupLatitude,
                        pickupLongitude,
                        transporterLatitude,
                        transporterLongitude
                    );
                }

                return {
                    distanceKm: Number( distanceKm.toFixed(2)),
                    vehicle: {
                        id: vehicle._id,
                        vehicleType: vehicle.vehicleType,
                        brand: vehicle.brand,
                        model: vehicle.model,
                        numberPlate: vehicle.numberPlate,
                        images: vehicle.images,
                        seats: vehicle.seats,
                        capacityKg: vehicle.capacityKg,
                        year: vehicle.year,
                    },

                    transporter: {
                        id: transporter._id,
                        name: transporter.name,
                        phone: transporter.phone,
                        profileImage: transporter.profileImage,
                        location: transporter.location,
                    },
                };
            }
        );

        results.sort((a, b) => a.distanceKm - b.distanceKm);

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        console.error("Search available rental vehicles error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search available rental vehicles",
        });
    }
};

