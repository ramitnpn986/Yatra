"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PasswordChange = () => {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        try {
            setSaving(true);

            const res = await fetch("/api/passenger/password-change", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage("Password changed successfully");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError(data.message || "Unable to change password");
            }
        } catch (err) {
            console.error("Password change failed:", err);
            setError("Unable to connect to backend");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">
                <div className="mb-6">
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-600">Change Password</h1>
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
                        <label className="mb-1 block text-xs font-semibold text-gray-500">Current Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

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
                            disabled={saving}
                            className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChange;