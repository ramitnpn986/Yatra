"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

type Provider = { _id: string; name: string; vehicle?: { type?: string } };

export default function NewRentalPage() {
    const router = useRouter();
    const [providers, setProviders] = useState<Provider[]>([]);
    const [providerId, setProviderId] = useState("");
    const [rentalType, setRentalType] = useState("with-driver");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pricePerDay, setPricePerDay] = useState("1000");
    const [pickupAddress, setPickupAddress] = useState("");
    const [returnAddress, setReturnAddress] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/passenger/rentals", { method: "PUT", credentials: "include" })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok || !data.success) throw new Error(data.message || "Failed to load providers");
                setProviders(data.providers || []);
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load providers"));
    }, []);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        const provider = providers.find((item) => item._id === providerId);
        if (!provider?.vehicle?.type) return setError("Select a provider");

        try {
            setSaving(true);
            const response = await fetch("/api/passenger/rentals", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transporterId: provider._id,
                    vehicleType: provider.vehicle.type,
                    rentalType,
                    pickupLocation: { address: pickupAddress, coordinates: [85.324, 27.7172] },
                    returnLocation: { address: returnAddress, coordinates: [85.324, 27.7172] },
                    startDate,
                    endDate,
                    pricePerDay: Number(pricePerDay),
                    securityDeposit: 0,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Failed to create rental");
            router.push("/customer/rentals");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create rental");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Link href="/customer/rentals" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={16} /> My rentals</Link>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-[#0F172A]">Request a Rental</h1>
                <p className="mt-1 text-sm text-slate-500">Choose an approved provider and rental dates.</p>
                <form onSubmit={submit} className="mt-6 grid gap-4">
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">Provider<select required value={providerId} onChange={(event) => setProviderId(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal"><option value="">Select provider</option>{providers.map((provider) => <option key={provider._id} value={provider._id}>{provider.name} · {provider.vehicle?.type}</option>)}</select></label>
                    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-semibold text-slate-700">Start date<input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold text-slate-700">End date<input required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal" /></label></div>
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">Rental type<select value={rentalType} onChange={(event) => setRentalType(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal"><option value="with-driver">With driver</option><option value="self-drive">Self drive</option></select></label>
                    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-semibold text-slate-700">Pickup address<input required value={pickupAddress} onChange={(event) => setPickupAddress(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold text-slate-700">Return address<input required value={returnAddress} onChange={(event) => setReturnAddress(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal" /></label></div>
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">Price per day<input required min="0" type="number" value={pricePerDay} onChange={(event) => setPricePerDay(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 font-normal" /></label>
                    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                    <button disabled={saving} className="rounded-lg bg-[#ee8d39] px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Submitting..." : "Submit rental request"}</button>
                </form>
            </div>
        </div>
    );
}