"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PasswordChange() {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    
    const [saving, setSaving] = useState(false);

    const validateForm = () => {
        let isValid = true;

        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setGeneralError("");

        if (!oldPassword) {
            setOldPasswordError("Current password is required");
            isValid = false;
        }

        if (!newPassword) {
            setNewPasswordError("New password is required");
            isValid = false;
        } else if (newPassword.length < 8) {
            setNewPasswordError("Password must be at least 8 characters long");
            isValid = false;
        } else if (!/[A-Z]/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one capital letter");
            isValid = false;
        } else if (!/\d/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one digit");
            isValid = false;
        } else if (!/[^a-zA-Z0-9\s]/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one special symbol");
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your new password");
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError("New password and confirm password do not match");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSaving(true);
            setGeneralError("");

            const res = await fetch("/api/passenger/password-change", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Password changed successfully!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                router.push("/customer/profile");
            } else {
                setGeneralError(data.message || "Unable to change password");
                toast.error(data.message || "Unable to change password");
            }
        } catch (err) {
            console.error("Password change failed:", err);
            setGeneralError("Unable to connect to backend");
            toast.error("Unable to connect to backend");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6">
                {generalError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
                        {generalError}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <div className="bg-[#0F172A] px-6 py-7 text-white sm:px-8">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-white">Update Credentials</h2>
                                <p className="text-xs text-slate-400">Ensure your account is using a secure password</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6 p-6 sm:p-8">
                            <div>
                                <label className="mb-2 block text-xs font-bold tracking-wide text-slate-700">
                                    Current Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        value={oldPassword}
                                        onChange={(e) => {
                                            setOldPassword(e.target.value);
                                            setOldPasswordError("");
                                        }}
                                        className={`w-full rounded border bg-slate-50/50 py-3.5 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                                            oldPasswordError
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#0F172A] focus:ring-slate-100"
                                        }`}
                                    />
                                </div>
                                {oldPasswordError && ( <p className="mt-1 text-xs font-semibold text-red-500">{oldPasswordError}</p>)}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold  tracking-wide text-slate-700">
                                    New Password
                                </label>
                                <div className="relative flex items-center">
                                
                                    <input
                                        type="password"
                                        placeholder="Min 8 chars, Capital, Number, Symbol"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setNewPasswordError("");
                                        }}
                                        className={`w-full rounded border bg-slate-50/50 py-3.5 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                                            newPasswordError
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#0F172A] focus:ring-slate-100"
                                        }`}
                                    />
                                </div>
                                {newPasswordError && ( <p className="mt-1 text-xs font-semibold text-red-500">{newPasswordError}</p>)}
                            </div>

  
                            <div>
                                <label className="mb-2 block text-xs font-bold  tracking-wide text-slate-700">
                                    Confirm password
                                </label>
                                <div className="relative flex items-center">
                                 
                                    <input
                                        type="password"
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setConfirmPasswordError("");
                                        }}
                                        className={`w-full rounded border bg-slate-50/50 py-3.5 pl-5 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                                            confirmPasswordError
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#0F172A] focus:ring-slate-100"
                                        }`}
                                    />
                                </div>
                                {confirmPasswordError && ( <p className="mt-1 text-xs font-semibold text-red-500">{confirmPasswordError}</p>)}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
                            <button
                                type="button"
                                onClick={() => router.push("/customer/profile")}
                                className="rounded border border-slate-200 bg-white px-5 py-3 text-xs  tracking-wider text-slate-600 shadow-sm transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded bg-[#0F172A] px-6 py-3 text-xs  tracking-wider text-white shadow-sm transition hover:bg-[#1b2a4a] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Updating..." : "Update Credentials"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}