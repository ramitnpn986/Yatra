"use client";

import { useEffect, useState } from "react";

interface StatsProps {
  totalCustomers: number;
  totalTransporters: number;
  kycPending: number;
  activeRides: number;
}

interface PendingKyc {
  _id: string;
  name: string;
  phone: number;
  vehicle: {
    type?: string;
  };
  isKycCompleted: boolean;
  isKycDataSubmitted: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsProps>({
    totalCustomers: 0,
    totalTransporters: 0,
    kycPending: 0,
    activeRides: 0,
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
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.log("Failed to fetch dashboard stats: ", err);
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
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setPendingKyc(data.transporters);
        }
      } catch (err) {
        console.log("Failed to fetch pending kyc: ", err);
      } finally {
        setLoadingKyc(false);
      }
    };

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
    <div className="min-h-full bg-slate-50">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
          Overview
        </p>

        <h1 className="text-3xl font-black text-[#0F172A]">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor customers, transport providers, KYC verification, and rides.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-[#0F172A]  p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-400">
              {stat.label}
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl text-white">
                {loadingStat ? "..." : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-[#0F172A]">
            Pending KYC Verifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Transport providers waiting for verification.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loadingKyc ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    Loading pending KYC...
                  </td>
                </tr>
              ) : pendingKyc.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No pending KYC providers
                  </td>
                </tr>
              ) : (
                pendingKyc.map((provider) => (
                  <tr
                    key={provider._id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {provider.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {provider.phone}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {provider.vehicle?.type || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                        Pending
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b2c54]"
                      >
                        Verify
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