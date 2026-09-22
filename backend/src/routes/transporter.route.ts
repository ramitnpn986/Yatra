import { Router } from "express";
import { registerTransporter, loginTransporter,setLocation, logout, getTransporterProfile,
    changeTransporterPassword, updateAvailablity, updateCurrentLocation, updateTransporterProfile

 } from "../controllers/TransporterController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isTransporter from "../middleware/isTransporter.js";
import { profileUpload } from "../middleware/upload.js";

const router = Router();

router.post("/register",registerTransporter);
router.post("/login",loginTransporter);
router.post("/logout",logout);
const transporterAuth = [isAuthenticated, isTransporter];

router.get("/get-profile", ...transporterAuth, getTransporterProfile);
router.post("/update-profile", ...transporterAuth, profileUpload, updateTransporterProfile);
router.post("/change-password", ...transporterAuth, changeTransporterPassword);
router.patch("/update-availability", ...transporterAuth, updateAvailablity);
router.post("/change-current-location", ...transporterAuth, updateCurrentLocation)
router.post("/change-location", ...transporterAuth, setLocation)

// router.post("/submit-kyc", isAuthenticated, upload.fields([
//         { name: "citizenshipCard", maxCount: 1 },
//         { name: "drivingLicense", maxCount: 1 },
//         { name: "vehicleRegistration", maxCount: 1 },
//         { name: "vehiclePhoto", maxCount: 1 },
// ]), submitKyc );



export default router;