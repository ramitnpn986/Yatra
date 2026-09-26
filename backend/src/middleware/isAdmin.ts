import type { NextFunction, Request, Response } from "express";


const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                message: "Admin access only",
                success: false,
            });
        }
        next();

    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({
            message: 'Authentication failed',
            success: false
        });
    }
}

export default isAdmin;