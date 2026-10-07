"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Vehicle {
  _id: string;
  vehicleType: "Bike" | "Car" | "Truck" | "Bus";
  brand: string;
  model: string;
  numberPlate: string;
  images?: string[];
  registrationDocument?: string;
  seats?: number;
  capacityKg?: number;
  year?: number;
  isAvailable: boolean;
  rentalAvailable: boolean;
}

interface Provider {
  _id: string;
  name: string;
  phone: string;
  transporterRole: "rider" | "booking-partner";
  vehicles: Vehicle[];
  isKycCompleted: boolean;
  isKycDataSubmitted: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
}

export default function AdminProviders() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);

  const updateKyc = async (providerId: string, action: "verify-kyc" | "reject-kyc") => {
    try {
      const response = await fetch(
        `/api/admin/dashboard/transport-providers/${providerId}?action=${action}`,
        { method: "PATCH", credentials: "include" },
      );
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "KYC update failed");
      setProviders((current) => current.map((provider) => provider._id === providerId
        ? { ...provider, verificationStatus: action === "verify-kyc" ? "approved" : "rejected", isVerified: action === "verify-kyc" }
        : provider));
      toast.success(action === "verify-kyc" ? "KYC approved" : "KYC rejected");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "KYC update failed");
    }
  };

  useEffect(() => {
    const handlePendingKyc = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/dashboard/transport-providers", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setProviders(data.transporters);
        }
      } catch (err) {
        console.log("Failed to fetch pending kyc: ", err);
      } finally {
        setLoading(false);
      }
    };

    handlePendingKyc();
  }, []);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
          Management
        </p>

        <h1 className="text-3xl font-black text-[#0F172A]">
          Transport Providers
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage transport providers, verification status, and accounts.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-[#0F172A]">
            Provider Accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review provider information and account status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    Loading transport providers...
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No transport providers found.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr
                    key={provider.phone}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {provider.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {provider.phone}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                     {provider.vehicles[0]?.vehicleType || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${provider.verificationStatus === "approved"
                            ? "bg-green-50 text-green-600"
                            : provider.verificationStatus === "rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                      >
                        {provider.verificationStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${provider.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                          }`}
                      >
                        {provider.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/dashboard/providers/${provider._id}`}
                          className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b2c54]"
                        >
                          View
                        </Link>

                        {provider.verificationStatus === "pending" && provider.isKycDataSubmitted && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateKyc(provider._id, "verify-kyc")}
                              className="rounded-lg bg-[#ee8d39] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#EA7C28]"
                            >
                              Verify
                            </button>

                            <button
                              type="button"
                              onClick={() => updateKyc(provider._id, "reject-kyc")}
                              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {provider.verificationStatus === "pending" && !provider.isKycDataSubmitted && (
                          <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                            KYC not submitted
                          </span>
                        )}

                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F172A] hover:bg-slate-50"
                        >
                          {provider.isBlocked ? "Unblock" : "Block"}
                        </button>

                        <button
                          type="button"
                          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}