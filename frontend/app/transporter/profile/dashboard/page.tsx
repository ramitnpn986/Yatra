export default function TransporterDashboard() {
  const stats = [
    { label: "Today's Earnings", value: "Rs. 2,450" },
    { label: "Completed Rides", value: 18 },
    { label: "Vehicle Status", value: "Active" },
    { label: "Rating", value: "4.8 ★" },
  ];

  const rideRequests = [
    {
      customer: "Anita Sharma",
      pickup: "Baneshwor",
      drop: "Thamel",
      status: "Pending",
    },
    {
      customer: "Prakash KC",
      pickup: "Koteshwor",
      drop: "Patan",
      status: "Pending",
    },
    {
      customer: "Sunita Magar",
      pickup: "Balaju",
      drop: "Airport",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-6 md:p-10">
      {/* Page Heading */}
      <h1 className="mb-8 text-3xl font-bold text-[#0a1f39]">
        Transporter Dashboard
      </h1>

      {/* Statistics */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#0b2c54]/10 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-2xl font-bold text-[#ee8d39]">
              {stat.value}
            </div>

            <div className="mt-1 text-sm text-[#6b7280]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ride Requests */}
      <div className="rounded-xl border border-[#0b2c54]/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#0a1f39]">
          Incoming Ride Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#0b2c54]/10 text-sm text-[#6b7280]">
                <th className="px-2 py-3">Customer</th>
                <th className="px-2 py-3">Pickup</th>
                <th className="px-2 py-3">Drop</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {rideRequests.map((ride) => (
                <tr
                  key={ride.customer}
                  className="border-b border-gray-100 transition hover:bg-[#f5f7fa]"
                >
                  <td className="px-2 py-3 text-gray-900">
                    {ride.customer}
                  </td>

                  <td className="px-2 py-3 text-gray-900">
                    {ride.pickup}
                  </td>

                  <td className="px-2 py-3 text-gray-900">
                    {ride.drop}
                  </td>

                  <td className="px-2 py-3">
                    <span className="rounded-full bg-[#ee8d39]/10 px-3 py-1 text-xs font-semibold text-[#ee8d39]">
                      {ride.status}
                    </span>
                  </td>

                  <td className="flex gap-2 px-2 py-3">
                    <button className="rounded-lg bg-[#ee8d39] px-3 py-1 text-sm font-medium text-white transition hover:bg-[#f59d50]">
                      Accept
                    </button>

                    <button className="rounded-lg bg-[#0a1f39] px-3 py-1 text-sm font-medium text-white transition hover:bg-[#0b2c54]">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}