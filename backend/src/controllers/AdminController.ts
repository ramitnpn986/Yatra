import {deleteImage,uploadImage} from "../utils/cloudinary.js";
import { Request, Response } from 'express';
import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { TransportProvider } from '../models/TransportProvider.js';
import Customer from '../models/Customer.js';
import { Ride } from '../models/Ride.js';

export const getAllRides = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rides = await Ride.find()
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle")
            .sort({ requestedAt: -1 });

        return res.status(200).json({
            success: true,
            count: rides.length,
            rides,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const registerAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, phone } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!name || !phone || !adminPassword) {
            return res.status(400).json({
                message: " Required fields  are missing",
                success: false,
            })
        }

        const existingUser = await Admin.findOne({ phone });

        if (existingUser) {
            return res.status(409).json({
                message: "Admin with this phone number already exists",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = new Admin({
            name,
            phone,
            password: hashedPassword
        })

        await admin.save();

        return res.status(201).json({
            message: "Admin Created Successfuly !",
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

export const loginAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const admin = await Admin.findOne({ phone }).select('+password')

        if (!admin) {
            return res.status(400).json({
                message: "Invalid phone or password",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

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
            { adminId: admin._id, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        const adminData = {
            id: admin._id,
            name: admin.name,
            phone: admin.phone,
            role: "admin",
            profileImage: admin.profileImage?.url,
        }

        const isProduction = process.env.NODE_ENV === 'production';

        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({
            message: "Login successful",
            success: true,
            customer: adminData,
            role:"admin"
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });

    }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';

        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
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

export const getAdminProfile = async (req: Request, res: Response): Promise<Response> => {

    try {
        const adminId = req.user?.adminId;
        const admin = await Admin.findById(adminId).select('-password');

        if (!admin) {
            return res.status(404).json({ message: "Admin not found", success: false });
        }
        return res.status(200).json({ success: true, admin });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const updateAdminProfile = async (req: Request, res: Response): Promise<Response> => {
    try {

        const adminId = req.user?.adminId;
        const { name } = req.body;

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found", success: false });
        }

        if (name) admin.name = name.trim();

        if (req.file) {
            if (admin.profileImage?.public_id) {
                await deleteImage(admin.profileImage.public_id);
            }

            const result = await uploadImage(req.file.buffer, "Yatra/admins");

            admin.profileImage = {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            admin: {
                _id: admin._id,
                name: admin.name,
                phone: admin.phone,
                profileImage: admin.profileImage
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const changeAdminPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const adminId = req.user?.adminId;

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const admin = await Admin.findById(adminId).select("+password");

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false
            })
        }
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, admin.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;

        await admin.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });



    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getAllTransportersVerified = async (req: Request, res: Response): Promise<Response> => {
    try {
        const allTransportProviders = await TransportProvider.find().select('-password');
        return res.status(200).json({
            success: true,
            transporters: allTransportProviders
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getTransportProviderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transporterId = req.params.transporterId;
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });
        }

        return res.status(200).json({
            success: true,
            transporter
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const verifyTransportProviderKYC = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { transporterId } = req.params;

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transport provider not found",
            });
        }

        if (!transporter.isKycDataSubmitted) {
            return res.status(400).json({
                success: false,
                message: " KYC data has not been submitted"
            })
        }

        if (transporter.isKycCompleted) {
            return res.status(400).json({
                success: false,
                message: "KYC is already verified"
            })
        }

        transporter.isKycCompleted = true;
        transporter.isVerified = true;
        transporter.verificationStatus = "approved";
        transporter.verifiedAt = new Date();

        await transporter.save();

        return res.status(200).json({
            message: "Transport Provider Kyc Verified successfully"
        })



    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}

export const rejectTransportProviderKYC = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { transporterId } = req.params;

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transport provider not found",
            });
        }

        if (!transporter.isKycDataSubmitted) {
            return res.status(400).json({
                success: false,
                message: " KYC data has not been submitted"
            })
        }

        transporter.isKycCompleted = false;
        transporter.isVerified = false;
        transporter.verificationStatus = "rejected";
        transporter.verifiedAt = undefined;

        await transporter.save();

        return res.status(200).json({
            success: true,
            message: "Transport provider KYC rejected successfully",
            transporter,
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}

export const deleteTransportProvider = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transporterId = req.params.transporterId;
        const transporter = await TransportProvider.findByIdAndDelete(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });

        }

        return res.status(200).json({
            message: "Trasporter removed successfully !",
            success: true
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const blockUnBlockTransportProvider = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { action } = req.body;
        const transporterId = req.params.transporterId;

        const isValidAction = ["block", "unblock"].includes(action);

        if (!isValidAction) {
            return res.status(400).json({
                message: "Invalid action",
                success: false,
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found !",
                success: false
            })
        }

        if (action === "block" && transporter.isBlocked) {
            return res.status(400).json({
                message: "Transporter is already blocked",
                success: false,
            });
        } else {
            transporter.isBlocked = true;
        }

        if (action === "unblock" && !transporter.isBlocked) {
            return res.status(400).json({
                message: "Transporter is already unblocked",
                success: false,
            });
        } else {
            transporter.isBlocked = false;
        }

        await transporter.save();

        return res.status(200).json({
            message: `Transporter ${action}ed successfully`,
            success: true,
        });



    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getPendingKYCProviders = async (req: Request, res: Response): Promise<Response> => {
    try {

        const transporters = await TransportProvider.find({
            isKycCompleted: false,
            isKycDataSubmitted: true

        }).select("-password");

        return res.status(200).json({
            success: true,
            count: transporters.length,
            transporters,
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getBlockedTransportProviders = async (req: Request, res: Response): Promise<Response> => {
    try {

        const transporters = await TransportProvider.find({
            isBlocked: true,
        }).select("-password");

        return res.status(200).json({
            success: true,
            count: transporters.length,
            transporters,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getAllCustomers = async (req: Request, res: Response): Promise<Response> => {
    try {

        const customers = await Customer.find().select("-password");
        return res.status(200).json({
            success: true,
            count: customers.length,
            customers,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getCustomerById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const customerId = req.params.customerId;
        const customer = await Customer.findById(customerId).select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            success: true,
            customer
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const blockUnBlockCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { action } = req.body;
        const customerId = req.params.customerId;

        const isValidAction = ["block", "unblock"].includes(action);

        if (!isValidAction) {
            return res.status(400).json({
                message: "Invalid action",
                success: false,
            });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                message: "Transporter not found !",
                success: false
            })
        }

        if (action === "block" && customer.isBlocked) {
            return res.status(400).json({
                message: "Transporter is already blocked",
                success: false,
            });
        } else {
            customer.isBlocked = true;
        }

        if (action === "unblock" && !customer.isBlocked) {
            return res.status(400).json({
                message: "Transporter is already unblocked",
                success: false,
            });
        } else {
            customer.isBlocked = false;
        }

        await customer.save();

        return res.status(200).json({
            message: `Customer ${action}ed successfully`,
            success: true,
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const deleteCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const customerId = req.params.transporterId;
        const customer = await Customer.findByIdAndDelete(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            message: "Customer removed successfully !",
            success: true
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getRideById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        const ride = await Ride.findById(id)
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle");

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found",
            });
        }

        return res.status(200).json({
            success: true,
            ride,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getActiveRides = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rides = await Ride.find({
            status: { $in: ["confirmed", "driver_arriving", "driver_arrived", "started"] }

        })
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle")
            .sort({ requestedAt: -1 });

        return res.status(200).json({
            success: true,
            count: rides.length,
            rides,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const viewRideDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const ride = await Ride.findById(id)
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle");

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found",
            });
        }
        return res.status(200).json({
            success: true,
            ride,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const getCancelRideById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const ride = await Ride.findById(id)
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle");

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found",
            });
        }
        if (ride.status !== "cancelled") {
            return res.status(400).json({
                success: false,
                message: "This ride is not cancelled",
            });
        }
        return res.status(200).json({
            success: true,
            ride,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const getCancelledRides = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rides = await Ride.find({ status: "cancelled" })
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle")
            .sort({ cancelledAt: -1 });

        return res.status(200).json({
            success: true,
            count: rides.length,
            rides,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const getCompletedRides = async (req: Request, res: Response): Promise<Response> => {
    try {
        const rides = await Ride.find({ status: "completed" })
            .populate("customer", "name phone")
            .populate("transporter", "name phone vehicle")
            .sort({ completedAt: -1 });

        return res.status(200).json({
            success: true,
            count: rides.length,
            rides,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const getDashboardStats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const [  totalCustomers, totalTransporters,   kycPending,   activeRides] = await Promise.all([
            Customer.countDocuments(),
            TransportProvider.countDocuments(),
            TransportProvider.countDocuments({ kycStatus: "pending" }),
            Ride.countDocuments({ status: "active" })
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalCustomers,
                totalTransporters,
                kycPending,
                activeRides
            }
        })


    } catch (err) {
        console.error("Dashboard stats error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
}