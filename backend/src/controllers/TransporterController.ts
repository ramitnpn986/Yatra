import { TransportProvider } from "../models/TransportProvider.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import {Request,Response} from "express";
import { isAbaRouting } from "validator";
import RideRequest from "../models/RideRequest.js";

const generateOtp=()=>{
    return Math.floor( 100000 +Math.random()*900000).toString();
};
interface TransportationCostParams {
    transporterLat: number;
    transporterLon: number;
    pickupLat: number;
    pickupLon: number;
    dropoffLat: number;
    dropoffLon: number;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
}


export const registerTransporter = async (req: Request, res: Response) => {
    try {

        const { name, phone, password, role } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false,
            })
        }

        const existingUser = await TransportProvider.findOne({ phone });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this phone number already exists",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new TransportProvider({
            name,
            phone,
            password: hashedPassword,
            role
        })

        await newUser.save();

        return res.status(201).json({
            message: "Transporter Created Successfuly !",
            success: true
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }

}


export const loginTransporter = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const transporter = await TransportProvider.findOne({ phone }).select('+password')

        if (!transporter) {
            return res.status(400).json({
                message: "Invalid phone or password",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, transporter.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Phone or password",
                success: false
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { transporterId: transporter._id, role: 'transporter' },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        const transporterData = {
            id: transporter._id,
            name: transporter.name,
            phone: transporter.phone,
            role: "transporter",
            profileImage: transporter.profileImage?.url,
        }


        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({
            message: "Login successful",
            success: true,
            transporter: transporterData,
            role:"transporter"
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });

    }
}


export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: "/"
        });

        return res.status(200).json({
            message: "Logged out successfully!",
            success: true
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error");
    }
}


export const submitKyc = async (req: Request, res: Response): Promise<Response> => {
    try {

        const transporterId = req.user?.transporterId;
        const files = req.files as {
            citizenshipCard?: Express.Multer.File[];
            drivingLicense?: Express.Multer.File[];
            vehicleRegistration?: Express.Multer.File[];
            vehiclePhoto?: Express.Multer.File[];
        } | undefined;
        const { citizenshipCard, drivingLicense, vehicleRegistration, vehiclePhoto } = files || {};
        let { vehicleType, numberPlate, capacityKg, serviceAreas, pricePerKm } = req.body;

        if (!citizenshipCard || !drivingLicense || !vehicleRegistration || !vehiclePhoto || !vehicleType || !numberPlate || !capacityKg || !pricePerKm) {
            return res.status(400).json({
                success: false,
                message: " All fields are required"
            })
        }

        if (typeof (serviceAreas) === "string") {
            serviceAreas = serviceAreas.split(',').map((area) => area.trim()).filter(area => area.length > 3);
        }

        const transporter = await TransportProvider.findById(transporterId).select('-password');

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transport provider not found"
            });
        }

        if (transporter.isKycCompleted) {
            return res.status(400).json({
                success: false,
                message: "KYC already submitted"
            });
        }

        transporter.documents = {
            citizenshipCard: citizenshipCard[0].path,
            drivingLicense: drivingLicense[0].path,
            vehicleRegistration: vehicleRegistration[0].path,
        }

        transporter.vehicle = {
            type: vehicleType,
            numberPlate,
            capacityKg,
            vehiclePhoto: vehiclePhoto[0].path
        };

        transporter.serviceAreas = serviceAreas || [];
        transporter.pricePerKm = pricePerKm;


        transporter.isKycCompleted = true;
        transporter.verificationStatus = "pending";
        transporter.isVerified = false;
        transporter.isKycDataSubmitted = true;

        await transporter.save();

        return res.status(200).json({
            status: 200,
            message: "KYC submitted successfully !"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error");
    }
}


export const getTransporterProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transporterId = req.user?.transporterId;
        const transporter = await TransportProvider.findById(transporterId).select("-password");

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            })
        }

        return res.status(200).json({

            message:"Transporter profile fetched successfully",
            success: true,
            transporter
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error");
    }
}


export const changeTransporterPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const transporterId = req.user?.transporterId;

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const transporter = await TransportProvider.findById(transporterId).select("+password");

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            })
        }
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, transporter.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, transporter.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        transporter.password = hashedNewPassword;

        await transporter.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}



export const updateAvailablity = async (req: Request, res: Response): Promise<Response> => {
    try {

        const transporterId = req.user?.transporterId;
        const { status } = req.body;

        const transporter = await TransportProvider.findById(transporterId).select("-password");

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            })
        }

        if (!["available", "unavailable"].includes(status)) {
            return res.status(400).json({
                message: "invalid action",
                success: false
            })
        }

        transporter.isAvailable = status === "available";
        await transporter.save();
        return res.status(200).json({
            message: "Password changed successfully",
            success: true,
            isAvailable: transporter.isAvailable
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const updateCurrentLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transporterId = req.user?.transporterId;
        const { coordinates } = req.body;

        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({
                message: "Valid coordinates [longitude, latitude] are required",
                success: false
            });
        }

        const transporter = await TransportProvider.findById(transporterId).select("-password");

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            });
        }

        transporter.currentLocation = {
            type: "Point",
            coordinates
        };

        await transporter.save();

        return res.status(200).json({
            message: "Current location updated successfully",
            success: true,
            currentLocation: transporter.currentLocation
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}



const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};


