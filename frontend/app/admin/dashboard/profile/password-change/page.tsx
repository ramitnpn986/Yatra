"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

type PasswordFields = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type PasswordErrors = Partial<Record<keyof PasswordFields, string>>;
type FieldName = keyof PasswordFields;

const AdminPasswordChange = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<PasswordErrors>({});
    const [passwords, setPasswords] = useState<PasswordFields>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validateInput = ({
        oldPassword,
        newPassword,
        confirmPassword,
    }: PasswordFields): PasswordErrors => {
        const errors: PasswordErrors = {};
        const strongPassRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!oldPassword.trim()) {
            errors.oldPassword = "Current password is required";
        }

        if (!newPassword.trim()) {
            errors.newPassword = "New password is required";
        } else if (oldPassword === newPassword) {
            errors.newPassword = "Must be different from old password";
        } else if (!strongPassRegex.test(newPassword)) {
            errors.newPassword = "Weak password complexity";
        }

        if (!confirmPassword.trim()) {
            errors.confirmPassword = "Please confirm your password";
        } else if (confirmPassword !== newPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name as FieldName]: value,
        }));

        if (errors[name as FieldName]) {
            setErrors((prev) => ({
                ...prev,
                [name as FieldName]: "",
            }));
        }
    };

    const submitHandler = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (loading) return;

        const validationErrors = validateInput(passwords);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const request = await fetch("/api/admin/password-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            const res = await request.json();

            if (!request.ok) {
                toast.error(res.message || "Password change failed");
                return;
            }

            if (res.success) {
                toast.success(
                    res.message || "Password changed successfully"
                );

                await fetch("/api/admin/logout", {
                    method: "POST",
                    credentials: "include",
                });

                router.push("/admin/login");
            }
        } catch (error: unknown) {
            console.error("Admin password change error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fields: {
        label: string;
        name: FieldName;
        type: string;
        placeholder: string;
    }[] = [
        {
            label: "Current Password",
            name: "oldPassword",
            type: "password",
            placeholder: "••••••••",
        },
        {
            label: "New Password",
            name: "newPassword",
            type: showPassword ? "text" : "password",
            placeholder: "New Secret Key",
        },
        {
            label: "Confirm Password",
            name: "confirmPassword",
            type: "password",
            placeholder: "Repeat Secret Key",
        },
    ];

    return (
        <div className="min-h-full bg-slate-50 px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center">
                <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#0F172A] px-6 py-7 text-white sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                                <LockKeyhole size={22} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#ee8d39]">
                                    Account Security
                                </p>

                                <h1 className="mt-1 text-2xl font-black">
                                    Change Password
                                </h1>
                            </div>
                        </div>

                      
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={submitHandler} className="space-y-5">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                        {field.label}
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={passwords[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 ${
                                                errors[field.name]
                                                    ? "border-red-400 ring-2 ring-red-100"
                                                    : "border-slate-200 focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                                            }`}
                                        />

                                        {field.name === "newPassword" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#0F172A]"
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {errors[field.name] && (
                                        <div className="mt-2 ml-1 flex items-center gap-1.5 text-red-500">
                                            <AlertCircle size={14} />
                                            <span className="text-xs font-medium">
                                                {errors[field.name]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#0F172A] py-3 font-bold text-white shadow-sm transition hover:bg-[#0b2c54] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Update Credentials"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full rounded-xl py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#0F172A]"
                                >
                                    Cancel Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPasswordChange;