export default function TransporterDashboard() {
  const stats = [
    { label: "Today's Earnings", value: "Rs. 2,450" },
    { label: "Completed Rides", value: 18 },
    { label: "Vehicle Status", value: "Active" },
    { label: "Rating", value: "4.8 ★" },
  ];

  const rideRequests = [
    { customer: "Anita Sharma", pickup: "Baneshwor", drop: "Thamel", status: "Pending" },
    { customer: "Prakash KC", pickup: "Koteshwor", drop: "Patan", status: "Pending" },
    { customer: "Sunita Magar", pickup: "Balaju", drop: "Airport", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-8">Transporter Dashboard</h1>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6 text-center"
          >
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

  
      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Incoming Ride Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Pickup</th>
                <th className="py-3 px-2">Drop</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rideRequests.map((ride) => (
                <tr key={ride.customer} className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-900">{ride.customer}</td>
                  <td className="py-3 px-2 text-gray-900">{ride.pickup}</td>
                  <td className="py-3 px-2 text-gray-900">{ride.drop}</td>
                  <td className="py-3 px-2">
                    <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-semibold">
                      {ride.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <button className="bg-success text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition">
                      Accept
                    </button>
                    <button className="bg-error text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition">
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