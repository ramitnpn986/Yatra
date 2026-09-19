export default function ProviderDetail() {
  const provider = {
    name: "Niten Thapa",
    phone: "9812345678",
    role: "rider",
    verificationStatus: "pending",
    isKycDataSubmitted: true,
    vehicle: {
      type: "Bike",
      numberPlate: "BA 12 PA 3456",
      capacityKg: 20,
      vehiclePhoto: "",
    },
    documents: {
      citizenshipCard: "",
      drivingLicense: "",
      vehicleRegistration: "",
    },
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-2">{provider.name}</h1>
      <p className="text-gray-600 mb-6">{provider.phone} · {provider.role === "rider" ? "Rider" : "Booking Partner"}</p>

      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Vehicle information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Type</div>
            <div className="text-gray-900 font-medium">{provider.vehicle.type}</div>
          </div>
          <div>
            <div className="text-gray-500">Number plate</div>
            <div className="text-gray-900 font-medium">{provider.vehicle.numberPlate}</div>
          </div>
          <div>
            <div className="text-gray-500">Capacity</div>
            <div className="text-gray-900 font-medium">{provider.vehicle.capacityKg} kg</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">KYC documents</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Citizenship card", url: provider.documents.citizenshipCard },
            { label: "Driving license", url: provider.documents.drivingLicense },
            { label: "Vehicle registration", url: provider.documents.vehicleRegistration },
          ].map((doc) => (
            <div key={doc.label} className="border-2 border-gray-200 rounded-lg p-3 text-center">
              <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs mb-2">
                {doc.url ? "Document" : "Not uploaded"}
              </div>
              <div className="text-xs text-gray-600">{doc.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Verification</h2>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
            provider.verificationStatus === "approved"
              ? "bg-success/20 text-success"
              : provider.verificationStatus === "rejected"
              ? "bg-error/20 text-error"
              : "bg-warning/20 text-warning"
          }`}
        >
          {provider.verificationStatus}
        </span>
        {provider.verificationStatus === "pending" && provider.isKycDataSubmitted && (
          <div className="flex gap-3">
            <button className="bg-success text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
              Verify
            </button>
            <button className="bg-error text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}