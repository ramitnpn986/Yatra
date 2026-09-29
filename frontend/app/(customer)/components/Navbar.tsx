
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { X, UserRound, Bike, Truck, Menu } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenLogin, setMenuOpenLogin] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const closeMenuLogin = () => setMenuOpenLogin(false);

  const scrollToServices = () => {
    setMobileNavOpen(false);

    setTimeout(() => {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <header className="relative z-50">
      <nav className="flex h-16 items-center justify-between bg-white px-4 shadow-lg sm:px-6 md:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/yatralogo.png"
            alt="Yatra"
            width={64}
            height={16}
            className="h-auto w-16 object-contain "
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex lg:gap-12">
          <div className="flex items-center gap-5 lg:gap-7">
            <Link href="/" className="font-semibold text-[#ee8d39] transition hover:text-[#f59d50]">
              Home
            </Link>

            <Link href="/contact" className="font-semibold text-[#ee8d39] transition hover:text-[#f59d50]">
              Contact
            </Link>

            <button  type="button"  onClick={() => { document.getElementById("services")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}  className="font-semibold text-[#ee8d39] transition hover:text-[#f59d50]"
            >
              Services
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpenLogin(true)}
              className="rounded-lg bg-[#1b355e] px-4 py-2 text-sm font-medium text-[#ee8d39] transition-colors hover:bg-[#193a6b] hover:text-[#f59d50] lg:px-5"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg bg-[#1b355e] px-4 py-2 text-sm font-medium text-[#ee8d39] transition-colors hover:bg-[#193a6b] hover:text-[#f59d50] lg:px-5"
            >
              Register
            </button>
          </div>
        </div>


        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1b355e] transition hover:bg-gray-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {mobileNavOpen && (
        <div onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"/>
      )}

      <aside className={`fixed right-0 top-0 z-50 h-screen w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Image
            src="/yatralogo.png"
            alt="Yatra"
            width={70}
            height={20}
            className="w-16 object-contain"
          />

          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-5">
          <Link  href="/"  onClick={() => setMobileNavOpen(false)}  className="rounded-lg px-4 py-3 font-semibold text-[#ee8d39] transition hover:bg-gray-100">
            Home
          </Link>

          <Link  href="/contact"  onClick={() => setMobileNavOpen(false)}  className="rounded-lg px-4 py-3 font-semibold text-[#ee8d39] transition hover:bg-gray-100">
            Contact
          </Link>

          <button  type="button"  onClick={scrollToServices}  className="rounded-lg px-4 py-3 text-left font-semibold text-[#ee8d39] transition hover:bg-gray-100">
            Services
          </button>

          <div className="my-3 h-px bg-gray-200" />

          <button type="button" onClick={() => {
              setMobileNavOpen(false);
              setMenuOpenLogin(true);
            }}
            className="rounded-lg bg-[#1b355e] px-4 py-3 font-semibold text-[#ee8d39] transition hover:bg-[#193a6b]"
          >
            Login
          </button>

          <button type="button" onClick={() => {
              setMobileNavOpen(false);
              setMenuOpen(true);
            }}
            className="rounded-lg bg-[#1b355e] px-4 py-3 font-semibold text-[#ee8d39] transition hover:bg-[#193a6b]"
          >
            Register
          </button>
        </div>
      </aside>


      {menuOpen && (
        <div onClick={closeMenu} className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"/>
      )}

      {menuOpenLogin && (
        <div onClick={closeMenuLogin} className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"/>
      )}


      <aside className={`fixed right-0 top-0 z-70 h-screen w-full max-w-md bg-[#0a1f39] text-white shadow-2xl transition-transform duration-500 ease-in-out sm:w-[80%] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5 sm:px-8">
          <h2 className="text-lg font-semibold text-[#ee8d39]">
            Register
          </h2>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
            aria-label="Close register menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8 sm:px-8">
          <p className="mb-8 text-base text-gray-300 sm:text-lg">
            Choose how you want to use the Yatra platform.
          </p>

          <div className="grid gap-3">
            <Link href="/register" onClick={closeMenu} className="group rounded-2xl p-5 transition hover:bg-white/10 sm:p-6">
              <div className="flex items-center gap-4">
                <UserRound className="h-7 w-7 shrink-0 text-blue-500 transition group-hover:scale-110" />

                <div>
                  <h3 className="text-lg font-semibold text-[#ee8d39]"> Passenger </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-400">
                    Book rides and travel to your destination.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/transporter/register"
              onClick={closeMenu}
              className="group rounded-2xl p-5 transition hover:bg-white/10 sm:p-6"
            >
              <div className="flex items-center gap-4">
                <Bike className="h-7 w-7 shrink-0 text-blue-500 transition group-hover:scale-110" />

                <div>
                  <h3 className="text-lg font-semibold text-[#ee8d39]">  Rider </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-400">  Provide ride and delivery services. </p>
                </div>
              </div>
            </Link>

            <Link
              href="/transporter/register"
              onClick={closeMenu}
              className="group rounded-2xl p-5 transition hover:bg-white/10 sm:p-6"
            >
              <div className="flex items-center gap-4">
                <Truck className="h-7 w-7 shrink-0 text-blue-500 transition group-hover:scale-110" />

                <div>
                  <h3 className="text-lg font-semibold text-[#ee8d39]"> Bus / Truck Provider </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-400">
                    List your vehicles for rentals and bookings.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      <aside  className={`fixed right-0 top-0 z-70 h-screen w-full max-w-md bg-[#0a1f39] text-white shadow-2xl transition-transform 
      duration-500 ease-in-out sm:w-[80%] ${ menuOpenLogin ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5 sm:px-8">
          <h2 className="text-lg font-semibold text-[#ee8d39]"> Login </h2>

          <button
            type="button"
            onClick={closeMenuLogin}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
            aria-label="Close login menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8 sm:px-8">
          <p className="mb-8 text-base text-gray-300 sm:text-lg"> How do you want to login? </p>

          <div className="grid gap-3">
            <Link href="/login" onClick={closeMenuLogin} className="group rounded-2xl p-5 transition hover:bg-white/10 sm:p-6">
              <div className="flex items-center gap-4">
                <UserRound className="h-7 w-7 shrink-0 text-blue-500 transition group-hover:scale-110" />
                <div>
                  <h3 className="text-lg font-semibold text-[#ee8d39]"> Passenger </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-400">  Book rides and travel to your destination. </p>
                </div>
              </div>
            </Link>

            <Link  href="/transporter/login"  onClick={closeMenuLogin}  className="group rounded-2xl p-5 transition hover:bg-white/10 sm:p-6">
              <div className="flex items-center gap-4">
                <Bike className="h-7 w-7 shrink-0 text-blue-500 transition group-hover:scale-110" />
                <div>
                  <h3 className="text-lg font-semibold text-[#ee8d39]">  Rider </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-400">  Provide ride and delivery services. </p>
                </div>
              </div>
            </Link>

            <Link href="/transporter/login" onClick={closeMenuLogin} className="group rounded-2xl p-5 transition hover:bg-white/10 sm:p-6">
              <div className="flex items-center gap-4">
                <Truck className="h-7 w-7 shrink-0 text-blue-500 transition group-hover:scale-110" />
                <div>
                  <h3 className="text-lg font-semibold text-[#ee8d39]">  Bus / Truck Provider</h3>
                  <p className="mt-1 text-sm leading-5 text-gray-400"> List your vehicles for rentals and bookings. </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </header>
  );
}
