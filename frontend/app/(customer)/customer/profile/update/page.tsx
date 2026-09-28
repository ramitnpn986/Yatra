"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, UserRound } from "lucide-react";

const EditProfile = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/passenger/profile", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok) {
                    setName(data.customer?.name || "");

                    if (data.customer?.profileImage?.url) {
                        setPreview(data.customer.profileImage.url);
                    }
                } else {
                    setError(data.message || "Unable to load profile");
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Unable to connect to backend");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = (file: File | null) => {
        setProfileImage(file);
        setError("");
        setMessage("");

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Name cannot be empty");
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append("name", name.trim());

            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const res = await fetch("/api/passenger/profile/update", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage("Profile updated successfully");

                setTimeout(() => {
                    router.push("/customer/profile");
                    router.refresh();
                }, 800);
            } else {
                setError(data.message || "Unable to update profile");
            }
        } catch (err) {
            console.error("Profile update failed:", err);
            setError("Unable to connect to backend");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">

                <div className="mb-6">
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-600">
                        Edit Profile
                    </h1>
                </div>

                {message && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    {/* Profile picture */}
                    <div>
                        <label className="mb-3 block text-xs font-semibold text-gray-500">
                            Profile Picture
                        </label>

                        <div className="flex flex-col items-center gap-4">

                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-100 border border-gray-200">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Profile preview"
                                        width={128}
                                        height={128}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound
                                        size={52}
                                        className="text-gray-300"
                                    />
                                )}
                            </div>

                            <label
                                htmlFor="profile-image"
                                className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                            >
                                <ImagePlus size={18} />
                                {profileImage
                                    ? "Change Picture"
                                    : "Choose Picture"}
                            </label>

                            <input
                                id="profile-image"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) =>
                                    handleImageChange(
                                        e.target.files?.[0] || null
                                    )
                                }
                                className="hidden"
                            />

                            <p className="text-xs text-gray-400">
                                PNG, JPG or WEBP · Maximum 5MB
                            </p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-xs font-semibold text-gray-500"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                                setMessage("");
                            }}
                            disabled={loading}
                            minLength={4}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/customer/profile")
                            }
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || loading}
                            className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;