const calculateTransportationCost = ({ transporterLat, transporterLon, pickupLat, pickupLon, dropoffLat, dropoffLon, vehicleType }: TransportationCostParams) => {


    const BASE_FARE = { Bike: 50, Car: 100, Truck: 500, Bus: 1000, };
    const PER_KM_FARE = { Bike: 25, Car: 40, Truck: 70, Bus: 100, };


    const transporterToPickupDistance = haversineDistance(transporterLat, transporterLon, pickupLat, pickupLon);
    const pickupToDropoffDistance = haversineDistance(pickupLat, pickupLon, dropoffLat, dropoffLon);

    const totalDistance = transporterToPickupDistance + pickupToDropoffDistance;
    const distanceCost = totalDistance * PER_KM_FARE[vehicleType];

    const totalCost = BASE_FARE[vehicleType] + distanceCost;

    return {
        totalCost: Number(totalCost.toFixed(2)),
        distances: {
            transporterToPickupKM: Number(transporterToPickupDistance.toFixed(2)),
            pickupToDropoffKM: Number(pickupToDropoffDistance.toFixed(2)),
            totalDistanceKM: Number(totalDistance.toFixed(2)),
        },
        fareBreakdown: {
            baseFare: BASE_FARE[vehicleType],
            distanceCost: Number(distanceCost.toFixed(2)),
            totalCost: Number(totalCost.toFixed(2)),
        },
    };
};




// export const getNearByRideRequests = async (req: Request, res: Response): Promise<Response> => {
//     try {

//         const transporterId = req.user?.transporterId;

//         if (!transporterId) {
//             return res.status(401).json({ message: "Unauthorized", success: false, });
//         }

//         const transporter = await TransportProvider.findById(transporterId).select("-password");

//         if (!transporter) {
//             return res.status(404).json({ success: false, message: "Transporter not found" })
//         }

//         if (!transporter.isVerified) {
//             return res.status(403).json({ success: false, message: "Your account is not verified" })
//         }

//         if (transporter.isBlocked) {
//             return res.status(403).json({ success: false, message: "Your account is blocked", });
//         }

//         if (transporter.isAvailable) {
//             return res.status(400).json({ success: false, message: "You are currently unavailable" })
//         }

//         if (!transporter.currentLocation) {
//             return res.status(400).json({ success: false, message: "You are currently location is invalid" })
//         }


//         const allRideRequest = await RideRequest.find({ status: "pending" });



//         return res.status(500).json({ message: "Internal Server Error", success: false });
//     } catch (err) {
//         console.log(err)
//     }
// }



// export const transporterByRecommendationEngine = async (req, res) => {

//     try {

//         const { requestRideId } = req.params;
//         const { customerLocation, transporterLocation } = req.body;


//         if (!customerLocation?.coordinates || !transporterLocation?.coordinates) {
//             return res.status(400).json({
//                 success: false,
//                 message: "passenger and transporter location required"
//             });
//         }

//         const transporters = await TransportProvider.find({
//             isAvailable: true,
//             isVerified: true,
//             isBlocked: false
//         });

//         if (!transporters.length) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No transporters found"
//             });
//         }

//         const scoredTransporters = transporters.map((t) => {


//             const transporterLat = t.location?.coordinates[1];
//             const transporterLng = t.location?.coordinates[0];

//             const passengerLat = customerLocation.coordinates[1];
//             const passengerLng = customerLocation.coordinates[0];



//             const pickupDistance = haversineDistance(
//                 transporterLat,
//                 transporterLng,
//                 passengerLat,
//                 passengerLng
//             );



//             const totalDistance = pickupDistance + deliveryDistance;
//             const distanceScore = Math.exp(-totalDistance / 10);

//             const ratingScore = (t.totalRating || 0) / 5;
//             const acceptanceRate = t.totalRequest > 0 ? t.acceptedRequests / t.totalRequest : 0;
//             const cancellationRate = t.totalRequest > 0 ? t.cancelledRequests / t.totalRequest : 0;



//             const finalScore =
//                 0.30 * distanceScore +
//                 0.25 * ratingScore +
//                 0.20 * acceptanceRate +
//                 0.10 * (1 - cancellationRate) +


//             return {
//                 transporter: t,
//                 distanceScore,
//                 ratingScore,
//                 finalScore
//             };
//         });

//         const sortedTransporters = scoredTransporters.sort((a, b) => {

//             if (b.finalScore !== a.finalScore)
//                 return b.finalScore - a.finalScore;

//             if (a.distanceScore !== b.distanceScore)
//                 return a.distanceScore - b.distanceScore;

