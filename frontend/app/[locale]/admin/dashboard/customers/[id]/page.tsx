export default function CustomerDetail(){
    const customer={
        name:"Anita Sharma",
        phone:"9841234567",
        isBlocked:false,
    };
    return(
         <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-2">{customer.name}</h1>
      <p className="text-gray-600 mb-6">{customer.phone}</p>

      <div className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Account status</h2>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
            customer.isBlocked ? "bg-error/20 text-error" : "bg-success/20 text-success"
          }`}
        >
          {customer.isBlocked ? "Blocked" : "Active"}
        </span>
        <div>
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
              customer.isBlocked ? "bg-success hover:opacity-90" : "bg-error hover:opacity-90"
            }`}
          >
            {customer.isBlocked ? "Unblock customer" : "Block customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

    