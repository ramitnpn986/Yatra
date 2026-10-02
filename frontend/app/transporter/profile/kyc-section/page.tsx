"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FileUploadField from "@/app/(customer)/components/FileUpload";
import { toast } from "sonner";

type FileField =
    | "citizenshipCard"
    | "drivingLicense"
    | "vehicleRegistration"
    | "vehiclePhoto";

interface User {
    isVerified: boolean;
    verificationStatus:
    | "approved"
    | "pending"
    | "rejected"
    | null;
    isKycDataSubmitted: boolean;
}

const Page = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch("/api/transporter/profile", {
                    credentials: "include",
                    cache: "no-store",
                });
                const data = await response.json();
                if (response.ok && data.success) setUser(data.transporter);
            } catch (error) {
                console.error("Failed to load KYC status:", error);
            }
        };

        void loadProfile();
    }, []);

    const [formData, setFormData] = useState({
        citizenshipCard: null,
        drivingLicense: null,
        vehicleRegistration: null,
        vehiclePhoto: null,
        vehicleType: "",
        numberPlate: "",
        capacityKg: "",
        serviceAreas: "",
    });

    const [errors, setErrors] = useState({
        citizenshipCard: "",
        drivingLicense: "",
        vehicleRegistration: "",
        vehiclePhoto: "",
        vehicleType: "",
        numberPlate: "",
        capacityKg: "",
        serviceAreas: "",
    });

    const [previews, setPreviews] = useState<Record<FileField, string | null>>({
        citizenshipCard: null,
        drivingLicense: null,
        vehicleRegistration: null,
        vehiclePhoto: null,
    });

    const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                [fieldName]: "Only JPG, PNG or PDF allowed",
            }));
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                [fieldName]: "File exceeds 3MB limit",
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [fieldName]: file,
        }));

        setPreviews((prev) => ({
            ...prev,
            [fieldName]: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : "pdf-placeholder",
        }));

        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    };

    const removeFile = (fieldName: FileField) => {
        const preview = previews[fieldName];

        if (preview && preview !== "pdf-placeholder") {
            URL.revokeObjectURL(preview);
        }
        setFormData((prev) => ({ ...prev, [fieldName]: null }));
        setPreviews((prev) => ({  ...prev, [fieldName]: null }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        if (user?.isKycDataSubmitted && user.verificationStatus !== "rejected") {
            toast.error("KYC has already been submitted");
            return;
        }

        setLoading(true);

        try {
            if (!formData.citizenshipCard || !formData.drivingLicense ||
                !formData.vehicleRegistration || !formData.vehiclePhoto
            ) {
                toast.error("Please upload all required documents");
                return;
            }

            const { citizenshipCard, drivingLicense, vehicleRegistration, vehiclePhoto } = formData;

            const data = new FormData();
            data.append("citizenshipCard", citizenshipCard);
            data.append("drivingLicense", drivingLicense);
            data.append("vehicleRegistration", vehicleRegistration);
            data.append("vehiclePhoto", vehiclePhoto);

            data.append("vehicleType", formData.vehicleType);
            data.append("numberPlate", formData.numberPlate);
            data.append("capacityKg", formData.capacityKg);
            data.append("serviceAreas", formData.serviceAreas);

            const res = await fetch("/api/transporter/kyc-submit", {
                method: "POST",
                credentials: "include",
                body: data,
            })

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "KYC submission failed");
            }

            toast.success("KYC submitted successfully");
            router.push("/transporter/profile");

        } catch (err) {
            console.error("KYC submission error:", err);
            toast.error(err instanceof Error ? err.message : "Failed to submit KYC");

        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-[#f5f7fa] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#0a1f39]">
                        KYC Verification
                    </h1>

                    <p className="mt-1 text-sm font-medium text-[#423a3a]">
                        Fill all the fields with valid information
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">

                    <div className="overflow-hidden rounded-2xl border border-[#0b2c54]/10 bg-white shadow-sm">
                        <div className="border-b border-[#0b2c54]/10 bg-[#0a1f39] px-5 py-4">
                            <h2 className="font-bold text-white"> Identity & Legal Documents </h2>

                            <p className="mt-1 text-xs text-[#b0aeae]">
                                Upload valid documents for verification
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <FileUploadField
                                    label="Citizenship Card"
                                    name="citizenshipCard"
                                    formData={formData}
                                    errors={errors}
                                    previews={previews}
                                    changeFileHandler={changeFileHandler}
                                    removeFile={removeFile}
                                />

                                <FileUploadField
                                    label="Driving License"
                                    name="drivingLicense"
                                    formData={formData}
                                    errors={errors}
                                    previews={previews}
                                    changeFileHandler={changeFileHandler}
                                    removeFile={removeFile}
                                />

                                <FileUploadField
                                    label="Vehicle Registration"
                                    name="vehicleRegistration"
                                    formData={formData}
                                    errors={errors}
                                    previews={previews}
                                    changeFileHandler={changeFileHandler}
                                    removeFile={removeFile}
                                />

                                <FileUploadField
                                    label="Vehicle Photo"
                                    name="vehiclePhoto"
                                    formData={formData}
                                    errors={errors}
                                    previews={previews}
                                    changeFileHandler={changeFileHandler}
                                    removeFile={removeFile}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#0b2c54]/10 bg-white shadow-sm">
                        <div className="border-b border-[#0b2c54]/10 px-5 py-4">
                            <h2 className="font-bold text-[#0a1f39]">
                                Vehicle Details
                            </h2>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#0a1f39]">
                                        Vehicle Type
                                    </label>

                                    <select
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        className={`w-full rounded-xl border bg-[#f5f7fa] px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#ee8d39] focus:ring-2 focus:ring-[#ee8d39]/15 ${errors.vehicleType
                                            ? "border-red-300"
                                            : "border-[#0b2c54]/10"
                                            }`}
                                    >
                                        <option value=""> Select Type </option>

                                        {["Bus", "Truck", "Bike", "Car"].map((type) => (
                                            <option key={type} value={type}> {type} </option>
                                        ))}
                                    </select>

                                    {errors.vehicleType && (
                                        <p className="text-[10px] font-medium text-red-500">  {errors.vehicleType} </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#0a1f39]">
                                        Number Plate
                                    </label>

                                    <input
                                        name="numberPlate"
                                        value={formData.numberPlate}
                                        placeholder="BA 1 PA 1234"
                                        onChange={handleChange}
                                        className={`w-full rounded-xl border bg-[#f5f7fa] px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-[#b0aeae] focus:border-[#ee8d39] focus:ring-2 focus:ring-[#ee8d39]/15 ${errors.numberPlate
                                            ? "border-red-300"
                                            : "border-[#0b2c54]/10"
                                            }`}
                                    />

                                    {errors.numberPlate && (
                                        <p className="text-[10px] font-medium text-red-500"> {errors.numberPlate} </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#0a1f39]">
                                        Payload Capacity (KG)
                                    </label>

                                    <input
                                        type="number"
                                        name="capacityKg"
                                        value={formData.capacityKg}
                                        placeholder="e.g. 1500"
                                        onChange={handleChange}
                                        className={`w-full rounded-xl border bg-[#f5f7fa] px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-[#b0aeae] focus:border-[#ee8d39] focus:ring-2 focus:ring-[#ee8d39]/15 ${errors.capacityKg
                                            ? "border-red-300"
                                            : "border-[#0b2c54]/10"
                                            }`}
                                    />

                                    {errors.capacityKg && (
                                        <p className="text-[10px] font-medium text-red-500">
                                            {errors.capacityKg}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="overflow-hidden rounded-2xl border border-[#0b2c54]/10 bg-white shadow-sm">
                        <div className="border-b border-[#0b2c54]/10 px-5 py-4">
                            <h2 className="font-bold text-[#0a1f39]">
                                Service Area
                            </h2>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#0a1f39]">
                                        Service Areas
                                    </label>

                                    <input
                                        name="serviceAreas"
                                        value={formData.serviceAreas}
                                        placeholder="e.g. Kathmandu, Lalitpur, Bhaktapur"
                                        onChange={handleChange}
                                        className={`w-full rounded-xl border bg-[#f5f7fa] px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-[#b0aeae] focus:border-[#ee8d39] focus:ring-2 focus:ring-[#ee8d39]/15 ${errors.serviceAreas
                                            ? "border-red-300"
                                            : "border-[#0b2c54]/10"
                                            }`}
                                    />

                                    {errors.serviceAreas && (
                                        <p className="text-[10px] font-medium text-red-500">
                                            {errors.serviceAreas}
                                        </p>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>


                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("-1")}
                            className="rounded-xl px-7 py-3.5 font-semibold text-[#0b2c54] transition-colors hover:bg-white hover:text-[#ee8d39]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                (user?.isKycDataSubmitted &&
                                    user?.verificationStatus !== "rejected")
                            }
                            className="rounded-xl bg-[#ee8d39] px-10 py-3.5 font-bold text-white shadow-lg shadow-[#ee8d39]/20 transition-all hover:bg-[#f59d50] active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : user?.isVerified &&
                                user?.verificationStatus === "approved" ? (
                                "Already Verified"
                            ) : user?.isKycDataSubmitted &&
                                user?.verificationStatus === "pending" ? (
                                "KYC is Pending"
                            ) : !user?.isKycDataSubmitted &&
                                user?.verificationStatus === "pending" ? (
                                "KYC not Submitted"
                            ) : user?.verificationStatus === "rejected" ? (
                                "Reapply"
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;