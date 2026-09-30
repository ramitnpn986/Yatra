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

        const res = await fetch(
          `/api/admin/dashboard/transport-providers/${transporterId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message || "Failed to load transporter details."
          );
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

  const handleStatusUpdate = async (
    status: "approved" | "rejected"
  ) => {
    if (!transporter) return;

    try {
      setActionLoading(true);

      const res = await fetch(
        `/api/admin/dashboard/transport-providers/${transporter._id}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0F172A]" />
          Fetching transporter details...
        </div>
      </div>
    );
  }

  if (!transporter) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        No provider record found for ID: {transporterId}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white shadow-sm">
          <div className="flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-slate-700">
                {transporter.profileImage?.url ? (
                  <Image
                    src={transporter.profileImage.url}
                    alt={transporter.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-black text-slate-300">
                    {transporter.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#ee8d39]">
                  Transport Provider
                </p>

                <h1 className="text-2xl font-black">
                  {transporter.name}
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  {transporter.role === "booking-partner"
                    ? "Booking Partner"
                    : "Rider"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  ID - {transporter._id}
                </p>
              </div>
            </div>

            <div>
              {transporter.isBlocked ? (
                <span className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300">
                  Blocked
                </span>
              ) : (
                <span className="inline-flex rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300">
                  Active Account
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white/5 p-4">
              <span className="block text-xs font-semibold text-slate-400">
                Availability
              </span>

              <span
                className={`mt-1 block font-bold ${
                  transporter.isAvailable
                    ? "text-green-400"
                    : "text-slate-300"
                }`}
              >
                {transporter.isAvailable
                  ? "Online / Available"
                  : "Offline"}
              </span>
            </div>

            <div className="rounded-xl bg-white/5 p-4">
              <span className="block text-xs font-semibold text-slate-400">
                KYC Submission
              </span>

              <span className="mt-1 block font-bold text-white">
                {transporter.isKycCompleted
                  ? "Verified & Complete"
                  : transporter.isKycDataSubmitted
                    ? "Pending Review"
                    : "Not Submitted"}
              </span>
            </div>

            <div className="rounded-xl bg-white/5 p-4">
              <span className="block text-xs font-semibold text-slate-400">
                Approval Status
              </span>

              <span
                className={`mt-1 block font-bold capitalize ${
                  transporter.verificationStatus === "approved"
                    ? "text-green-400"
                    : transporter.verificationStatus === "rejected"
                      ? "text-red-400"
                      : "text-[#ee8d39]"
                }`}
              >
                {transporter.verificationStatus}
              </span>
            </div>

            <div className="rounded-xl bg-white/5 p-4">
              <span className="block text-xs font-semibold text-slate-400">
                Base Rate
              </span>

              <span className="mt-1 block font-bold text-white">
                {transporter.pricePerKm !== undefined
                  ? `Rs. ${transporter.pricePerKm}/km`
                  : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 border-b border-slate-200 pb-4 text-lg font-black text-[#0F172A]">
            Basic Information
          </h2>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 text-sm sm:grid-cols-2 md:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Full Name
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {transporter.name || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Phone Number
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {transporter.phone || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Account Type
              </dt>
              <dd className="mt-1 font-semibold capitalize text-slate-800">
                {transporter.role}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Verified On
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {formatDate(transporter.verifiedAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Registration Date
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {formatDate(transporter.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Last Profile Update
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {formatDate(transporter.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 border-b border-slate-200 pb-4 text-lg font-black text-[#0F172A]">
              Registered Location
            </h2>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  Address / Street
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {transporter.location?.address || "—"}
                </dd>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    District
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {transporter.location?.district || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    Province
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {transporter.location?.province || "—"}
                  </dd>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    Municipality
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {transporter.location?.municipality || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    Ward
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {transporter.location?.ward || "—"}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  Coordinates [Lng, Lat]
                </dt>

                <dd className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600">
                  {transporter.location?.coordinates?.length
                    ? transporter.location.coordinates.join(", ")
                    : "No coordinates recorded"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 border-b border-slate-200 pb-4 text-lg font-black text-[#0F172A]">
              Live GPS Signal
            </h2>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  Signal Type
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {transporter.currentLocation?.type || "Point"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  Last Pinged At
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {formatDate(
                    transporter.currentLocation?.lastUpdatedAt
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  Coordinates [Lng, Lat]
                </dt>

                <dd className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600">
                  {transporter.currentLocation?.coordinates?.length
                    ? transporter.currentLocation.coordinates.join(", ")
                    : "No active GPS payload"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 border-b border-slate-200 pb-4 text-lg font-black text-[#0F172A]">
            Vehicle Specifications
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-5 text-sm md:col-span-2">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    Vehicle Type
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {transporter.vehicle?.type || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    Plate Number
                  </dt>
                  <dd className="mt-1 font-semibold uppercase text-slate-800">
                    {transporter.vehicle?.numberPlate || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    Load Capacity
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {transporter.vehicle?.capacityKg
                      ? `${transporter.vehicle.capacityKg} kg`
                      : "—"}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="mb-2 text-xs font-semibold text-slate-500">
                  Service Coverage Areas
                </dt>

                {transporter.serviceAreas &&
                transporter.serviceAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {transporter.serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No operating regions listed.
                  </p>
                )}
              </div>
            </div>

            {transporter.vehicle?.vehiclePhoto && (
              <div>
                <dt className="mb-2 text-xs font-semibold text-slate-500">
                  Vehicle Image
                </dt>

                <a
                  href={transporter.vehicle.vehiclePhoto}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block h-36 overflow-hidden rounded-xl border border-slate-200 transition hover:opacity-90"
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-black text-[#0F172A]">
                Submitted Verification Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the documents submitted by this provider.
              </p>
            </div>

            {transporter.verificationStatus === "pending" &&
              transporter.isKycDataSubmitted && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate("rejected")}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate("approved")}
                    className="rounded-lg bg-[#0F172A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0b2c54] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve Verification
                  </button>
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Citizenship Card",
                url: transporter.documents?.citizenshipCard,
              },
              {
                title: "Driving License",
                url: transporter.documents?.drivingLicense,
              },
              {
                title: "Vehicle Registration (Bluebook)",
                url: transporter.documents?.vehicleRegistration,
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="mb-4 block text-sm font-bold text-slate-700">
                  {doc.title}
                </span>

                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-sm text-[#3e5da7] transition hover:text-[#0F172A]"
                  >
                    Open Document
                  </a>
                ) : (
                  <span className="text-xs italic text-slate-400">
                    File not uploaded
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}