import "dotenv/config";

import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/utils/db.js";
import CutomerRoutes from "./src/routes/customer.route.js";
import TransportRoutes from "./src/routes/transporter.route.js";
import AdminRoutes from "./src/routes/admin.route.js";
import RideRoutes from "./src/routes/ride.route.js"
import RideRequestRoutes from './src/routes/rideRequest.route.js'
import { initializeSocket } from "./src/sockets/socket.js";

const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/v88/admin-end", AdminRoutes);
app.use("/api/v8/users", CutomerRoutes);
app.use("/api/v8/transporters", TransportRoutes);
app.use("/api/v8/ride", RideRoutes);
app.use("/api/v8/ride-request", RideRequestRoutes);

initializeSocket(httpServer);

const startServer = async () => {
    try {
        await connectDB();

        httpServer.listen(PORT, () => {
            console.log(`server is running at port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();