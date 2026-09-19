"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
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

    const validateInput = ({ oldPassword, newPassword, confirmPassword }: PasswordFields): PasswordErrors => {
        const errors: PasswordErrors = {};
        const strongPassRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

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
        setPasswords((prev) => ({ ...prev, [name as FieldName]: value }));
        if (errors[name as FieldName]) {
            setErrors((prev) => ({ ...prev, [name as FieldName]: "" }));
        }
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
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
                toast.success(res.message || "Password changed successfully");
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
        <div className="min-h-screen text-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-100">

          

            <div className=" w-full max-w-md sm:max-w-lg rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden ">
                <div className="p-6 sm:p-8 md:p-10 lg:12 bg-[#ffffff] ">

                    <h2 className="text-2xl  font-bold mb-8 text-gray-700"> Change Password </h2>

                    <form onSubmit={submitHandler} className="space-y-5">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-[12px] font-bold text-slate-400  mb-2 ml-1">
                                    {field.label}
                                </label>

                                <div className="relative">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={passwords[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className={`w-full  border ${errors[field.name]
                                            ? "border-red-500 ring-1 ring-red-500/20"
                                            : "border-slate-700"
                                            } rounded-xl px-5 py-3.5 outline-none  transition-all text-gray-800 placeholder:text-slate-600`}
                                    />

                                    {field.name === "newPassword" && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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
                                    <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-400">
                                        <AlertCircle size={14} />
                                        <span className="text-xs font-medium">  {errors[field.name]} </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="flex flex-col gap-3 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Update Credentials"}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full text-slate-500 py-2 text-sm font-semibold hover:text-slate-300 transition-colors"
                            >
                                Cancel Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPasswordChange;

