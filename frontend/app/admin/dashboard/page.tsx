"use client"

import { useEffect, useState } from "react";

interface StatsProps {
  totalCustomers: number,
  totalTransporters: number,
  kycPending: number,
  activeRides: number
}

interface PendingKyc {
  _id: string,
  name: string,
  phone: number,
  vehicle?: string,
  isKycCompleted: boolean,
  isKycDataSubmitted: boolean

}

export default function AdminDashboard() {

  const [stats, setStats] = useState<StatsProps>({
    totalCustomers: 0,
    totalTransporters: 0,
    kycPending: 0,
    activeRides: 0
  });

  const [pendingKyc, setPendingKyc] = useState<PendingKyc[]>([]);

  const [loadingStat, setLoadingStat] = useState(false);
  const [loadingKyc, setLoadingKyc] = useState(false);


  useEffect(() => {

    const handleStats = async () => {
      try {
        setLoadingStat(true);
        const res = await fetch("/api/admin/dashboard/stats", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        })

        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }

      } catch (err) {
        console.log("Failed to fetch dashboard stats: ", err)
      } finally {
        setLoadingStat(false);
      }
    };

    const handlePendingKyc = async () => {
      try {
        setLoadingKyc(true);
        const res = await fetch("/api/admin/dashboard/pending-kyc", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        })

        const data = await res.json();
        if (data.success) {
          setPendingKyc(data.transporters);
        }
      } catch (err) {
        console.log("Failed to fetch pending kyc: ", err)
      } finally {
        setLoadingKyc(false)
      }
    }


    handleStats();
    handlePendingKyc();
  }, []);


  const statCards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
    },
    {
      label: "Transport Providers",
      value: stats.totalTransporters,
    },
    {
      label: "Pending KYC",
      value: stats.kycPending,
    },
    {
      label: "Active Rides",
      value: stats.activeRides,
    },
  ];

  return (
    <div className=" p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-primary">{loadingStat ? "..." : stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Pending KYC Verifications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>

              {
                loadingKyc ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500" > Loading pending KYC... </td>
                  </tr>
                ) : pendingKyc.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-gray-500">No Pedning Kyc Providers</td>
                  </tr>
                ) : (

                  pendingKyc.map((provider) => (
                    <tr key={provider._id} className="border-b border-gray-100">
                      <td className="py-3 px-2 text-gray-900">{provider.name}</td>
                      <td className="py-3 px-2 text-gray-900">{provider.phone}</td>
                      <td className="py-3 px-2 text-gray-900">{provider.vehicle || "N/A"}</td>
                      <td className="py-3 px-2">
                        <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button className="bg-accent text-white px-3 py-1 rounded-lg text-sm hover:bg-accent-dark transition">
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}