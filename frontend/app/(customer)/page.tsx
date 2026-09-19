import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Image from "next/image";
import { Car, Package, Truck } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <section className="grid md:grid-cols-2 gap-6 px-8 pb-24 max-w-5xl  mx-auto">
        <div className=" rounded-2xl shadow-sm hover:shadow-lg overflow-hidden">
          <div className="relative h-52 w-full">
            <Image
              src="/ridesharing.png"
              alt="Yatra rides"
              fill
              className=" object-cover"
            />
          </div>

          <div className="p-6 text-center">
            <h3 className="mb-2 text-xl font-semibold text-primary">
              Rides
            </h3>

            <p className="mx-auto max-w-sm text-sm leading-6 text-text-muted">
              Book a bike or car and enjoy a safe, reliable ride with
              trusted transport providers.
            </p>

            <button className="mt-5 text-sm font-medium text-primary transition-colors hover:text-blue-700">
              Book a Ride →
            </button>
          </div>
        </div>

        <div className="rounded-2xl shadow-sm hover:shadow-lg overflow-hidden">
          <div className="relative h-52 w-full">
            <Image
              src="/BusRental.png"
              alt="Yatra rides"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 text-center">
            <h3 className="mb-2 text-xl font-semibold text-primary">
              Rental
            </h3>

            <p className="mx-auto max-w-sm text-sm leading-6 text-text-muted">
              Rent a bus or car and enjoy a safe, reliable tour with
              trusted transport providers.
            </p>

            <button className="mt-5 text-sm font-medium text-primary transition-colors hover:text-blue-700">
              Rent a vehicle →
            </button>
          </div>
        </div>


      </section>

      <section>
        <div className="my-20 flex flex-col items-center justify-center gap-10 bg-white px-6">
          <h1 className="text-center text-3xl font-bold text-primary md:text-4xl">
            How do you want to use Yatra?
          </h1>

          <div className="flex w-full max-w-4xl flex-col gap-6 md:flex-row">
  
            <Link
              href="/transporter/register"
              className="flex-1 rounded-2xl border border-gray-100 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Car className="mx-auto mb-3 text-primary" size={32} />
              <h3 className="mb-2 text-lg font-semibold text-primary"> Rider </h3>
              <p className="text-sm text-text-muted">  Provide ride and delivery services. </p>
            </Link>

  
            <Link
              href="/register"
              className="flex-1 rounded-2xl border border-gray-100 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Package className="mx-auto mb-3 text-primary" size={32} />
              <h3 className="mb-2 text-lg font-semibold text-primary"> Passenger </h3>
              <p className="text-sm text-text-muted"> Book a ride and travel to your destination. </p>
            </Link>

  
            <Link
              href="/transporter/register"
              className="flex-1 rounded-2xl border border-gray-100 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Truck className="mx-auto mb-3 text-primary" size={32} />
              <h3 className="mb-2 text-lg font-semibold text-primary"> Bus/Truck Provider </h3>
              <p className="text-sm text-text-muted">  List your vehicles for rentals and bookings. </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}