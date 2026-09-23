"use client"


import { CheckCircle2, Star, Save } from 'lucide-react'
import { User } from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
    name: string;
    phone: string;
    isAvailable: boolean;
    verificationStatus: string;
    profileImage?: {
        url?: string;
        public_id?: string;
    }
    rating?: number;
    totalDeliveries?: number;
    location?: {
        address?: string;
        coordinates?: [number, number];
    }
    vehicle?: {
        type?: string;
        numberPlate?: string;
        capacityKg?: number;
    };
    pricePerKm?: number;
    serviceAreas?: string[];

}

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
}

export default function Page() {

    const [user, setUser] = useState<User>()
    const [name, setName] = useState("")
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [updatingAvailability, setUpdatingAvailability] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/transporter/profile", { method: "GET", credentials: "include" })
                const data = await res.json();
                if (res.ok) {
                    setUser(data.transporter)
                    setName(data.transporter?.name || "")
                } else {
                    setMessage(data.message || "Unable to load profile")
                }
            } catch (err) {
                console.error("Failed to fetch transporter profile:", err)
                setMessage("Unable to connect to backend")
            }
        }

        fetchProfile();

    }, [])

    const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)
        setMessage("")

        try {
            const formData = new FormData()
            formData.append("name", name.trim())
            if (profileImage) formData.append("profileImage", profileImage)

            const res = await fetch("/api/transporter/profile", {
                method: "POST",
                credentials: "include",
                body: formData,
            })
            const data = await res.json()

            if (!res.ok) {
                setMessage(data.message || "Profile update failed")
                return
            }

            setUser(data.transporter)
            setName(data.transporter?.name || name.trim())
            setProfileImage(null)
            setEditing(false)
            setMessage(data.message || "Profile updated successfully")
        } catch (err) {
            console.error("Failed to update transporter profile:", err)
            setMessage("Unable to connect to backend")
        } finally {
            setSaving(false)
        }
    }

    const toggleAvailability = async () => {
        if (!user) return
        setUpdatingAvailability(true)
        setMessage("")

        try {
            const nextStatus = user.isAvailable ? "unavailable" : "available"
            const res = await fetch("/api/transporter/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: nextStatus }),
            })
            const data = await res.json()

            if (!res.ok) {
                setMessage(data.message || "Availability update failed")
                return
            }

            setUser((current) => current ? { ...current, isAvailable: data.isAvailable } : current)
            setMessage(data.message || "Availability updated successfully")
        } catch (err) {
            console.error("Failed to update availability:", err)
            setMessage("Unable to connect to backend")
        } finally {
            setUpdatingAvailability(false)
        }
    }


    return (
        <div className='min-h-screen bg-white flex flex-col lg:flex-row'>

            <main className="flex-1 p-4 py-8">
                <div className="max-w-5xl  space-y-6 ">

                    <section className="rounded-[1.5rem] border border-slate-200 p-2 px-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">

                            <div className="relative">
                                <div className="h-28 w-28 rounded-lg overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                                    {user?.profileImage?.url ? (
                                        <Image
                                            src={user.profileImage.url}
                                            alt="Profile"
                                            width={112}
                                            height={112}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <h1 className="text-3xl font-black text-slate-900">
                                        {user?.name}
                                    </h1>

                                    <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-700 text-[10px] font-black">
                                        {user?.verificationStatus}
                                    </span>
                                </div>

           
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditing((value) => !value)}
                                        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                                    >
                                        {editing ? "Cancel edit" : "Edit profile"}
                                    </button>

                                    <button type="button" onClick={toggleAvailability}  disabled={updatingAvailability}  className={`rounded-lg px-4 py-2 text-sm font-bold text-white ${user?.isAvailable
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-slate-500 hover:bg-slate-600"
                                            }`}
                                    >
                                        {updatingAvailability ? "Updating...": user?.isAvailable? "Available": "Unavailable"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </section>

                    {editing && (
                        <form onSubmit={saveProfile} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                            <h2 className="text-lg font-black text-slate-800">Edit profile</h2>
                            <label className="block text-sm font-bold text-slate-600">
                                Name
                                <input type="text" value={name} onChange={(event) => setName(event.target.value)} minLength={4} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-medium outline-none focus:border-orange-500" />
                            </label>
                            <label className="block text-sm font-bold text-slate-600">
                                Profile image
                                <input type="file" accept="image/*" onChange={(event) => setProfileImage(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
                            </label>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                                <Save size={16} /> {saving ? "Saving..." : "Save changes"}
                            </button>
                        </form>
                    )}
                    {message && <p className="text-sm font-semibold text-slate-600">{message}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400  mb-6">Efficiency Profile</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Rating</span>
                                        <span className="font-black text-lg flex items-center gap-1">{user?.rating ?? "N/A"} <Star size={16} className="fill-amber-400 text-amber-400" /></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Completed Jobs</span>
                                        <span className="font-black text-lg">{user?.totalDeliveries ?? 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-6 rounded text-white shadow-xl shadow-slate-200">
                                <p className="text-[14px] font-bold  text-orange-400 mb-2">Service area</p>
                                <p className="text-slate-300 font-medium text-lg italic"> {user?.location?.address || "Not set"}</p>
                            </div>
                        </div>


                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black  text-slate-800">Vehicle Logistics</h3>
                                    <div className="space-y-3">

                                        <div>
                                            <p className="text-[12px] font-bold text-slate-400  mb-1" >vehicle Type</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700">{user?.vehicle?.type || "Not set"} </div>
                                        </div>

                                        <div>
                                            <p className="text-[12px] font-bold text-slate-400  mb-1" >Number Plate</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700"> {user?.vehicle?.numberPlate || "Not set"} </div>
                                        </div>

                                        <div>
                                            <p className="text-[12px] font-bold text-slate-400  mb-1" >Payload Capacity</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700"> {user?.vehicle?.capacityKg != null ? `${user.vehicle.capacityKg} KG` : "Not set"} </div>
                                        </div>

                                        <p className="text-[14px] font-bold text-slate-500 ">Pricing </p>
                                        <p className="text-2xl font-black text-orange-500">Rs. {user?.pricePerKm ?? "N/A"}</p>
                                        <p className="text-xs text-slate-400 font-medium">Standard rate per Kilometer</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black  text-slate-800">Contact Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-400  mb-1" >Phone </p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700">  {user?.phone || "Not set"} </div>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-[12px] font-bold text-slate-400  mb-2">Active Service Zones</p>
                                            <div className="flex flex-wrap gap-2">
                                                {user?.serviceAreas?.map(area => (
                                                    <span key={area} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600">{area}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

        </div>
    )
}







const NavButton = ({ icon, label, onClick, active = false }: NavButtonProps) => (
    <button onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded transition-all  ${active ? 'bg-orange-50 text-orange-700'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
    >
        <div className="flex items-center gap-3">
            <span className={`${active ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
            <span className="text-sm font-bold">{label}</span>
        </div>
    </button>
);




