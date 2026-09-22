"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { X, UserRound, Bike, Truck } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenLogin, setMenuOpenLogin] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const closeMenuLogin = () => setMenuOpenLogin(false);

  return (
    <header>
      <nav className="flex items-center justify-between bg-[#0F172A] px-8 py-3">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Yatra"
            width={100}
            height={30}
            className="invert"
          />
        </Link>

        <div className="flex gap-3">
          <button type="button" onClick={()=>setMenuOpenLogin(true)} className="rounded border border-white px-4 py-2 text-[#60A5FA] transition hover:text-white">
            Login
          </button>

          <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
            Register
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      )}

       {menuOpenLogin && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      )}


      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-full bg-white text-black transition-transform duration-500 ease-in-out sm:w-[80%] lg:w-1/3   ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between  px-6 sm:px-10">
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8 sm:px-10">
          <div className="mb-8">
            <p className="mt-2 text-lg text-gray-800"> Choose how you want to use the Yatra platform. </p>
          </div>

          <div className="grid gap-4">
            <Link
              href="/register"
              onClick={closeMenu}
              className="group rounded-2xl  p-6 transition hover:border-blue-500 hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <UserRound className="h-7 w-7 text-blue-500 transition group-hover:scale-110" />

                <div>
                  <h3 className="text-lg font-semibold">  Passenger </h3>
                  <p className="mt-1 text-sm text-gray-400"> Book rides and travel to your destination. </p>
                </div>
              </div>
            </Link>


            <Link
              href="/transporter/register"
              onClick={closeMenu}
              className="group rounded-2xl  p-6 transition  hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <Bike className="h-7 w-7 text-blue-500 transition" />

                <div>
                  <h3 className="text-lg font-semibold">  Rider </h3>
                  <p className="mt-1 text-sm text-gray-400"> Provide ride and delivery services. </p>
                </div>
              </div>
            </Link>


            <Link
              href="/transporter/register"
              onClick={closeMenu}
              className="group rounded-2xl p-6 transition hover:border-blue-500 hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <Truck className="h-7 w-7 text-blue-500 transition " />

                <div>
                  <h3 className="text-lg font-semibold">  Bus / Truck Provider </h3>
                  <p className="mt-1 text-sm text-gray-400">  List your vehicles for rentals and bookings. </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>




      <aside className={`fixed right-0 top-0 z-50 h-screen w-full bg-white text-black transition-transform duration-500 ease-in-out sm:w-[80%] lg:w-1/3   ${menuOpenLogin ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between  px-6 sm:px-10">
          <button
            type="button"
            onClick={closeMenuLogin}
            className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8 sm:px-10">
          <div className="mb-8">
            <p className="mt-2 text-lg text-gray-800">  how you want to login ? </p>
          </div>

          <div className="grid gap-4">
            <Link
              href="/register"
              onClick={closeMenuLogin}
              className="group rounded-2xl  p-6 transition hover:border-blue-500 hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <UserRound className="h-7 w-7 text-blue-500 transition group-hover:scale-110" />

                <div>
                  <h3 className="text-lg font-semibold">  Passenger </h3>
                  <p className="mt-1 text-sm text-gray-400"> Book rides and travel to your destination. </p>
                </div>
              </div>
            </Link>


            <Link
              href="/transporter/login"
              onClick={closeMenuLogin}
              className="group rounded-2xl  p-6 transition  hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <Bike className="h-7 w-7 text-blue-500 transition" />

                <div>
                  <h3 className="text-lg font-semibold">  Rider </h3>
                  <p className="mt-1 text-sm text-gray-400"> Provide ride and delivery services. </p>
                </div>
              </div>
            </Link>


            <Link
              href="/transporter/login"
              onClick={closeMenuLogin}
              className="group rounded-2xl p-6 transition hover:border-blue-500 hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <Truck className="h-7 w-7 text-blue-500 transition " />

                <div>
                  <h3 className="text-lg font-semibold">  Bus / Truck Provider </h3>
                  <p className="mt-1 text-sm text-gray-400">  List your vehicles for rentals and bookings. </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>


    </header>
  );
}