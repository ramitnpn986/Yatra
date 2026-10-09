"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, MapPin, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a1f39] px-5 py-16 sm:px-6 md:py-24">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#0b0637] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#0e0c32] blur-[150px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#ee8d39] backdrop-blur-md">
              <span className="font-semibold tracking-[0.01rem] italic">Nepal's All-in-One Mobility Platform</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.15]">
              Rides, booking <br className="hidden sm:inline" />
              & tours across{" "}
              <span className="bg-gradient-to-r bg-clip-text text-transparent text-gradient-to-tr from-[#ec0331] via-white/80 to-[#023587]   rounded-2xl">
                Nepal
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Book a bike, car, or heavy truck in minutes. Track your journey live across major highways and cities with verified local drivers.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button className=" inline-flex items-center justify-center gap-2 rounded bg-white px-4 py-2 text-base font-semibold text-slate-950 shadow-lg shadow-[#ee8d39]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#ee8d39]/20 active:scale-[0.98]">
                <span>Book a Ride Now</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded border border-white/10 bg-white/5 px-4 py-2 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                Explore Vehicle Types
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6  lg:justify-start">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>100% Verified Drivers</span>
              </div>
            </div>

          </div>


          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-md shadow-2xl">

              <div className="relative flex h-[380px] w-full items-end justify-center gap-2 overflow-hidden rounded-2xl p-1 sm:h-[460px] sm:gap-4">
                <div className="relative h-[60%] w-1/3 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                  <Image
                    src="/background.jpg"
                    alt="Yatra Bike Ride"
                    fill
                    priority
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font text-white backdrop-blur-md sm:text-xs">
                    Bike ride
                  </span>
                </div>

                <div className="relative h-[80%] w-1/3 overflow-hidden rounded-2xl border border-white/10 shadow-xl">
                  <Image
                    src="/ev-nexon.png" 
                    alt="Yatra Car Rental"
                    fill
                    priority
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font text-slate-950 shadow-md backdrop-blur-md sm:text-xs">
                    Car ride
                  </span>
                </div>

          
                <div className="relative h-[100%] w-1/3 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                  <Image
                    src="/booking.png" 
                    alt="Yatra Delivery"
                    fill
                    priority
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs">
                    booking
                  </span>
                </div>
              </div>

              <div className="absolute top-6 left-2 z-20 flex items-center gap-2 rounded-2xl border border-white/15  p-2 shadow-2xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5 text-[#aaa]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#aaa]">Live Tracking</p>
                  <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    Active across 7 Provinces
                  </p>
                </div>
              </div>

              <div className="absolute top-26 left-2 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl">
                <p className="text-sm font-bold text-white">Safe · Fast · Easy</p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}