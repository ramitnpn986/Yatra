"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
    const router = useRouter();

    const [name, setName] = useState("");
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

            const res = await fetch("/api/passenger/profile/update", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage("Profile updated successfully");
                setTimeout(() => router.push("/customer/profile"), 800);
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
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-600">Edit Profile</h1>
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
                    className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
                        />
                    </div>

                    <p className="text-xs text-gray-400">
                        Only your name can be edited here for now.
                    </p>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/customer/profile")}
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