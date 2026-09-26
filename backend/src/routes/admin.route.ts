import { Router } from "express";
import {
    registerAdmin, loginAdmin, logout, getAdminProfile,
    updateAdminProfile, changeAdminPassword, getAllTransportersVerified, deleteTransportProvider,
    getTransportProviderById, verifyTransportProviderKYC, rejectTransportProviderKYC, blockUnBlockTransportProvider, getPendingKYCProviders,
    getBlockedTransportProviders, getAllCustomers, getCustomerById, blockUnBlockCustomer, deleteCustomer, getAllRides, getRideById, getActiveRides, getCancelledRides, getCompletedRides, viewRideDetails, getCancelRideById,
    getDashboardStats
} from "../controllers/AdminController.js";
import { uploadImage } from "../middleware/upload.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";

const router = Router();

router.post("/add-admin", registerAdmin);
router.post("/enter-admin", loginAdmin);
router.post("/logout", logout);
router.get("/get-profile", isAuthenticated, isAdmin, getAdminProfile);
router.post("/update-profile", isAuthenticated, isAdmin, uploadImage.single("profileImage"), updateAdminProfile);
router.post("/change-password", isAuthenticated, isAdmin, changeAdminPassword);

router.get("/transport-providers", isAuthenticated, isAdmin, getAllTransportersVerified);
router.get("/transport-provider/:transporterId", isAuthenticated, isAdmin, getTransportProviderById);
router.get("/transport-providers/pending-kyc", isAuthenticated, isAdmin, getPendingKYCProviders);
router.get("/transport-providers/blocked", isAuthenticated, isAdmin, getBlockedTransportProviders);

router.patch("/transport-provider/:id/verify-kyc", isAuthenticated, isAdmin, verifyTransportProviderKYC);
router.patch("/transport-provider/:id/reject-kyc", isAuthenticated, isAdmin, rejectTransportProviderKYC);
router.patch("/transport-provider/:id/block-unblock", isAuthenticated, isAdmin, blockUnBlockTransportProvider);
router.delete("/transport-provider/:id", isAuthenticated, isAdmin, deleteTransportProvider);

router.get("/customers", isAuthenticated, isAdmin, getAllCustomers);
router.get("/customer/:id", isAuthenticated, isAdmin, getCustomerById);
router.patch("/customer/:id/block-unblock", isAuthenticated, isAdmin, blockUnBlockCustomer);
router.delete("/customer/:id", isAuthenticated, isAdmin, deleteCustomer);

router.get("/rides", isAuthenticated, isAdmin, getAllRides);
router.get("/ride/:id", isAuthenticated, isAdmin, getRideById);
router.get("/rides/active", isAuthenticated, isAdmin, getActiveRides);
router.get("/rides/active", isAuthenticated, isAdmin, getCancelledRides);
router.get("/rides/active", isAuthenticated, isAdmin, getCompletedRides);
router.get("/rides/active", isAuthenticated, isAdmin, viewRideDetails);
router.get("/rides/active", isAuthenticated, isAdmin, getCancelRideById);
router.get("/get-stats", isAuthenticated, isAdmin, getDashboardStats);

export default router;