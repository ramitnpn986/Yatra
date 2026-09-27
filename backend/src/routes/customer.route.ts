import { Router } from "express";
import {
    registerCustomer, loginUser, logout, getCustomerProfile,
    updateCustomerProfile, changeCustomerPassword, cancelRideRequest,
    getRideRequestStatus, getCurrentRide, getMatchedTransporter, cancelRide, getRideStatus
} from "../controllers/CustomerController.js";
import { createRideRequest } from "../controllers/RideRequestController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isCustomer from "../middleware/isCustomer.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

router.post("/register", registerCustomer);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/get-profile", isAuthenticated,isCustomer, getCustomerProfile);
router.post("/change-password", isAuthenticated, isCustomer, changeCustomerPassword);
router.post("/update-profile",isAuthenticated, isCustomer,uploadImage.single("profileImage"), updateCustomerProfile);
router.post("/request-ride", isAuthenticated, isCustomer, createRideRequest);
router.post("/cancel-ride-request",isAuthenticated, isCustomer, cancelRideRequest);
router.get("/get-ride-request/:id",isAuthenticated, isCustomer, getRideRequestStatus);
router.get("/get-ride/:id",isAuthenticated,isCustomer, getCurrentRide);
router.post("/cancel-ride",isAuthenticated, isCustomer, cancelRide);
router.get("/get-ride-status/:id",isAuthenticated,isCustomer, getRideStatus);
router.get("/get-matched-transporter",isAuthenticated ,isCustomer, getMatchedTransporter);


export default router;
