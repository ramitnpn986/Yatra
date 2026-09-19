"use client"
import { useEffect, useState } from "react";
import Link from "next/link";

interface Provider {
  _id: string;
  name: string;
  phone: string;
  vehicle: string;
  isKycCompleted: boolean;
  isKycDataSubmitted: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  verificationStatus: "pending" | "approved" | "rejected"
}

export default function AdminProviders() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    const handlePendingKyc = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard/transport-providers", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        })

        const data = await res.json();
        if (data.success) {
          setProviders(data.transporters);
        }
      } catch (err) {
        console.log("Failed to fetch pending kyc: ", err)
      } finally {
        setLoading(false)
      }
    }

    handlePendingKyc();

  }, [])

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-8"> Transport Providers </h1>
      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">KYC status</th>
                <th className="py-3 px-2">Account</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Loading transport providers...</td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No transport providers found.</td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.phone} className="border-b border-gray-100">
                    <td className="py-3 px-2 text-gray-900">{provider.name}</td>
                    <td className="py-3 px-2 text-gray-900">{provider.phone}</td>
                    <td className="py-3 px-2 text-gray-900">{provider.vehicle || "N/A"}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${provider.verificationStatus === "approved"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                          }`}
                      >
                        {provider.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${provider.isBlocked ? "bg-error/20 text-error" : "bg-success/20 text-success"
                          }`}
                      >
                        {provider.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-2 flex flex-wrap gap-2">
                      <Link
                        href={`/en/admin/dashboard/providers/${provider._id}`}
                        className="bg-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-dark transition"
                      >
                        View
                      </Link>
                      {provider.verificationStatus === "pending" && (
                        <>
                          <button className="bg-accent text-white px-3 py-1 rounded-lg text-sm hover:bg-accent-dark transition">
                            Verify
                          </button>
                          <button className="bg-error text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition">
                            Reject
                          </button>
                        </>
                      )}
                      <button className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition">
                        {provider.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button className="border border-error text-error px-3 py-1 rounded-lg text-sm hover:bg-error/10 transition">
                        Delete
                      </button>
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