//             return b.ratingScore - a.ratingScore;
//         });

//         const top5 = sortedTransporters.slice(0, 5);

//         const assignments = [];


//         for (let i = 0; i < top5.length; i++) {

//             assignments.push({
//                 sellerOrder: sellerOrder._id,
//                 transporter: top5[i].transporter._id,
//                 priority: i + 1,
//                 status: i === 0 ? "pending" : "waiting",
//                 requestedAt: i === 0 ? new Date() : null,
//                 expiresAt: i === 0 ? new Date(Date.now() + 15 * 60 * 1000) : null
//             });
//         }

//         await TransporterAssignment.insertMany(assignments);

//         await transportRequestNotification({
//             transporterId: top5[0].transporter._id,
//             sellerOrderId: sellerOrder._id
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Transporter dispatch started"
//         });

//     } catch (error) {

//         console.error("Transporter Recommendation Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };


// export const acceptTransportRequest = async (req, res) => {
//     try {

//         const transporterId = req.user.transporterId;
//         const { taskId } = req.params;

//         if (  !assignment.transporter || assignment.transporter.toString() !== transporterId.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Not your assignment"
//             });
//         }


//         if (!["pending", "waiting"].includes(assignment.status)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Assignment already processed"
//             });
//         }


//         if (assignment.expiresAt && new Date() > assignment.expiresAt) {
//             assignment.status = "expired";
//             await assignment.save();

//             return res.status(400).json({
//                 success: false,
//                 message: "Request expired"
//             });
//         }


//         assignment.status = "accepted";
//         assignment.respondedAt = new Date();
//         await assignment.save();


//         await TransporterAssignment.updateMany(
//             {
//                 sellerOrder: sellerOrderId,
//                 _id: { $ne: assignment._id }
//             },
//             {
//                 $set: { status: "expired" }
//             }
//         );


//         const sellerOrder = await SellerOrder.findById(sellerOrderId);

//         if (!sellerOrder) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Seller order not found"
//             });
//         }


//         const transporter = await TransportProvider.findById(transporterId);

//         if (!transporter || !transporter.location) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Transporter not found or missing location"
//             });
//         }


//         const [sellerLon, sellerLat] = sellerOrder.pickupLocation.coordinates;
//         const [buyerLon, buyerLat] = sellerOrder.deliveryLocation.coordinates;
//         const [transporterLon, transporterLat] = transporter.location.coordinates;


//         let totalWeight = 0;
//         sellerOrder.products.forEach(item => {
//             totalWeight += item.quantity;
//         });


//         const transportationData = calculateTransportationCost({
//             transporterLat,
//             transporterLon,
//             sellerLat,
//             sellerLon,
//             buyerLat,
//             buyerLon,
//             totalWeight
//         });

//         sellerOrder.transporter = transporterId;
//         sellerOrder.deliveryCost = transportationData.totalCost;
//         sellerOrder.status = "accepted"; 
//         sellerOrder.transporterAssignedAt = new Date();

//         await sellerOrder.save();

   
//         await TransportProvider.findByIdAndUpdate(transporterId, {
//             $inc: {
//                 acceptedRequests: 1,
//                 activeDeliveriesCount: 1
//             }
//         });

//         //    Notification 

//         sendPickupNotification({
//             sellerId: sellerOrder.seller,
//             transporterId,
//             sellerOrderId
//         }).catch(err => console.log("Notification Error:", err));

//         return res.status(200).json({
//             success: true,
//             message: "Transport request accepted",
//             deliveryCost: transportationData.totalCost
//         });

//     } catch (error) {
//         console.log("acceptTransportRequest error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };



// export const rejectTransportRequest = async (req, res) => {
//     try {

//         const transporterId = req.user.transporterId;
//         const { sellerOrderId } = req.params;

//         const assignment = await TransporterAssignment.findOne({
//             sellerOrder: sellerOrderId,
//             transporter: transporterId,
//             status: "pending"
//         });

//         if (!assignment) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No pending assignment found"
//             });
//         }

//         assignment.status = "rejected";
//         await assignment.save();

//         await TransportProvider.findByIdAndUpdate(                       // transporter stats
//             transporterId,
//             {
//                 $inc: {
//                     cancelledRequests: 1
//                 }
//             }
//         );

//         await activateNextTransporterService(sellerOrderId);      // activate next transporter

//         return res.status(200).json({
//             success: true,
//             message: "Transport request rejected"
//         });

//     } catch (error) {

//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };






// export const getRideRequestById = async (req: Request, res: Response): Promise<Response> => {
//     try {



//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({ message: "Internal Server Error", success: false });
//     }
// }



// export const acceptRideRequest = async (req: Request, res: Response): Promise<Response> => {
//     try {



//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({ message: "Internal Server Error", success: false });
//     }
// }


// export const rejectRideRequest = async (req: Request, res: Response): Promise<Response> => {
//     try {



//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({ message: "Internal Server Error", success: false });
//     }
// }
