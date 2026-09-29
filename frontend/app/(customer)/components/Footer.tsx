import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          <div className="lg:col-span-2">
            <Link href="/en" className="inline-block shrink-0">
              <Image
                src="/yatralogo.png"
                alt="Yatra"
                width={100}
                height={40}
                priority
                className="h-auto w-20 rounded-full sm:w-24 md:w-22 lg:w-22 "
              />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Your journey, your way. Yatra connects passengers with
              trusted transport providers for rides, deliveries, tours,
              and rentals across Nepal.
            </p>

          </div>


          <div>
            <h3 className="mb-5 text-sm font-semibold text-white"> Company
              <Link
                href="/contact"
                className="transition hover:text-[#ee8d39]"
              >
                Contact
              </Link>
            </h3>

            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/en" className="transition hover:text-[#ee8d39]"> Home </Link>
              <Link  href="/en/login"  className="transition hover:text-[#ee8d39]"> Login </Link>
              <Link  href="/en/register" className="transition hover:text-[#ee8d39]"> Register </Link>
            </div>
          </div>


          <div>
            <h3 className="mb-5 text-sm font-semibold  text-white">  Services </h3>

            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/register" className="transition hover:text-[#ee8d39]">
                Book a Ride
              </Link>

              <Link href="/transporter/register" className="transition hover:text-[#ee8d39]">
                Become a Rider
              </Link>

              <Link href="/transporter/register" className="transition hover:text-[#ee8d39]">
                Vehicle Rental
              </Link>
            </div>
          </div>
        </div>


        <div className="mt-14 grid gap-4 pt-8 md:grid-cols-3">

          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="flex h-9 w-9 items-center justify-center">
              <MapPin size={17} className="text-[#ee8d39]" />
            </div>

            <span>Butwal, Nepal</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="flex h-9 w-9 items-center justify-center">
              <Mail size={17} className="text-[#ee8d39]" />
            </div>

            <span>support@yatra.com</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="flex h-9 w-9 items-center justify-center">
              <Phone size={17} className="text-[#ee8d39]" />
            </div>

            <span>+977 9867782172</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 md:flex-row md:px-8">
          <p>
            © {new Date().getFullYear()} Yatra. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="transition hover:text-slate-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="transition hover:text-slate-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}