
"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Car, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface TransporterVehicle {
    _id: string;
    vehicleType: "Bike" | "Car" | "Truck" | "Bus";
    brand: string;
    model: string;
    numberPlate: string;
    images?: string[];
    seats?: number;
    capacityKg?: number;
    year?: number;
    isAvailable: boolean;
    rentalAvailable: boolean;
}

interface VehicleForm {
    vehicleType: string;
    brand: string;
    model: string;
    numberPlate: string;
    seats: string;
    year: string;
    capacityKg: string;
}

const EMPTY_FORM: VehicleForm = {
    vehicleType: "Car",
    brand: "",
    model: "",
    numberPlate: "",
    seats: "",
    year: "",
    capacityKg: "",
};

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-[#ee8d39] disabled:bg-slate-100 disabled:text-slate-400";

export default function TransporterVehiclesPage() {
    const [vehicles, setVehicles] = useState<TransporterVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<VehicleForm>(EMPTY_FORM);
    const [photo, setPhoto] = useState<File | null>(null);
    const [registration, setRegistration] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const loadVehicles = async () => {
        try {
            const res = await fetch("/api/transporter/vehicles", {
                credentials: "include",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to load vehicles");
            }

            setVehicles(data.vehicles);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadVehicles();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setPhoto(null);
        setRegistration(null);
        setShowForm(true);
    };

    const openEditForm = (vehicle: TransporterVehicle) => {
        setEditingId(vehicle._id);
        setForm({
            vehicleType: vehicle.vehicleType,
            brand: vehicle.brand,
            model: vehicle.model,
            numberPlate: vehicle.numberPlate,
            seats: vehicle.seats ? String(vehicle.seats) : "",
            year: vehicle.year ? String(vehicle.year) : "",
            capacityKg: vehicle.capacityKg ? String(vehicle.capacityKg) : "",
        });
        setPhoto(null);
        setRegistration(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingId && !photo) {
            toast.error("Vehicle photo is required");
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append("brand", form.brand.trim());
            formData.append("model", form.model.trim());
            formData.append("seats", form.seats);
            formData.append("year", form.year);
            if (form.capacityKg) formData.append("capacityKg", form.capacityKg);
            if (photo) formData.append("vehiclePhoto", photo);

            if (!editingId) {
                formData.append("vehicleType", form.vehicleType);
                formData.append("numberPlate", form.numberPlate.trim());
                if (registration) formData.append("vehicleRegistration", registration);
            }

            const res = await fetch(
                editingId
                    ? `/api/transporter/vehicles/${editingId}`
                    : "/api/transporter/vehicles",
                {
                    method: editingId ? "PUT" : "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to save vehicle");
            }

            toast.success(data.message || "Vehicle saved");
            closeForm();
            await loadVehicles();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (vehicle: TransporterVehicle) => {
        if (!window.confirm(`Delete ${vehicle.brand} ${vehicle.model}?`)) return;

        try {
            setUpdatingId(vehicle._id);

            const res = await fetch(`/api/transporter/vehicles/${vehicle._id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to delete vehicle");
            }

            setVehicles((current) => current.filter((v) => v._id !== vehicle._id));
            toast.success("Vehicle deleted");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setUpdatingId(null);
        }
    };

    const toggleRental = async (vehicle: TransporterVehicle) => {
        const nextStatus = vehicle.rentalAvailable ? "unavailable" : "available";

        try {
            setUpdatingId(vehicle._id);

            const res = await fetch(
                `/api/transporter/vehicles/${vehicle._id}/rental-availability`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ status: nextStatus }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update rental availability");
            }

            setVehicles((current) =>
                current.map((v) =>
                    v._id === vehicle._id ? { ...v, rentalAvailable: data.rentalAvailable } : v
                )
            );

            toast.success(
                data.rentalAvailable
                    ? "Vehicle is now listed for rent"
                    : "Vehicle removed from rental listings"
            );
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                Loading your vehicles...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0F172A]">My Vehicles</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your vehicles and choose which ones customers can find in rental search.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ee8d39] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#f59d50]"
                >
                    <Plus size={16} />
                    Add vehicle
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    No vehicle found. Click &quot;Add vehicle&quot; to add your first one.
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="relative h-40 bg-slate-100">
                                {vehicle.images?.[0] ? (
                                    <Image
                                        src={vehicle.images[0]}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-300">
                                        <Car size={40} />
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">
                                            {vehicle.brand} {vehicle.model}
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {vehicle.vehicleType} · {vehicle.seats ?? "N/A"} seats
                                            {vehicle.year ? ` · ${vehicle.year}` : ""}
                                        </p>
                                        <p className="mt-1 font-mono text-xs uppercase text-slate-600">
                                            {vehicle.numberPlate}
                                        </p>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEditForm(vehicle)}
                                            aria-label="Edit vehicle"
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(vehicle)}
                                            disabled={updatingId === vehicle._id}
                                            aria-label="Delete vehicle"
                                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Available for rent
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {vehicle.rentalAvailable
                                                ? "Visible in rental search"
                                                : "Hidden from rental search"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={vehicle.rentalAvailable}
                                        aria-label={`Toggle rental availability for ${vehicle.brand} ${vehicle.model}`}
                                        disabled={updatingId === vehicle._id}
                                        onClick={() => toggleRental(vehicle)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                                            vehicle.rentalAvailable ? "bg-[#ee8d39]" : "bg-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                                vehicle.rentalAvailable ? "translate-x-5" : "translate-x-0.5"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-black text-[#0F172A]">
                                {editingId ? "Edit vehicle" : "Add vehicle"}
                            </h2>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Vehicle type
                                </label>
                                <select
                                    name="vehicleType"
                                    value={form.vehicleType}
                                    onChange={handleChange}
                                    disabled={!!editingId}
                                    className={inputClass}
                                >
                                    <option value="Bike">Bike</option>
                                    <option value="Car">Car</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Bus">Bus</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-600">
                                        Brand
                                    </label>
                                    <input
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-600">
                                        Model
                                    </label>
                                    <input
                                        name="model"
                                        value={form.model}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Number plate
                                </label>
                                <input
                                    name="numberPlate"
                                    value={form.numberPlate}
                                    onChange={handleChange}
                                    disabled={!!editingId}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-600">
                                        Seats
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        name="seats"
                                        value={form.seats}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-600">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-600">
                                        Capacity (kg)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        name="capacityKg"
                                        value={form.capacityKg}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-600">
                                    Vehicle photo {editingId ? "(leave empty to keep current)" : ""}
                                </label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-slate-600"
                                />
                            </div>

                            {!editingId && (
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-600">
                                        Registration document (optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) =>
                                            setRegistration(e.target.files?.[0] || null)
                                        }
                                        className="w-full text-sm text-slate-600"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[#ee8d39] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#f59d50] disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : editingId ? "Save changes" : "Add vehicle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}