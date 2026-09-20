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
  const [customers, setCustomers] = useState<Customer[]>([])


  useEffect(() => {

    const handleStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard/customer", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        })

        const data = await res.json();
        if (data.success) {
          setCustomers(data.customers);
        }

      } catch (err) {
        console.log("Failed to fetch dashboard stats: ", err)
      } finally {
        setLoading(false);
      }
    };

    handleStats();
  }, [])


  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-8 ">Customers </h1>
      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">Account</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500"> Loading customers ... </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500"> No transport customers found. </td>
                </tr>
              ) :
              (
                customers.map((customer) => (
                  <tr key={customer.phone} className="border-b border-gray-100">
                    <td className="py-3 px-2 text-gray-900">{customer.name}</td>
                    <td className="py-3 px-2 text-gray-900">{customer.phone}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.isBlocked ? "bg-error/20 text-error" : "bg-success/20 text-success"}`}>
                        {customer.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      <Link
                        href={`/en/admin/dashboard/customers/${customer._id}`}
                        className="bg-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-dark transition"
                      >
                        View
                      </Link>
                      <button className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition">
                        {customer.isBlocked ? "Unblock" : "Block"}
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