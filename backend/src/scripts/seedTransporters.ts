import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { TransportProvider } from "../models/TransportProvider.js";

dotenv.config();

const locations = [
  { address: "Butwal, Rupandehi", coordinates: [83.4486, 27.7000] },
  { address: "Devdaha, Rupandehi", coordinates: [83.4765, 27.6333] },
  { address: "Siddharthanagar, Rupandehi", coordinates: [83.4480, 27.5041] },
  { address: "Lumbini, Rupandehi", coordinates: [83.2766, 27.4833] },
  { address: "Taulihawa, Kapilvastu", coordinates: [83.0500, 27.5333] },
  { address: "Shivaraj, Kapilvastu", coordinates: [83.1200, 27.6100] },
  { address: "Manigram, Rupandehi", coordinates: [83.3600, 27.6300] },
  { address: "Sainamaina, Rupandehi", coordinates: [83.3900, 27.6000] },
  { address: "Tilottama, Rupandehi", coordinates: [83.4300, 27.6100] },
  { address: "Marchawari, Rupandehi", coordinates: [83.4000, 27.5800] },
];

const vehicleTypes = ["Bike", "Bike", "Bike", "Car", "Car", "Car", "Truck", "Truck", "Bus", "Bus"];

const names = [
  "Ramesh Thapa", "Sita Gurung", "Bikash Rai", "Anita Shrestha", "Kiran Magar",
  "Sunil Poudel", "Maya Tamang", "Rajan BK", "Sarita KC", "Dipesh Adhikari",
];

const testDocUrl = "https://picsum.photos/seed/placeholder/400/300";

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash("Test@1234", 10);

  for (let i = 0; i < 10; i++) {
    const phone = `98${(10000000 + i).toString()}`;
    const vehicleType = vehicleTypes[i];

    await TransportProvider.create({
      name: names[i],
      phone,
      password: hashedPassword,
      role: "rider",
      location: {
        type: "Point",
        coordinates: locations[i].coordinates,
        address: locations[i].address,
        province: "Lumbini",
        district: "Rupandehi",
        municipality: locations[i].address.split(",")[0],
        ward: "5",
      },
      isKycDataSubmitted: true,
      isKycCompleted: true,
      isVerified: false,
      verificationStatus: "pending",
      documents: {
        citizenshipCard: testDocUrl,
        drivingLicense: testDocUrl,
        vehicleRegistration: testDocUrl,
      },
      vehicle: {
        type: vehicleType,
        vehiclePhoto: testDocUrl,
        numberPlate: `BA ${10 + i} PA ${1000 + i}`,
        capacityKg: vehicleType === "Bike" ? 20 : vehicleType === "Car" ? 400 : vehicleType === "Truck" ? 2000 : 1000,
      },
      pricePerKm: vehicleType === "Bike" ? 25 : vehicleType === "Car" ? 40 : vehicleType === "Truck" ? 70 : 100,
    });

    console.log(`Created: ${names[i]} (${vehicleType}) at ${locations[i].address}`);
  }

  console.log("Done seeding 10 transporters.");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});