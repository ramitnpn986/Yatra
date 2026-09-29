"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#0a1f39] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-12 text-center">
          <h1 className="text-2xl font-bold md:text-4xl text-[#ee8d39]">  Contact Yatra </h1>
          <p className="mx-auto mt-5 max-w-2xl  text-[#b0aeae] ">
            Have a question or need help? Send us a message and our team
            will get back to you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="rounded-2xl bg-[#102044] p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white"> Let&apos;s talk </h2>
            <p className="mt-3 text-[#b0aeae]">
              Whether you need help with a ride, delivery, rental, or
              anything else, you can contact the Yatra team.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl ">
                  <MapPin size={20} className="text-[#ee8d39]" />
                </div>
                <p className="font-medium text-white">  Butwal, Nepal </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl ">
                  <Mail size={20} className="text-[#ee8d39]" />
                </div>
                <p className="font-medium text-white"> support@yatra.com </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl ">
                  <Phone size={20} className="text-[#ee8d39]" />
                </div>
                <p className="font-medium text-white"> +977 9867782172 </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-[#0a1f39]"> Send us a message </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-[#ee8d39] "
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-[#ee8d39] "
                />
              </div>

              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Enter the title"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-[#ee8d39]"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <textarea
                  id="subject"
                  name="subject"
                  required
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-[#ee8d39]"
                />
              </div>

              <button type="submit" className="w-full rounded-lg bg-[#ee8d39] px-6 py-3 font-semibold text-white transition hover:bg-[#EA7C28]">
                Send Message
              </button>

              {submitted && (
                <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                  Thank you! Your message has been submitted.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}