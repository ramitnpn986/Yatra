"use client";

import {
    Bell,
    Check,
    CircleAlert,
    Info,
    Trash2,
} from "lucide-react";
import { useState } from "react";

type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    type: "success" | "info" | "warning";
    read: boolean;
};

const initialNotifications: Notification[] = [
    {
        id: 1,
        title: "Welcome to Yatra",
        message:
            "Complete your transporter profile to start receiving ride requests.",
        time: "Just now",
        type: "info",
        read: false,
    },
    {
        id: 2,
        title: "Profile verification pending",
        message:
            "Your KYC documents are waiting for admin review.",
        time: "Today",
        type: "warning",
        read: false,
    },
    {
        id: 3,
        title: "Availability updated",
        message:
            "Your current availability status was updated successfully.",
        time: "Yesterday",
        type: "success",
        read: true,
    },
];

const iconForType = (type: Notification["type"]) => {
    if (type === "success") return <Check size={18} />;

    if (type === "warning") return <CircleAlert size={18} />;

    return <Info size={18} />;
};

const Page = () => {
    const [notifications, setNotifications] = useState(
        initialNotifications
    );

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const removeNotification = (id: number) => {
        setNotifications((current) =>
            current.filter((notification) => notification.id !== id)
        );
    };

    return (
        <section className="min-h-full bg-[#f5f7fa] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a1f39] text-[#ee8d39]">
                                <Bell size={21} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black text-[#0a1f39]">
                                    Notifications
                                </h1>

                                <p className="mt-1 text-sm text-[#b0aeae]">
                                    Stay updated with your Yatra account
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <span className="rounded-full bg-[#ee8d39] px-2.5 py-1 text-xs font-semibold text-white">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setNotifications([])}
                            disabled={!notifications.length}
                            title="Clear all notifications"
                            className="rounded-xl border border-[#0b2c54]/10 bg-white p-2.5 text-[#b0aeae] shadow-sm transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#0b2c54]/10 bg-white shadow-sm">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f7fa]">
                                <Bell
                                    className="text-[#b0aeae]"
                                    size={28}
                                />
                            </div>

                            <h2 className="font-black text-[#0a1f39]">
                                You&apos;re all caught up
                            </h2>

                            <p className="text-sm text-[#b0aeae]">
                                New updates will appear here.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <article
                                key={notification.id}
                                className={`flex gap-4 border-b border-[#0b2c54]/10 p-5 transition-colors last:border-b-0 ${
                                    notification.read
                                        ? "bg-white hover:bg-[#f5f7fa]"
                                        : "bg-[#ee8d39]/5 hover:bg-[#ee8d39]/10"
                                }`}
                            >
                                <div
                                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                        notification.type === "success"
                                            ? "bg-green-50 text-green-600"
                                            : notification.type === "warning"
                                              ? "bg-amber-50 text-amber-600"
                                              : "bg-[#0b2c54]/10 text-[#0b2c54]"
                                    }`}
                                >
                                    {iconForType(notification.type)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h2 className="font-black text-[#0a1f39]">
                                            {notification.title}
                                        </h2>

                                        <time className="text-xs font-semibold text-[#b0aeae]">
                                            {notification.time}
                                        </time>
                                    </div>

                                    <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                                        {notification.message}
                                    </p>

                                    <div className="mt-3 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNotification(
                                                    notification.id
                                                )
                                            }
                                            className="text-xs font-bold text-[#b0aeae] transition-colors hover:text-red-500"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Page;