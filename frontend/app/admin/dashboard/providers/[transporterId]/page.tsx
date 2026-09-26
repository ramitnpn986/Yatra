"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Transporter {
  _id: string;
  name: string;
  phone: string;
  role: "rider" | "booking-partner";
  profileImage?: {
    url?: string;
    public_id?: string;
  };
  location?: {
    type?: "Point";
    coordinates?: number[];
    address?: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  };
  isVerified: boolean;
  isKycCompleted: boolean;
  isKycDataSubmitted: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  verifiedAt?: string;
  documents?: {
    citizenshipCard?: string;
    drivingLicense?: string;
    vehicleRegistration?: string;
  };
  vehicle?: {
    type?: "Bike" | "Car" | "Truck" | "Bus";
    vehiclePhoto?: string;
    numberPlate?: string;
    capacityKg?: number;
  };
  serviceAreas?: string[];
  pricePerKm?: number;
  currentLocation?: {
    type?: "Point";
    coordinates?: number[];
    lastUpdatedAt?: string;
  };
  isAvailable: boolean;
  isBlocked: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProviderDetail() {
  const params = useParams();
  const transporterId = params.transporterId as string;

  const [transporter, setTransporter] = useState<Transporter | null>(null);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!transporterId) return;

    async function loadTransporter() {
      try {
        setLoading(true);

        const res = await fetch(`/api/admin/dashboard/transport-providers/${transporterId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load transporter details.");
        }

        setTransporter(data.transporter);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTransporter();
  }, [transporterId]);

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    if (!transporter) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/dashboard/transport-providers/${transporter._id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setTransporter((prev) =>
        prev
          ? {
            ...prev,
            verificationStatus: status,
            isVerified: status === "approved",
          }
          : null
      );
    } catch (err) {
      alert("Error updating verification status");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          Fetching transporter details...
        </div>
      </div>
    );
  }



  if (!transporter) {
    return (
      <div className="max-w-4xl mx-auto m-6 p-8 text-center bg-white border rounded-lg text-slate-500 text-sm">
        No provider record found for ID: {transporterId}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className=" rounded-xl  p-6 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                {transporter.profileImage?.url ? (
                  <Image
                    src={transporter.profileImage.url}
                    alt={transporter.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-400">
                    {transporter.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{transporter.name}</h1>
                <p className="text-sm font-medium text-slate-500 capitalize">
                  {transporter.role === "booking-partner" ? "Booking Partner" : "Rider"}

                </p>
                <p className="text-xs text-slate-500">
                  ID -  {transporter._id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {transporter.isBlocked ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  Blocked
                </span>
              ) : (
                <span className="px-3 py-2 rounded text-xs font-semibold bg-emerald-100 text-emerald-600 ">
                  Active Account
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Availability</span>
              <span className={`font-semibold ${transporter.isAvailable ? "text-emerald-600" : "text-slate-600"}`}>
                {transporter.isAvailable ? "Online / Available" : "Offline"}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">KYC Submission</span>
              <span className="font-semibold text-slate-700">
                {transporter.isKycCompleted
                  ? "Verified & Complete"
                  : transporter.isKycDataSubmitted
                    ? "Pending Review"
                    : "Not Submitted"}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Approval Status</span>
              <span
                className={`font-semibold capitalize ${transporter.verificationStatus === "approved"
                    ? "text-emerald-600"
                    : transporter.verificationStatus === "rejected"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
              >
                {transporter.verificationStatus}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Base Rate</span>
              <span className="font-semibold text-slate-800">
                {transporter.pricePerKm !== undefined ? `Rs. ${transporter.pricePerKm}/km` : "Not set"}
              </span>
            </div>
          </div>
        </div>


        <div className=" rounded-xl  p-6 ">
          <h2 className="text-base font-bold text-slate-900  pb-3 mb-4">Basic Information</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Full Name</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{transporter.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Phone Number</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{transporter.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Account Type</dt>
              <dd className="font-medium text-slate-800 mt-0.5 capitalize">{transporter.role}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Verified On</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{formatDate(transporter.verifiedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Registration Date</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{formatDate(transporter.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Last Profile Update</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{formatDate(transporter.updatedAt)}</dd>
            </div>
          </dl>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl  p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 pb-3 mb-4">Registered Location</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Address / Street</dt>
                <dd className="font-medium text-slate-800">{transporter.location?.address || "—"}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-slate-500">District</dt>
                  <dd className="font-medium text-slate-800">{transporter.location?.district || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Province</dt>
                  <dd className="font-medium text-slate-800">{transporter.location?.province || "—"}</dd>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-slate-500">Municipality</dt>
                  <dd className="font-medium text-slate-800">{transporter.location?.municipality || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Ward</dt>
                  <dd className="font-medium text-slate-800">{transporter.location?.ward || "—"}</dd>
                </div>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Coordinates [Lng, Lat]</dt>
                <dd className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                  {transporter.location?.coordinates?.length
                    ? transporter.location.coordinates.join(", ")
                    : "No coordinates recorded"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900  pb-3 mb-4">Live GPS Signal</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Signal Type</dt>
                <dd className="font-medium text-slate-800">{transporter.currentLocation?.type || "Point"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Last Pinged At</dt>
                <dd className="font-medium text-slate-800">
                  {formatDate(transporter.currentLocation?.lastUpdatedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Coordinates [Lng, Lat]</dt>
                <dd className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                  {transporter.currentLocation?.coordinates?.length
                    ? transporter.currentLocation.coordinates.join(", ")
                    : "No active GPS payload"}
                </dd>
              </div>
            </dl>
          </div>
        </div>


        <div className=" rounded-xl  p-6">
          <h2 className="text-base font-bold text-slate-900  pb-3 mb-4">Vehicle Specs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 text-sm col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-slate-500">Vehicle Type</dt>
                  <dd className="font-medium text-slate-800">{transporter.vehicle?.type || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Plate Number</dt>
                  <dd className="font-medium text-slate-800 uppercase">
                    {transporter.vehicle?.numberPlate || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Load Capacity</dt>
                  <dd className="font-medium text-slate-800">
                    {transporter.vehicle?.capacityKg ? `${transporter.vehicle.capacityKg} kg` : "—"}
                  </dd>
                </div>
              </div>

              <div className="pt-2">
                <dt className="text-xs text-slate-600 mb-1.5">Service Coverage Areas</dt>
                {transporter.serviceAreas && transporter.serviceAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {transporter.serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded border border-slate-200"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No  operating regions listed.</p>
                )}
              </div>
            </div>

            {transporter.vehicle?.vehiclePhoto && (
              <div>
                <dt className="text-xs text-slate-500 mb-1">Vehicle Image</dt>
                <a
                  href={transporter.vehicle.vehiclePhoto}
                  target="_blank"
                  rel="noreferrer"
                  className="block relative h-32 rounded-lg overflow-hidden border border-slate-200 hover:opacity-95 transition-opacity"
                >
                  <Image
                    src={transporter.vehicle.vehiclePhoto}
                    alt="Registered Vehicle"
                    fill
                    className="object-cover"
                  />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className=" rounded-xl  p-6 ">
          <div className="flex items-center justify-between  pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900">Submitted Verification Documents</h2>
            {transporter.verificationStatus === "pending" && transporter.isKycDataSubmitted && (
              <div className="flex gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate("rejected")}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium text-xs rounded-md transition-colors"
                >
                  Reject
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate("approved")}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs rounded-md transition-colors"
                >
                  Approve Verification
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Citizenship Card", url: transporter.documents?.citizenshipCard },
              { title: "Driving License", url: transporter.documents?.drivingLicense },
              { title: "Vehicle Registration (Bluebook)", url: transporter.documents?.vehicleRegistration },
            ].map((doc, i) => (
              <div key={i} className="border rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-700 block mb-2">{doc.title}</span>
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                  >
                    Open Document Link
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">File not uploaded</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}