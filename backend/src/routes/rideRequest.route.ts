import { acceptRideRequest, createRideRequest, getAllRideReqsOfAnUser , getRideReqByIdOfAnUser } from './../controllers/RideRequestController.js';

import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";
import isTransporter from '../middleware/isTransporter.js';
import { cancelRideRequest } from '../controllers/CustomerController.js';

const router = Router();

router.post("/create", isAuthenticated, isCustomer, createRideRequest)
router.post("/accept/:rideRequestId",isAuthenticated,isTransporter, acceptRideRequest);
router.post("/cancel/:rideRequestId",isAuthenticated,isCustomer,cancelRideRequest);
router.get("/get-all-ride-requests", isAuthenticated, isCustomer, getAllRideReqsOfAnUser);
router.get("/get-ride-request/:rideRequestId", isAuthenticated, isCustomer, getRideReqByIdOfAnUser);

export default router;

