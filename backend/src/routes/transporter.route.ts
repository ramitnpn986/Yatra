import { Router } from "express";
import {
    registerTransporter, loginTransporter, setBaseLocation, logout, getTransporterProfile,
    changeTransporterPassword, updateAvailablity, updateCurrentLocation, updateTransporterProfile,
    submitKyc, getMyVehicles, updateVehicleRentalAvailability
} from "../controllers/TransporterController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isTransporter from "../middleware/isTransporter.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

router.post("/register", registerTransporter);
router.post("/login", loginTransporter);
router.post("/logout", logout);

const transporterAuth = [isAuthenticated, isTransporter];

router.get("/get-profile", ...transporterAuth, getTransporterProfile);
router.post("/update-profile", ...transporterAuth, uploadImage.single("profileImage"), updateTransporterProfile);
router.post("/change-password", ...transporterAuth, changeTransporterPassword);
router.patch("/update-availability", ...transporterAuth, updateAvailablity);
router.post("/change-current-location", ...transporterAuth, updateCurrentLocation);
router.put("/change-location", ...transporterAuth, setBaseLocation);

router.get("/vehicles", ...transporterAuth, getMyVehicles);
router.patch("/vehicles/:vehicleId/rental-availability", ...transporterAuth, updateVehicleRentalAvailability);

router.post("/submit-kyc", ...transporterAuth, uploadImage.fields([
    { name: "citizenshipCard", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
    { name: "vehicleRegistration", maxCount: 1 },
    { name: "vehiclePhoto", maxCount: 1 },
]), submitKyc);

export default router;