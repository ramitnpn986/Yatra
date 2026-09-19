
"use client";

import { ArrowLeft, Phone, Calendar, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminProfile = () => {
  const router = useRouter();

  const admin = {
    name: "sushil",
    phone: "986777678",
    createdAt: "2024-01-15",
    profileImage: {
      url: "",
    },
  };

  return (
    <div className="min-h-screen text-[#0A0A0A] bg-gray-100 pb-12 pt-6">
      <div className="max-w-5xl mx-auto px-4 flex justify-start items-center">
   
        <div className="bg-[#ffffff] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 pb-10">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <Image src={admin.profileImage.url || "/user.avif"}
                alt="Admin Profile" width={160} height={160}
                className="w-40 h-40 rounded-[2rem] object-cover shadow"
              />

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold  uppercase"> {admin.name} </h2>
              </div>

              <button type="button" onClick={() => router.push("/en/admin/profile/passwordChange")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-700  transition"
              >
                <Edit3 size={14} />
                Update Credentials
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/2 border border-white/5">
                <Phone size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 mb-1"> Phone </p>
                  <p className="text-sm font-bold text-gray-600">
                    {admin.phone || "Not Available"}
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/2 border border-white/5">
                <Calendar size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">  Enlisted Since </p>
                  <p className="text-sm font-bold text-gray-600">
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

