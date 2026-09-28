import { getAllRideReqsOfAnUser , getRideReqByIdOfAnUser } from './../controllers/RideRequestController.js';

import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";


const router = Router();

router.post("/get-all-ride-requests", isAuthenticated, isCustomer, getAllRideReqsOfAnUser);
router.post("/get-ride-request/:rideRequestId", isAuthenticated, isCustomer, getAllRideReqsOfAnUser);



export default router;