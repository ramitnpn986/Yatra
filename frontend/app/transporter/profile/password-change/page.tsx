"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, AlertCircle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

type PasswordFields = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type PasswordErrors = Partial<Record<keyof PasswordFields, string>>;
type FieldName = keyof PasswordFields;

const Page = () => {
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
            const request = await fetch(
                "/api/transporter/password-change",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        oldPassword: passwords.oldPassword,
                        newPassword: passwords.newPassword,
                    }),
                }
            );

            const res = await request.json();

            if (!request.ok) {
                toast.error(res.message || "Password change failed");
                return;
            }

            if (res.success) {
                toast.success(
                    res.message || "Password changed successfully"
                );

                await fetch("/api/logout", {
                    method: "POST",
                    credentials: "include",
                });

                router.push("/transporter/login");
            }
        } catch (error: unknown) {
            console.error(
                "Transporter password change error:",
                error
            );
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
        <div className="min-h-screen bg-[#f5f7fa] px-4 py-8 flex items-center justify-center">
            <div className="w-full max-w-lg">
                <div className="overflow-hidden rounded-3xl border border-[#0b2c54]/10 bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-[#0a1f39] px-6 py-7 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ee8d39] text-white">
                                <LockKeyhole size={21} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white sm:text-2xl">
                                    Change Password
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        <form
                            onSubmit={submitHandler}
                            className="space-y-5"
                        >
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label className="mb-2 ml-1 block text-sm font-bold text-[#0a1f39]">
                                        {field.label}
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={passwords[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className={`w-full rounded-xl border bg-white px-5 py-3.5 pr-12 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-[#b0aeae] ${
                                                errors[field.name]
                                                    ? "border-red-500 ring-1 ring-red-500/20"
                                                    : "border-[#0b2c54]/15 focus:border-[#ee8d39] focus:ring-2 focus:ring-[#ee8d39]/15"
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
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b0aeae] transition-colors hover:text-[#ee8d39]"
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
                                   className="w-full rounded-xl bg-[#0a1f39] py-3.5 font-bold text-white shadow-lg shadow-[#0a1f39]/20 transition-all hover:bg-[#0b2c54] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Update Credentials"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-[#0b2c54] transition-colors hover:text-[#ee8d39]"
                                >
                                    <ArrowLeft size={16} />
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

export default Page;