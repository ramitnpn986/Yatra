"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImagePlus, UserRound, UserPen } from "lucide-react";

const AdminProfileUpdatePage = () => {
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
                const response = await fetch("/api/admin/profile", {
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    setName(data.admin?.name || "");

                    if (data.admin?.profileImage?.url) {
                        setPreview(data.admin.profileImage.url);
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

            formData.append("name", name.trim());

            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const response = await fetch("/api/admin/edit", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setMessage(
                    data.message || "Profile updated successfully"
                );
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
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F172A]" />
                    <p className="text-sm font-semibold text-slate-500">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ee8d39]">
                        Account
                    </p>

                    <h1 className="text-3xl font-black text-[#0F172A]">
                        Edit Profile
                    </h1>

                
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-6 text-white sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                <UserPen size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#ee8d39]">
                                    Administrator
                                </p>

                                <h2 className="mt-1 text-lg font-black">
                                    Personal Information
                                </h2>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8 p-6 sm:p-8">
                            <div>
                                <label className="mb-4 block text-sm font-bold text-slate-700">
                                    Profile Photo
                                </label>

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Profile preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <UserRound
                                                size={48}
                                                className="text-slate-300"
                                            />
                                        )}
                                    </div>

                                    <label
                                        htmlFor="profile-image"
                                        className="flex min-h-28 flex-1 cursor-pointer items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 transition hover:border-[#0F172A] hover:bg-slate-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F172A] shadow-sm">
                                                <ImagePlus size={21} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {profileImage
                                                        ? profileImage.name
                                                        : "Choose a profile photo"}
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                                    PNG, JPG or WEBP
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            id="profile-image"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(event) =>
                                                handleImageChange(
                                                    event.target.files?.[0] ||
                                                        null
                                                )
                                            }
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                        setSuccess(false);
                                        setMessage("");
                                    }}
                                    minLength={4}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            {message && (
                                <div
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                                        success
                                            ? "border-green-200 bg-green-50 text-green-700"
                                            : "border-red-200 bg-red-50 text-red-600"
                                    }`}
                                >
                                    {message}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-slate-200 px-6 py-5 sm:px-8">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0b2c54] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving changes..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileUpdatePage;