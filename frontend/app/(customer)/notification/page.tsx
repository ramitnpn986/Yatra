"use client";

import { Bell, Check, CircleAlert, Info, Trash2 } from "lucide-react";
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
    message: "Your passenger account is ready. You can now request rides and manage your trips.",
    time: "Just now",
    type: "info",
    read: false,
  },
  {
    id: 2,
    title: "Profile updated",
    message: "Your passenger profile was updated successfully.",
    time: "Today",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "Ride updates",
    message: "You will receive updates here when there is a change to your ride request.",
    time: "Yesterday",
    type: "warning",
    read: true,
  },
];

const iconForType = (type: Notification["type"]) => {
  if (type === "success") return <Check size={18} />;
  if (type === "warning") return <CircleAlert size={18} />;
  return <Info size={18} />;
};

const Page = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const removeNotification = (id: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <section className="min-h-full bg-white">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-[#ee8d39] px-2.5 py-1 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your Yatra activities.
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0b2c54]"
            >
              Mark all as read
            </button>
          )}

          <button
            type="button"
            onClick={() => setNotifications([])}
            disabled={!notifications.length}
            title="Clear all notifications"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Bell className="text-[#0F172A]" size={28} />
            </div>

            <h2 className="font-black text-slate-800">
              You&apos;re all caught up
            </h2>

            <p className="text-sm text-slate-500">
              New updates will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex gap-4 border-b border-slate-100 p-5 last:border-b-0 ${
                notification.read ? "bg-white" : "bg-slate-50"
              }`}
            >
              <div
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  notification.type === "success"
                    ? "bg-green-50 text-green-600"
                    : notification.type === "warning"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-[#3e5da7]"
                }`}
              >
                {iconForType(notification.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-black text-slate-800">
                    {notification.title}
                  </h2>

                  <time className="text-xs font-semibold text-slate-400">
                    {notification.time}
                  </time>
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {notification.message}
                </p>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => removeNotification(notification.id)}
                    className="text-xs font-bold text-slate-400 transition hover:text-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Page;