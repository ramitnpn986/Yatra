"use client";

import { Bell, Check, CheckCheck, CircleAlert, Info, Trash2 } from "lucide-react";
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
    message: "Complete your transporter profile to start receiving ride requests.",
    time: "Just now",
    type: "info",
    read: false,
  },
  {
    id: 2,
    title: "Profile verification pending",
    message: "Your KYC documents are waiting for admin review.",
    time: "Today",
    type: "warning",
    read: false,
  },
  {
    id: 3,
    title: "Availability updated",
    message: "Your current availability status was updated successfully.",
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
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === id ? { ...notification, read: true } : notification
    )));
  };

  const removeNotification = (id: number) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  };

  return (
    <section className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600"><Bell size={22} /></div>
            <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
            {unreadCount > 0 && <span className="rounded-full bg-orange-600 px-2.5 py-1 text-xs font-black text-white">{unreadCount} new</span>}
          </div>
          <p className="mt-2 text-sm text-slate-500">Stay up to date with your transporter activity.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={markAllAsRead} disabled={!unreadCount} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
            <CheckCheck size={16} /> Mark all read
          </button>
          <button type="button" onClick={() => setNotifications([])} disabled={!notifications.length} aria-label="Clear all notifications" title="Clear all notifications" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40">
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Bell className="text-slate-300" size={34} />
            <h2 className="font-black text-slate-800">You&apos;re all caught up</h2>
            <p className="text-sm text-slate-500">New updates will appear here.</p>
          </div>
        ) : notifications.map((notification) => (
          <article key={notification.id} className={`flex gap-4 border-b border-slate-100 p-5 last:border-b-0 ${notification.read ? "bg-white" : "bg-orange-50/50"}`}>
            <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notification.type === "success" ? "bg-green-100 text-green-600" : notification.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
              {iconForType(notification.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-black text-slate-800">{notification.title}</h2>
                <time className="text-xs font-semibold text-slate-400">{notification.time}</time>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-500">{notification.message}</p>
              <div className="mt-3 flex gap-3">
                {!notification.read && <button type="button" onClick={() => markAsRead(notification.id)} className="text-xs font-black text-orange-600 hover:text-orange-700">Mark as read</button>}
                <button type="button" onClick={() => removeNotification(notification.id)} className="text-xs font-bold text-slate-400 hover:text-red-600">Dismiss</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Page;