import { Request, Response } from 'express';
import Customer from '../models/Customer.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { TransportProvider } from '../models/TransportProvider.js';
import RideRequest from '../models/RideRequest.js';
import { Ride } from '../models/Ride.js';


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};



export const registerCustomer = async (req: Request, res: Response) => {
    try {

        const { name, phone, password } = req.body;
        console.log(name, phone, password)
        console.log("i am here")

        if (!name || !phone || !password) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false,
            })
        }

        const existingUser = await Customer.findOne({ phone });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this phone number already exists",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Customer({
            name,
            phone,
            password: hashedPassword
        })

        await newUser.save();

        return res.status(201).json({
            message: "User Created Successfuly !",
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

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const customer = await Customer.findOne({ phone }).select('+password')

        if (!customer) {
            return res.status(400).json({
                message: "Invalid phone or password",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);

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
            { customerId: customer._id, role: 'customer' },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        const customerData = {
            id: customer._id,
            name: customer.name,
            phone: customer.phone,
            role: "customer",
            profileImage: customer.profileImage?.url,
        }


        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({
            message: "Login successful",
            success: true,
            customer: customerData,
            role:"customer"
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
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

export const getCustomerProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const customerId = req.user?.customerId;
        const customer = await Customer.findById(customerId).select("-password");

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
                success: false
            })
        }

        return res.status(200).json({
            message:"Customer profile featched successfully",
            success: true,
            customer
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error");
    }
}


export const changeCustomerPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const customerId = req.user?.customerId;

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const customer = await Customer.findById(customerId).select("+password");

        if (!customer) {
            return res.status(404).json({
                message: "Admin not found",
                success: false
            })
        }
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, customer.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, customer.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        customer.password = hashedNewPassword;

        await customer.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const updateCustomerProfile = async (req: Request, res: Response): Promise<Response> => {
    try {

        const customerId = req.user?.customerId;
        const { name } = req.body;

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: "Admin not found", success: false });
        }

        if (name) customer.name = name.trim();
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
                profileImage: customer.profileImage
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const requestRide = async (req: Request, res: Response): Promise<Response> => {
    try {
        const customerId = req.user?.customerId;
        const transporterId = req.params.transporterId;
        const { pickupLocation, dropoffLocation, passengerCount } = req.body;

        if (!pickupLocation?.coordinates || !dropoffLocation?.coordinates || pickupLocation.coordinates.length !== 2 ||
            dropoffLocation.coordinates.length !== 2) {
            return res.status(400).json({
                message: "location validation failed",
                success: false
            })
        }

        if (!customerId) {
            return res.status(401).json({
                message: "Customer authentication required",
                success: false,
            });
        }

        const transporter = await TransportProvider.findById(transporterId).select("-password");
        if (!transporter) {
            return res.status(404).json({
                messsage: "Transporter not found !",
                success: false
            })
        }

        const vehicleType = transporter.vehicle?.type;

        if (!vehicleType) {
            return res.status(400).json({
                message: "Transporter vehicle information is missing",
                success: false,
            });
        }

        if (!transporter.isAvailable) {
            return res.status(404).json({
                messsage: "Transporter is not available !",
                success: false
            })
        }

        if (!transporter.isVerified || transporter.isBlocked || !transporter.isKycCompleted) {
            return res.status(404).json({
                messsage: "Transporter is not eligible for rides !",
                success: false
            })
        }

        const [pickupLongitude, pickupLatitude] = pickupLocation.coordinates;
        const [dropoffLongitude, dropoffLatitude] = dropoffLocation.coordinates;

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/` + `${pickupLongitude},${pickupLatitude};` + `${dropoffLongitude},${dropoffLatitude}` + `?overview=false`;

        const routeResponse = await fetch(osrmUrl);

        if (!routeResponse.ok) {
            return res.status(500).json({
                message: "Unable to calculate the route",
                success: false
            })
        }

        const routeData = await routeResponse.json();

        if (routeData.code !== "Ok" || !routeData.routes?.length) {
            return res.status(400).json({
                message: "Route could not be found",
                success: false,
            });
        }

        const distanceKm = routeData.routes[0].distance / 1000;
        const pricePerKm = transporter.pricePerKm || 0;
        const estimatedFare = distanceKm * pricePerKm;

        // Request expires after 5 minutes
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        const rideRequest = await RideRequest.create({
            customer: customerId,
            pickupLocation: {
                address: pickupLocation.address,
                coordinates: pickupLocation.coordinates
            },
            dropoffLocation: {
                address: dropoffLocation.address,
                coordinates: dropoffLocation.coordinates,
            },

            distanceKm: Number(distanceKm.toFixed(2)),

            estimatedFare: Number(
                estimatedFare.toFixed(2)
            ),
            vehicleType,
            passengerCount: passengerCount || 1,
            status: "pending",
            expiresAt

        })


        return res.status(201).json({
            message: "Ride requested successfully",
            success: true,
            rideRequest: {
                id: rideRequest._id,
                pickupLocation: rideRequest.pickupLocation,
                dropoffLocation: rideRequest.dropoffLocation,
                distanceKm: rideRequest.distanceKm,
                estimatedFare: rideRequest.estimatedFare,
                vehicleType: rideRequest.vehicleType,
                passengerCount: rideRequest.passengerCount,
                status: rideRequest.status,
                expiresAt: rideRequest.expiresAt,
            }

        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })

    }
}

export const cancelRideRequest = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rideRequestId = req.params.id;
        const customerId = req.user?.customerId;

        if (!customerId) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
        }

        const rideRequest = await RideRequest.findById(rideRequestId);

        if (!rideRequest) {
            return res.status(404).json({
                message: "Ride Request not found",
                success: false
            })
        }

        if (rideRequest.customer.toString() !== customerId) {
            return res.status(403).json({
                message: " you are not authorized to cancel",
                success: false
            })
        }

        if (rideRequest.status !== "pending") {
            return res.status(400).json({
                message: `Ride request cannot be cancelled because it is already ${rideRequest.status}`,
                success: false,
            });
        }

        rideRequest.status = "cancelled";
        rideRequest.cancelledAt = new Date()

        await rideRequest.save();

        return res.status(200).json({
            message: "Ride request cancelled successfully",
            success: true,
            rideRequest,
        });



    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getRideRequestStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rideRequestId = req.params.id;
        const customerId = req.user?.customerId;

        if (!customerId) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
        }

        const rideRequest = await RideRequest.findById(rideRequestId);

        if (!rideRequest) {
            return res.status(404).json({
                message: "Ride Request not found",
                success: false
            })
        }

        if (rideRequest.customer.toString() !== customerId) {
            return res.status(403).json({
                message: " you are not authorized to access the Request Information",
                success: false
            })
        }

        return res.status(200).json({
            message:" status fetched successfully !",
            success: true,
            status: rideRequest.status
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });

    }
}

export const getMatchedTransporter = async (req: Request, res: Response): Promise<Response> => {
    try{
        const rideRequestId=req.params.id;
        const customerId=req.user?.customerId;

        const ride = await Ride.findOne({rideRequest:rideRequestId,customer:customerId})
                 .populate("transporter","name phone vehicle");
                 if(!ride){
                    return res.status(200).json({
                        message:"No matched transporter found for this request yet",
                        success:false,
                    });
                 }
                 return res.status(200).json({
                    success:true,
                    transporter:ride.transporter,
                 });

    }catch(err){
        console.error(err);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,
        });
    }
}


export const getCurrentRide = async (req: Request, res: Response): Promise<Response> => {
    try {
        const customerId = req.user?.customerId;

        const ride = await Ride.findOne({
            customer: customerId,
            status: { $in: ["confirmed", "driver_arriving", "driver_arrived", "started"] }
        }).populate("transporter", "name phone vehicle");

        if (!ride) {
            return res.status(404).json({
                message: "No current ride in progress",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            ride,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const cancelRide = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rideId = req.params.id;
        const customerId = req.user?.customerId;

        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found",
                success: false,
            });
        }

        if (ride.customer.toString() !== customerId) {
            return res.status(403).json({
                message: "You are not authorized to cancel this ride",
                success: false,
            });
        }

        if (ride.status === "completed" || ride.status === "cancelled") {
            return res.status(400).json({
                message: `Ride cannot be cancelled because it is already ${ride.status}`,
                success: false,
            });
        }

        ride.status = "cancelled";
        ride.cancelledBy = "customer";
        ride.cancelledAt = new Date();

        await ride.save();

        return res.status(200).json({
            message: "Ride cancelled successfully",
            success: true,
            ride,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getRideStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rideId = req.params.id;
        const customerId = req.user?.customerId;

        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found",
                success: false,
            });
        }

        if (ride.customer.toString() !== customerId) {
            return res.status(403).json({
                message: "You are not authorized to access this ride's information",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            status: ride.status,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}