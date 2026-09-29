import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#0a1f39] px-6 py-16">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center">
        <div className="grid w-full items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#ee8d39] md:text-5xl">
              Rides, deliveries and tours across Nepal
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#b0aeae] md:text-lg">
              Book a bike, car, or truck in minutes. Track your ride live and pay
              however works for you.
            </p>

            <button className="mt-8 rounded bg-[#0b2c54] px-8 py-3 text-lg font-semibold text-white transition hover:bg-[#11345f]">
              Book a Ride
            </button>
          </div>

          <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden px-6 py-10 rounded-2xl">

            <div className="absolute left-[9%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#102044] z-999" />
            <div className="absolute bottom-[-100px] left-[-80px] h-[260px] w-[260px] rounded-full bg-[#0d1e3f]" />

            <div className="relative z-100 w-full max-w-[520px] z-1000">
              <div className="relative overflow-hidden rounded-[45%_45%_45%_45%] shadow-2xl">
                <Image
                  src="/background.jpg"
                  alt="Yatra ride"
                  width={800}
                  height={600}
                  className="h-[460px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071936]/40 via-transparent to-transparent" />
              </div>
            </div>

            <div className="absolute bottom-12 left-8  rounded-2xl bg-white px-5 py-3 shadow-xl z-1000">
              <p className="text-xs font-medium text-gray-500">Travel across Nepal</p>
              <p className="text-lg font-bold text-[#18316b]">Safe · Fast · Easy</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
