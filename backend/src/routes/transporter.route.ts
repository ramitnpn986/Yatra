import { Router } from "express";
import { registerTransporter, loginTransporter,setLocation, logout, getTransporterProfile,
     changeTransporterPassword, updateAvailablity, updateCurrentLocation

 } from "../controllers/TransporterController.js";
import upload from "../middleware/upload.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

router.post("/register",registerTransporter);
router.post("/login",loginTransporter);
router.post("/logout",logout);
router.get("/get-profile",isAuthenticated, getTransporterProfile);
router.post("/change-password",isAuthenticated, changeTransporterPassword);
router.patch("/update-availability",isAuthenticated, updateAvailablity);
router.post("/change-current-location",isAuthenticated, updateCurrentLocation)
router.post("/change-location",isAuthenticated, setLocation)

// router.post("/submit-kyc", isAuthenticated, upload.fields([
//         { name: "citizenshipCard", maxCount: 1 },
//         { name: "drivingLicense", maxCount: 1 },
//         { name: "vehicleRegistration", maxCount: 1 },
//         { name: "vehiclePhoto", maxCount: 1 },
// ]), submitKyc );



export default router;