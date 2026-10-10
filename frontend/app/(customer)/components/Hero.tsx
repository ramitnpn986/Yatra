"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const taglines = [
  "Nepal's All-in-one Mobility Platform",
  "Your Journey, Our Priority",
  "Ride, Rent, and Explore Nepal"
];


export default function Hero() {

  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);


  const transformStyle = isHovered
    ? `translateX(${1}px) rotateY(${33}deg) translateZ(${39}px)`
    : `translateX(${0}px) rotateY(${0}deg) translateZ(${0}px)`;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % taglines.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0a1f39] px-5 py-16 sm:px-6 md:py-24">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#0b0637] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#0e0c32] blur-[150px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">

            <div className="mb-6 inline-flex items-center  rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs sm:text-sm font-medium text-[#ee8d39] backdrop-blur-md">
              <span className={`overflow-hidden shadow-xl p-2 rounded-2xl shadow-black whitespace-nowrap font-semibold italic tracking-[0.01rem] transition-[max-width,opacity] duration-600 ease-in-out ${isVisible
                ? "max-w-[400px] opacity-100" : "max-w-0 opacity-0"}`}>{taglines[index]}</span>
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

              <div
                className={`absolute inset-0 z-20 bg [perspective:1000px] w-45 h-18 flex items-center gap-2 rounded-2xl border border-white/15 p-3 shadow-2xl backdrop-blur-xl  transition-transform duration-500 ease-out`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: transformStyle,
                  zIndex: isHovered ? 20 : 3,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <MapPin className="h-5 w-5 text-[#aaa]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#aaa]">
                    Network sync
                  </p>
                  <p className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                    Real-time updates
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