"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImagePlus, UserRound } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const ProfileUpdatePage = () => {
    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    const [errName, setNameError] = useState("");
    const [errProfile, setProfileError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch("/api/transporter/profile", {
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    setName(data.transporter?.name || "");

                    if (data.transporter?.profileImage?.url) {
                        setPreview(data.transporter.profileImage.url);
                    }
                } else {
                    toast.info(data.message || "Unable to load profile");
                }
            } catch {
                toast.error("Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    const handleImageChange = (file: File | null) => {
        setProfileImage(file);
        setProfileError("");
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    const validateForm = () => {
        let isValid = true;
        setNameError("");
        setProfileError("");

        const trimmedName = name.trim();

        if (!trimmedName) {
            setNameError("Name is required");
            isValid = false;
        } else if (trimmedName.length < 3) {
            setNameError("Name must contain at least 3 characters");
            isValid = false;
        } else if (trimmedName.length > 50) {
            setNameError("Name must not exceed 50 characters");
            isValid = false;
        } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(trimmedName)) {
            setNameError("Name must contain letters only");
            isValid = false;
        }

        if (profileImage) {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];

            if (!allowedTypes.includes(profileImage.type)) {
                setProfileError("Only JPEG, PNG, and WebP images are allowed");
                isValid = false;
            } else if (profileImage.size > 2 * 1024 * 1024) {
                setProfileError("Image size must not exceed 2 MB");
                isValid = false;
            }
        }

        return isValid;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

        setSaving(true);

        try {
            const formData = new FormData();
            formData.append("name", name.trim());

            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const response = await fetch("/api/transporter/edit", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Profile updated successfully");
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch {
            toast.error("Unable to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-[#f5f7fa]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0b2c54]/10 border-t-[#ee8d39]" />
                    <p className="text-sm font-semibold text-[#6b7280]">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#f5f7fa] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-3xl border border-[#0b2c54]/10 bg-white shadow-sm">
                    <div className="border-b border-[#0b2c54]/10 bg-[#0a1f39] px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-3">
                            <UserRound size={22} className="text-[#ee8d39]" />
                            <h2 className="font-bold text-white">  Personal Information </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8 p-6 sm:p-8">
                            <div>
                                <label className="mb-4 block text-sm font-bold text-[#0a1f39]">
                                    Profile photo
                                </label>

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#f5f7fa] shadow-sm">
                                        {preview ? (
                                            <Image
                                                src={preview}
                                                alt="Profile preview"
                                                width={80}
                                                height={80}
                                                className="h-20 w-20 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserRound size={48} className="text-slate-300" />
                                        )}
                                    </div>

                                    <label
                                        htmlFor="profile-image"
                                        className="flex min-h-28 flex-1 cursor-pointer items-center rounded-2xl border border-[#0b2c54]/10 bg-[#f5f7fa] px-5 transition hover:border-[#ee8d39]/40 hover:bg-[#ee8d39]/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0b2c54] shadow-sm transition hover:text-[#ee8d39]">
                                                <ImagePlus size={21} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-[#0a1f39]">
                                                    {profileImage ? profileImage.name : "Choose a profile photo"}
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-[#b0aeae]">
                                                    PNG, JPG or WEBP
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            id="profile-image"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>


                                {errProfile && (<p className="mt-2 text-xs font-semibold text-red-600">  {errProfile} </p>)}
                            </div>


                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-bold text-[#0a1f39]">
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                        setNameError("");
                                    }}
                                    placeholder="Enter your full name"
                                    className={`w-full rounded-xl border bg-white p-3 text-sm font-medium text-[#1f2937] outline-none transition placeholder:text-[#b0aeae] focus:ring-2 ${errName
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-[#0b2c54]/15 focus:border-[#ee8d39] focus:ring-[#ee8d39]/10"
                                        }`}
                                />


                                {errName && (<p className="mt-2 text-xs font-semibold text-red-600"> {errName} </p>)}
                            </div>

                        </div>

                        <div className="flex items-center justify-end border-t border-[#0b2c54]/10 p-4 sm:p-6 lg:p-8">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#ee8d39] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#f59d50] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving? "Saving changes...": "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdatePage;