import {
    acceptRideRequest,
    createRideRequest,
    getAllRideReqsOfAnUser,
    getRideReqByIdOfAnUser,
    vehicleRentalRequest,
    acceptRentalRequest,
    rejectRentalRequest,
    cancelRentalRequest,
    getMyRentals,
    getPendingRentalRequests,
    cancelRideRequest,
    getRentalProviders,
    startRental,
    completeRental,
    payRentalDeposit,
} from "../controllers/RideRequestController.js";

import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";
import isTransporter from '../middleware/isTransporter.js';

const router = Router();

router.post("/create", isAuthenticated, isCustomer, createRideRequest)
router.post("/accept/:rideRequestId", isAuthenticated, isTransporter, acceptRideRequest);
router.post("/cancel/:rideRequestId", isAuthenticated, isCustomer, cancelRideRequest);
router.get("/get-all-ride-requests", isAuthenticated, isCustomer, getAllRideReqsOfAnUser);
router.get("/get-ride-request/:rideRequestId", isAuthenticated, isCustomer, getRideReqByIdOfAnUser);
router.post("/rental/create", isAuthenticated, isCustomer, vehicleRentalRequest);
router.get("/rental/providers", isAuthenticated, isCustomer, getRentalProviders);
router.post("/rental/accept/:rentalId", isAuthenticated, isTransporter, acceptRentalRequest);
router.post("/rental/start/:rentalId", isAuthenticated, isTransporter, startRental);
router.post("/rental/complete/:rentalId", isAuthenticated, isTransporter, completeRental);
router.post("/rental/reject/:rentalId", isAuthenticated, isTransporter, rejectRentalRequest);
router.post("/rental/cancel/:rentalId", isAuthenticated, cancelRentalRequest); 
router.post("/rental/pay-deposit/:rentalId", isAuthenticated, isCustomer, payRentalDeposit);
router.get(
    "/rental/my-rentals",
    isAuthenticated,
    isCustomer,
    getMyRentals
);

router.get(
    "/rental/pending",
    isAuthenticated,
    isTransporter,
    getPendingRentalRequests
);

export default router;