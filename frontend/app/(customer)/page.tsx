import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Image from "next/image";
import {

  Truck,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Clock3,
  Bike,
  Bus,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />

      <section className="relative  px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Move smarter with Yatra
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              From everyday rides to group travel and transportation,
              Yatra connects you with reliable transport providers across Nepal.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="group overflow-hidden rounded-3xl bg-white shadow hover:shadow-xl transition-all duration-300 ">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/ridesharing.png"
                  alt="Yatra rides"
                  fill
                  className="object-cover"
                />

                <div className="absolute bottom-5 group left-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold  shadow hover:shadow-xl">
                   Everyday Rides
                </div>
              </div>

              <div className="p-7">
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900">  Rides </h3>
                </div>

                <p className="max-w-lg text-sm leading-6 text-slate-500">
                  Book a bike or car in minutes. Find nearby transport
                  providers, track your ride in real time, and travel
                  comfortably to your destination.
                </p>

                <Link href="/register"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:gap-3"
                >
                  Book a Ride
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>


            <div className="group overflow-hidden rounded-3xl  bg-white transition-all duration-300 shadow  hover:shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/BusRental.png"
                  alt="Yatra vehicle rental"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 shadow">
                   Tours & Rentals
                </div>
              </div>

              <div className="p-7">
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900"> Rentals </h3>
                </div>

                <p className="max-w-lg text-sm leading-6 text-slate-500">
                  Plan group trips, rent buses or cars, and arrange
                  transportation for tours, events, and long-distance travel.
                </p>

                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:gap-3"
                >
                  Explore Rentals
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="text-xl font-semibold text-[#3e5da7]"> Why Yatra ? </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"> Travel with confidence </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Designed to make transportation simple, transparent, and convenient.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 transition hover:-translate-y-1 ">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <MapPin className="text-indigo-600" size={24} />
              </div>

              <h3 className="mb-2 text-lg font-bold"> Live Location </h3>

              <p className="text-sm leading-6 text-slate-500">
                See your pickup, destination, route, and ride location
                with real-time map updates.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 transition hover:-translate-y-1 ">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <ShieldCheck className="text-indigo-600" size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold"> Trusted Providers </h3>
              <p className="text-sm leading-6 text-slate-500">
                Connect with verified transport providers and travel with
                greater confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 transition hover:-translate-y-1 ">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <Clock3 className="text-indigo-600" size={24} />
              </div>

              <h3 className="mb-2 text-lg font-bold"> Simple & Fast </h3>
              <p className="text-sm leading-6 text-slate-500">
                Request a ride, find a nearby provider, and start your
                journey without unnecessary steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-6 py-18">

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">  How do you want to use Yatra? </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Whether you're travelling or providing transportation,
              Yatra has a place for you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/transporter/register"
              className="rounded-2xl  bg-white/6 p-7 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/1"
            >
              <div className="mb-4 flex h-18 w-18 items-center justify-center ">
                <Bike className="text-[#5b7dce]" size={57} />
              </div>

              <h3 className="mb-2 text-xl font-bold text-white"> Become a Rider </h3>

              <p className="mb-6 text-sm leading-6 text-slate-400">
                Provide bike and car rides or delivery services and
                connect with passengers around you.
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b7dce] transition group-hover:gap-3">
                Start providing
                <ArrowRight size={17} />
              </span>
            </Link>

            <Link href="/register"className="rounded-2xl  bg-white/6 p-7 backdrop-blur transition duration-300 hover:-translate-y-1 ">
              <div className="mb-6 flex h-14 w-14 items-center justify-center ">
                <Bus className="text-[#5b7dce]" size={57} />
              </div>

              <h3 className="mb-2 text-xl font-bold text-white">
                Travel with Yatra
              </h3>

              <p className="mb-6 text-sm leading-6 text-slate-400">
                Choose your pickup and destination, request a ride,
                and follow your journey in real time.
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b7dce] transition group-hover:gap-3">
                Book a ride
                <ArrowRight size={17} />
              </span>
            </Link>

            <Link href="/transporter/register" className=" rounded-2xl  bg-white/[0.06] p-7 backdrop-blur transition duration-300 hover:-translate-y-1 ">
              <div className="mb-6 flex h-14 w-14 items-center justify-center">
                <Truck className="text-[#5b7dce]" size={77} />
              </div>

              <h3 className="mb-2 text-xl font-bold text-white">  Become a Provider </h3>

              <p className="mb-6 text-sm leading-6 text-slate-400">
                List buses, trucks, and other vehicles for rentals,
                tours, and transportation services.
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b7dce] transition group-hover:gap-3">
                Register vehicle
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        </div>
      </section>


      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#0F172A] px-8 py-14 text-center shadow-xl md:px-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Your journey starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Book your next ride with Yatra and experience a simpler way
            to travel across Nepal.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#0F172A] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
          >
            Book a Ride
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}