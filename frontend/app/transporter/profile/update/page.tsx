"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";

const ProfileUpdatePage = () => {
	const [name, setName] = useState("");
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const response = await fetch("/api/transporter/profile", {
					credentials: "include",
				});
				const data = await response.json();
				if (response.ok) setName(data.transporter?.name || "");
				else setMessage(data.message || "Unable to load profile");
			} catch {
				setMessage("Unable to load profile");
			} finally {
				setLoading(false);
			}
		};

		loadProfile();
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		setMessage("");

		try {
			const formData = new FormData();
			formData.append("name", name);
			if (profileImage) formData.append("profileImage", profileImage);

			const response = await fetch("/api/transporter/profile", {
				method: "POST",
				credentials: "include",
				body: formData,
			});
			const data = await response.json();
			setMessage(data.message || (response.ok ? "Profile updated" : "Update failed"));
		} catch {
			setMessage("Unable to update profile");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <p className="font-semibold text-slate-600">Loading profile...</p>;

	return (
		<section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-black text-slate-900">Profile Settings</h1>
			<p className="mt-1 text-sm text-slate-500">Update your transporter name and profile image.</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-5">
				<label className="block text-sm font-bold text-slate-600">
					Name
					<input
						value={name}
						onChange={(event) => setName(event.target.value)}
						minLength={4}
						required
						className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-orange-500"
					/>
				</label>

				<label className="block text-sm font-bold text-slate-600">
					Profile image
					<input
						type="file"
						accept="image/*"
						onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
						className="mt-2 block w-full text-sm"
					/>
				</label>

				<button
					type="submit"
					disabled={saving}
					className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-bold text-white disabled:opacity-60"
				>
					<Save size={16} />
					{saving ? "Saving..." : "Save changes"}
				</button>
			</form>

			{message && <p className="mt-4 text-sm font-semibold text-slate-600">{message}</p>}
		</section>
	);
};

export default ProfileUpdatePage;
