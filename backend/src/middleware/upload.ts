import multer from "multer";

const upload = multer({
    dest: "uploads/",
});

export const kycUpload = upload.fields([
    { name: "citizenshipCard", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
    { name: "vehicleRegistration", maxCount: 1 },
    { name: "vehiclePhoto", maxCount: 1 },
]);