export default function Hero() {
    return (
        <section className="flex flex-col items-center text-center px-6 py-24 gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary max-w-2xl">
                Rides, deliveries and tours across Nepal - all in one app
            </h1>
            <p className="text-text-muted max-w-xl">
        Book a bike, car, or truck in minutes. Track your ride live and pay
        however works for you.
      </p>
      <button className="bg-[#3e3abddd] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#504cc5dd] transition">
        Book a Ride
      </button>
    </section>
  );
}
    
