"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  isBlocked: boolean;
}

export default function AdminCustomers() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const handleStats = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/dashboard/customer", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setCustomers(data.customers);
        }
      } catch (err) {
        console.log("Failed to fetch dashboard stats: ", err);
      } finally {
        setLoading(false);
      }
    };

    handleStats();
  }, []);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
          Management
        </p>

        <h1 className="text-3xl font-black text-[#0F172A]">
          Customers
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage registered Yatra customers and their account status.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-[#0F172A]">
            Customer Accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage customer accounts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.phone}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {customer.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.phone}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          customer.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {customer.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/dashboard/customers/${customer._id}`}
                          className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b2c54]"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F172A] hover:bg-slate-50"
                        >
                          {customer.isBlocked ? "Unblock" : "Block"}
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