import {
    acceptRideRequest, createRideRequest, getAllRideReqsOfAnUser, getRideReqByIdOfAnUser,
    vehicleRentalRequest, acceptRentalRequest, rejectRentalRequest, cancelRentalRequest,
} from './../controllers/RideRequestController.js';

import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";
import isTransporter from '../middleware/isTransporter.js';
import { cancelRideRequest } from '../controllers/CustomerController.js';

const router = Router();

router.post("/create", isAuthenticated, isCustomer, createRideRequest)
router.post("/accept/:rideRequestId", isAuthenticated, isTransporter, acceptRideRequest);
router.post("/cancel/:rideRequestId", isAuthenticated, isCustomer, cancelRideRequest);
router.get("/get-all-ride-requests", isAuthenticated, isCustomer, getAllRideReqsOfAnUser);
router.get("/get-ride-request/:rideRequestId", isAuthenticated, isCustomer, getRideReqByIdOfAnUser);

// ---- Vehicle rental ----
router.post("/rental/create", isAuthenticated, isCustomer, vehicleRentalRequest);
router.post("/rental/accept/:rentalId", isAuthenticated, isTransporter, acceptRentalRequest);
router.post("/rental/reject/:rentalId", isAuthenticated, isTransporter, rejectRentalRequest);
router.post("/rental/cancel/:rentalId", isAuthenticated, cancelRentalRequest); // customer or transporter — role checked inside

export default router;