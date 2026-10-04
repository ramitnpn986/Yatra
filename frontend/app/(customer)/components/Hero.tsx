import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#0a1f39] px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 md:grid-cols-2 md:gap-12">

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#ee8d39] sm:text-4xl md:text-5xl">
              Rides, deliveries and tours across Nepal
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#b0aeae] sm:text-base sm:leading-7 md:text-lg">
              Book a bike, car, or truck in minutes. Track your ride live and
              pay however works for you.
            </p>

            <button className="mt-7 rounded-lg bg-[#0b2c54] px-7 py-3 text-base font-semibold text-white transition hover:bg-[#11345f] sm:px-8 sm:text-lg">
              Book a Ride
            </button>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl px-2 py-6 sm:min-h-[450px] md:min-h-[520px]">
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#102044] sm:h-[400px] sm:w-[400px] md:left-[13%] md:h-[480px] md:w-[480px] md:translate-x-0" />
            <div className="absolute bottom-[-80px] left-[-80px] h-[200px] w-[200px] rounded-full bg-[#0d1e3f] sm:h-[260px] sm:w-[260px]" />

            <div className="relative z-10 w-full max-w-[520px]">
              <div className="relative overflow-hidden rounded-[50%_50%_48%_48%] shadow-2xl">
                <Image
                  src="/background.jpg"
                  alt="Yatra ride"
                  width={800}
                  height={600}
                  className="h-[300px] w-full object-cover sm:h-[380px] md:h-[460px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071936]/40 via-transparent to-transparent" />
              </div>
            </div>

            <div className="absolute bottom-6 left-4 z-20 rounded-lg bg-[#dbd4d4] px-3 py-2 shadow-xl sm:bottom-10 sm:left-8">
              <p className="text-[10px] font-medium text-gray-500 sm:text-xs">
                Travel across Nepal
              </p>

              <p className="text-xs font-bold text-[#18316b] sm:text-sm">
                Safe · Fast · Easy
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}