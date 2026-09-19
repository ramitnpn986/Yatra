declare global {
    namespace Express {
        interface Request {
            user?: {
                adminId?: string;
                customerId?: string;
                transporterId?: string;
                role: "admin" | "customer" | "transporter";
            };

            files?: {
                citizenshipCard?: Express.Multer.File[];
                drivingLicense?: Express.Multer.File[];
                vehicleRegistration?: Express.Multer.File[];
                vehiclePhoto?: Express.Multer.File[];
            };
        }
    }
}

export {};