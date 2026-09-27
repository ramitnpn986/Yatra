
export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 text-center"
      style={{ backgroundImage: "url('/application.png')"}}
    >

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/30 to-transparent" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6 pt-16">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
          Rides, deliveries and tours across Nepal — all in one app
        </h1>

        <p className="max-w-xl text-base leading-7 text-white/90 md:text-lg">
          Book a bike, car, or truck in minutes. Track your ride live and pay
          however works for you.
        </p>

        <button className="rounded bg-[#0b2c54] px-8 py-3 text-lg font-semibold text-white transition hover:bg-[#11345f]">
          Book a Ride
        </button>
      </div>
    </section>
  );
}