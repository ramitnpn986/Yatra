"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
    const router = useRouter()

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/transporter/profile", {
                    method: "GET",
                    credentials: "include"
                })

                const data = await res.json()

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

        fetchProfile()

    }, [])

    const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)
        setMessage("")

        try {
            const formData = new FormData()
            formData.append("name", name.trim())

            if (profileImage) {
                formData.append("profileImage", profileImage)
            }

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
            const nextStatus = user.isAvailable
                ? "unavailable"
                : "available"

            const res = await fetch("/api/transporter/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    status: nextStatus
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setMessage(data.message || "Availability update failed")
                return
            }

            setUser((current) =>
                current
                    ? {
                        ...current,
                        isAvailable: data.isAvailable
                    }
                    : current
            )

            setMessage(
                data.message || "Availability updated successfully"
            )

        } catch (err) {
            console.error("Failed to update availability:", err)
            setMessage("Unable to connect to backend")
        } finally {
            setUpdatingAvailability(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex flex-col lg:flex-row">

            <main className="flex-1 p-4 py-8">

                <div className="mx-auto max-w-5xl space-y-6">

                    <section className="rounded-2xl border border-[#0b2c54]/10 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">

                        <div className="flex flex-col md:flex-row items-center gap-8">

                            <div className="relative">

                                <div className="h-28 w-28 rounded-xl overflow-hidden bg-[#f5f7fa] border-4 border-white shadow-lg">

                                    {user?.profileImage?.url ? (
                                        <Image
                                            src={user.profileImage.url}
                                            alt="Profile"
                                            width={112}
                                            height={112}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <div className="h-10 w-10 rounded-full bg-[#0b2c54] flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {user?.name?.charAt(0)?.toUpperCase() || "Y"}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </div>

                            <div className="flex-1 text-center md:text-left">

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">

                                    <h1 className="text-3xl font-black text-[#0a1f39]">
                                        {user?.name}
                                    </h1>

                                    <span className="px-3 py-1 rounded-lg bg-[#ee8d39]/10 text-[#ee8d39] text-[10px] font-black uppercase">
                                        {user?.verificationStatus}
                                    </span>

                                </div>

                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/transporter/profile/update")
                                        }
                                        className="rounded-lg bg-[#ee8d39] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#f59d50]"
                                    >
                                        Edit profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={toggleAvailability}
                                        disabled={updatingAvailability}
                                        className={`rounded-lg px-4 py-2 text-sm font-bold text-white transition ${
                                            user?.isAvailable
                                                ? "bg-emerald-600 hover:bg-emerald-700"
                                                : "bg-[#0a1f39] hover:bg-[#0b2c54]"
                                        }`}
                                    >
                                        {updatingAvailability
                                            ? "Updating..."
                                            : user?.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>

                    {message && (
                        <div
                            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                                message.toLowerCase().includes("success")
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="md:col-span-1 space-y-6">

                            <div className="bg-white p-6 rounded-2xl border border-[#0b2c54]/10 shadow-sm">

                                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-6">
                                    Efficiency Profile
                                </p>

                                <div className="space-y-5">

                                    <div className="flex items-center justify-between">

                                        <span className="text-[#6b7280] text-sm">
                                            Rating
                                        </span>

                                        <span className="font-black text-lg flex items-center gap-1 text-[#0a1f39]">
                                            {user?.rating ?? "N/A"}

                                            <Star
                                                size={16}
                                                className="fill-amber-400 text-amber-400"
                                            />
                                        </span>

                                    </div>

                                    <div className="h-px bg-[#0b2c54]/10" />

                                    <div className="flex items-center justify-between">

                                        <span className="text-[#6b7280] text-sm">
                                            Completed Jobs
                                        </span>

                                        <span className="font-black text-lg text-[#0a1f39]">
                                            {user?.totalDeliveries ?? 0}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <div className="bg-[#0a1f39] p-6 rounded-2xl text-white shadow-xl">

                                <p className="text-[14px] font-bold text-[#ee8d39] mb-2">
                                    Service area
                                </p>

                                <p className="text-[#b0aeae] font-medium text-lg italic">
                                    {user?.location?.address || "Not set"}
                                </p>

                            </div>

                        </div>
   
                        <div className="md:col-span-2 space-y-6">

                            <div className="bg-white p-6 rounded-2xl border border-[#0b2c54]/10 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8">

                             
                                <div className="space-y-6">

                                    <h3 className="text-sm font-black text-[#0a1f39]">
                                        Vehicle Logistics
                                    </h3>

                                    <div className="space-y-4">

                                        <div>
                                            <p className="text-[12px] font-bold text-[#6b7280] mb-1">
                                                Vehicle Type
                                            </p>

                                            <div className="font-bold text-[#0a1f39]">
                                                {user?.vehicle?.type || "Not set"}
                                            </div>
                                        </div>


                                        <div>
                                            <p className="text-[12px] font-bold text-[#6b7280] mb-1">
                                                Number Plate
                                            </p>

                                            <div className="font-bold text-[#0a1f39]">
                                                {user?.vehicle?.numberPlate || "Not set"}
                                            </div>
                                        </div>


                                        <div>
                                            <p className="text-[12px] font-bold text-[#6b7280] mb-1">
                                                Payload Capacity
                                            </p>

                                            <div className="font-bold text-[#0a1f39]">
                                                {user?.vehicle?.capacityKg != null
                                                    ? `${user.vehicle.capacityKg} KG`
                                                    : "Not set"}
                                            </div>
                                        </div>


                                        <div className="pt-2">

                                            <p className="text-[14px] font-bold text-[#6b7280]">
                                                Pricing
                                            </p>

                                            <p className="text-2xl font-black text-[#ee8d39]">
                                                Rs. {user?.pricePerKm ?? "N/A"}
                                            </p>

                                            <p className="text-xs text-[#6b7280] font-medium">
                                                Standard rate per Kilometer
                                            </p>

                                        </div>

                                    </div>

                                </div>


                           
                                <div className="space-y-2">

                                    <h3 className="text-sm font-black text-[#0a1f39]">
                                        Contact Details
                                    </h3>

                                    <div className="space-y-5">

                                        <div>

                                            <p className="text-[12px] font-bold text-[#6b7280] mb-1">
                                                Phone
                                            </p>

                                            <div className="font-bold text-[#0a1f39]">
                                                {user?.phone || "Not set"}
                                            </div>

                                        </div>


                                        <div className="pt-2">

                                            <p className="text-[12px] font-bold text-[#6b7280] mb-2">
                                                Active Service Zones
                                            </p>

                                            <div className="flex flex-wrap gap-2">

                                                {user?.serviceAreas?.length ? (
                                                    user.serviceAreas.map(area => (
                                                        <span
                                                            key={area}
                                                            className="px-3 py-1.5 bg-[#f5f7fa] border border-[#0b2c54]/10 rounded-lg text-[10px] font-bold text-[#0a1f39]"
                                                        >
                                                            {area}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-[#6b7280]">
                                                        No service zones set
                                                    </span>
                                                )}

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

const NavButton = ({
    icon,
    label,
    onClick,
    active = false
}: NavButtonProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded transition-all ${
            active
                ? "bg-[#ee8d39] text-white"
                : "text-[#b0aeae] hover:bg-[#0b2c54] hover:text-white"
        }`}
    >
        <div className="flex items-center gap-3">

            <span
                className={
                    active
                        ? "text-white"
                        : "text-[#b0aeae]"
                }
            >
                {icon}
            </span>

            <span className="text-sm font-bold">
                {label}
            </span>

        </div>
    </button>
)