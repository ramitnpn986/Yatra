import { getAllRideReqsOfAnUser , getRideReqByIdOfAnUser } from './../controllers/RideRequestController.js';

import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";


const router = Router();

router.get("/get-all-ride-requests", isAuthenticated, isCustomer, getAllRideReqsOfAnUser);
router.get("/get-ride-request/:rideRequestId", isAuthenticated, isCustomer, getRideReqByIdOfAnUser);

export default router;

