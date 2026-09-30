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
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                        Security
                    </h1>
                </div>

                {message && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="bg-[#0F172A] px-6 py-6 sm:px-8">
                        <h2 className="text-lg font-bold text-white">
                            Update Credentials
                        </h2>
                       
                    </div>

                    <div className="space-y-5 p-6 sm:p-8">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) =>
                                    setOldPassword(e.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0F172A] focus:bg-white focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0F172A] focus:bg-white focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0F172A] focus:bg-white focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/customer/profile")
                                }
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2c54] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Update Credentials"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChange;