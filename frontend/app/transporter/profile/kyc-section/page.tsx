"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type FileField= "citizenshipCard" | "drivingLicense"  | "vehicleRegistration"| "vehiclePhoto";

const Page = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    citizenshipCard: null,
    drivingLicense: null,
    vehicleRegistration: null,
    vehiclePhoto: null,
    vehicleType: "",
    numberPlate: "",
    capacityKg: "",
    serviceAreas: "",
    pricePerKm: "",
  });

  const [previews, setPreviews] = useState<Record<FileField, string | null>>({
    citizenshipCard: null,
    drivingLicense: null,
    vehicleRegistration: null,
    vehiclePhoto: null
  });

  const validateField = (name, value) => {
    let error = "";

    switch (name) {

    }

  }

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
      setErrors((prev) => ({ ...prev, [fieldName]: "Only JPG, PNG or PDF allowed" }));
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [fieldName]: "File exceeds 3MB limit" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [fieldName]: file }));

    setPreviews((prev) => ({
      ...prev, [fieldName]: file.type.startsWith("image/") ? URL.createObjectURL(file) : "pdf-placeholder",
    }));

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const removeFile = (fieldName: string) => {
    const preview = previews[fieldName];

    if (preview && preview !== "pdf-placeholder") {
      URL.revokeObjectURL(preview);
    }

    setFormData((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }))
  }




  const handleSubmit = async () => {

  }

  return (
    <div className='min-h-screen bg-white py-6 px-4'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='my-4 text-gray-600 text-3xl font-semibold'>Kyc Verification</h1>

        <form onSubmit={handleSubmit} className='py-8'>
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 ">
              <h2 className="text-xl font-bold text-slate-800">Identity & Legal Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FileUploadField label="Citizenship Card" name="citizenshipCard" />
              <FileUploadField label="Driving License" name="drivingLicense" />
              <FileUploadField label="Vehicle Registration" name="vehicleRegistration" />
              <FileUploadField label="Vehicle Photo" name="vehiclePhoto" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm ">
            <div className="flex items-center gap-3 mb-8 pb-2 ">
              <h2 className="text-xl font-bold text-slate-800">Vehicle Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.vehicleType ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                >
                  <option value="">Select Type</option>
                  {["Bus", "Truck", "Bike", "Car"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.vehicleType && <p className="text-red-500 text-[10px] font-medium">{errors.vehicleType}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Number Plate</label>
                <input
                  name="numberPlate"
                  value={formData.numberPlate}
                  placeholder="BA 1 PA 1234"
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.numberPlate ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                />
                {errors.numberPlate && <p className="text-red-500 text-[10px] font-medium">{errors.numberPlate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Payload Capacity (KG)</label>
                <input
                  type="number"
                  name="capacityKg"
                  value={formData.capacityKg}
                  placeholder="e.g. 1500"
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.capacityKg ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                />
                {errors.capacityKg && <p className="text-red-500 text-[10px] font-medium">{errors.capacityKg}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm ">
            <div className="flex items-center gap-3 mb-8 pb-2 ">
              <h2 className="text-xl font-bold text-slate-800">Service Area</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Service Areas</label>
                <input
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  placeholder="e.g. Kathmandu, Lalitpur, Bhaktapur"
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${errors.serviceAreas ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                />
                {errors.serviceAreas && <p className="text-red-500 text-[10px] font-medium">{errors.serviceAreas}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Price/km</label>
                <div className="relative">
                  <input
                    type="number"
                    name="pricePerKm"
                    value={formData.pricePerKm}
                    placeholder="50"
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border ${errors.pricePerKm ? 'border-red-300' : 'border-slate-200'} rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium ">Rs.</span>
                </div>
                {errors.pricePerKm && <p className="text-red-500 text-[10px] font-medium">{errors.pricePerKm}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={() => router.push("-1")} className="px-8 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || (user?.isVerified && user?.verificationStatus === "approved")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-12 py-3.5 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
            >
              {loading ? (
                <>Processing... </>
              ) : user?.isVerified && user?.verificationStatus === "approved" ? (
                "Already Verified"
              ) : user?.isKycDataSubmitted && user?.verificationStatus === "pending" ? (
                "KYC is Pending"
              ) : !user?.isKycDataSubmitted && user?.verificationStatus === "pending" ? ("KYC not Submitted") : user?.verificationStatus === "rejected" ? ("Reapply") : ("Submit Application")}
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}

export default Page