import { getAllRideOfAnUser , getRideByIdOfAnUser } from './../controllers/RideController.js';

import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";

const router = Router();

router.get("/get-all-rides", isAuthenticated, isCustomer, getAllRideOfAnUser);
router.get("/get-ride/:rideId", isAuthenticated, isCustomer, getRideByIdOfAnUser);


export default router;