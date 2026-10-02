import { TransportProvider } from "../models/TransportProvider.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import {Request,Response} from "express";
import { isAbaRouting } from "validator";
import RideRequest from "../models/RideRequest.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";


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

        if(role==="rider" || role==="passenger" || role==="admin"){
            return res.status(400).json({
                message: "Invalid role",
                success: false
            })
        }

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

        console.log("i am hitted");
        const { phone, password } = req.body;
  

        if (!phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const transporter = await TransportProvider.findOne({ phone }).select('+password')
        console.log(transporter)

        if (!transporter) {
            return res.status(400).json({
                message: "Invalid phone or password",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, transporter.password);
        console.log(isPasswordValid);

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
            { transporterId: transporter._id.toString(), role: 'transporter' },
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

        let { vehicleType, numberPlate, capacityKg, serviceAreas } = req.body;

         if( !citizenshipCard?.[0] || !drivingLicense?.[0] || !vehicleRegistration?.[0] || !vehiclePhoto?.[0] || !vehicleType || !numberPlate || !capacityKg ) {
           return res.status(400).json({
              success: false,
               message: "All fields are required",
           }); 
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


        if (!transporter.location || !transporter.location.coordinates || transporter.location.coordinates.length !== 2) {
               return res.status(400).json({
                success: false,
                message: "Please set your base location before submitting KYC",
                code: "BASE_LOCATION_REQUIRED",
             });
        }

        if (transporter.isKycCompleted && transporter.verificationStatus !== "rejected") {
            return res.status(400).json({
                success: false,
                message: "KYC already submitted"
            });
        }

        const citizenshipRes = await uploadImage(citizenshipCard[0].buffer, "Yatra/kyc/citizenship");
        const drivingLicenseRes = await uploadImage(drivingLicense[0].buffer, "Yatra/kyc/driving-license")
        const vehicleRegistrationRes = await uploadImage(vehicleRegistration[0].buffer, "Yatra/kyc/vehicle-registration");
        const vehiclePhotoRes = await uploadImage( vehiclePhoto[0].buffer, "Yatra/kyc/vehicle-photo");
  
       
        transporter.documents = {
            citizenshipCard: citizenshipRes.secure_url,
            drivingLicense: drivingLicenseRes.secure_url,
            vehicleRegistration: vehicleRegistrationRes.secure_url,
        }

        transporter.vehicle = {
            type: vehicleType,
            numberPlate,
            capacityKg,
            vehiclePhoto: vehiclePhotoRes.secure_url,
        };

        transporter.serviceAreas = serviceAreas || [];
        transporter.pricePerKm = vehicleType === "Bike" ? 30 : vehicleType === "Car" ? 40 : vehicleType === "Truck" ? 70 : vehicleType === "Bus" ? 100 : 0;

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

export const updateTransporterProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transporterId = req.user?.transporterId;
        const { name } = req.body;

        if (!name || name.trim().length < 4) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 4 characters",
            });
        }

        const transporter = await TransportProvider.findById(transporterId).select("-password");

        if (!transporter) {
            return res.status(404).json({ success: false, message: "Transporter not found" });
        }

        transporter.name = name.trim();

        if (req.file) {
            if(transporter.profileImage?.public_id){
                await deleteImage(transporter.profileImage.public_id);
            }

            const result = await uploadImage(req.file.buffer, "Yatra/transporters");
            
            transporter.profileImage = {
                url: result.secure_url,
                public_id: result.public_id,
            };
          
        }

        await transporter.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            transporter,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const setBaseLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const transporterId = req.user?.transporterId;
        const { location } = req.body;
        const { coordinates, address, province, district, municipality, ward } = location || {};

        console.log(coordinates, address, province, district, municipality, ward);

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

        transporter.location = {
            type: "Point",
            coordinates,
            address,
            province,
            district,
            municipality,
            ward
        };

        await transporter.save();

        return res.status(200).json({
            message: "Base location updated successfully",
            success: true,
            location: transporter.location
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const changeTransporterPassword = async (req: Request, res: Response): Promise<Response> => {
    try {

        const transporterId = req.user?.transporterId;

        const { oldPassword, newPassword } = req.body;

        console.log(oldPassword, newPassword);

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




//   Transporter GPS
//       ↓
//    Socket.IO
//       ↓
//    Backend
//       ↓
//   Passenger Socket
//       ↓
//   Passenger Map



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

        const [longitude, latitude] = coordinates; 

        if(longitude < -180 || longitude > 180 || latitude < -90 || latitude >90){
                return res.status(400).json({
                    message:"Invalid longitude or latitude",
                    success: false
                })
        }

        const transporter = await TransportProvider.findByIdAndUpdate(transporterId,
            {
                $set:{
                     "currentLocation.type": "Point",
                    "currentLocation.coordinates": [
                        longitude,
                        latitude,
                    ],
                    "currentLocation.lastUpdatedAt": new Date(),
                }
            },{
                select: "-password"
            }
        );


        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            });
        }


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








