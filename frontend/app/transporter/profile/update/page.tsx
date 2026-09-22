
"use client";

import { FormEvent, useEffect, useState } from "react";
import { Camera, CheckCircle2, ImagePlus, Save, UserRound } from "lucide-react";
import Image from "next/image";

const ProfileUpdatePage = () => {
    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

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
                    setMessage(data.message || "Unable to load profile");
                }
            } catch {
                setMessage("Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleImageChange = (file: File | null) => {
        setProfileImage(file);
        setSuccess(false);
        setMessage("");

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append("name", name);
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const response = await fetch("/api/transporter/profile", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setMessage(data.message || "Profile updated successfully");
            } else {
                setMessage(data.message || "Update failed");
            }
        } catch {
            setMessage("Unable to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
                    <p className="text-sm font-semibold text-slate-500"> Loading profile... </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-3">
                            <UserRound size={22} className="text-gray-700" />
                            <h2 className="font-bold text-slate-900"> Personal Information </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8 p-6 sm:p-8">
                            <div>
                                <label className="mb-4 block text-sm font-bold text-slate-700"> Profile photo  </label>
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                                        {preview ? (
                                            <Image src={preview} alt="Profile preview" className="h-full w-full object-cover" />
                                        ) : (<UserRound size={48} className="text-slate-300" />)}
                                    </div>

                                    <div className="flex min-h-28 flex-1 items-center rounded-2xl  border-slate-200 bg-slate-50 px-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11  items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:text-orange-600">
                                                <ImagePlus size={21} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700"> {profileImage ? profileImage.name : "Choose a profile photo"} </p>
                                                <p className="mt-1 text-xs leading-5 text-slate-400"> PNG, JPG or WEBP </p>
                                            </div>
                                        </div>

                                        <input type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700"> Full name </label>
                                <input id="name" value={name} onChange={(event) => { setName(event.target.value); setSuccess(false); setMessage(""); }}
                                    minLength={4}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl p-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500  bg-orange-100"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end items-center m-4 sm:6 lg:8">
                            <button type="submit" disabled={saving} className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold hover:bg-orange-700  disabled:opacity-60">
                                {saving ? "Saving changes..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdatePage;


