import type { NextFunction, Request, Response } from "express";

const isBookingPartner = ( req: Request, res: Response, next: NextFunction) => {
    try {
        if ( req.user?.role !== "transporter" || req.user?.transporterRole !== "booking-partner") {
            return res.status(403).json({
                success: false,
                message: "Only booking partners can access this resource",
            });
        }

        next();
    } catch (error) {
        console.error("Authorization error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default isBookingPartner;