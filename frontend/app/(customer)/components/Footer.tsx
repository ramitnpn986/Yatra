import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white px-8  mt-12 py-10">
      <div className="max-w-5xl mx-auto flex flex-col  justify-between items-center gap-4">

        <div className="w-full flex justify-between items-center py-5">

          <div>
            <Image src="/logo.png"
              alt="Yatra"
              width={128}
              height={40}
              className="w-[8rem] text-blue-400 h-auto" />
          </div>


          <div className="flex gap-6 text-sm">
            <Link href="/en" className="hover:text-blue-400 transition">
              Home
            </Link>
            <Link href="/en/login" className="hover:text-blue-400 transition">
              Login
            </Link>
            <Link href="/en/register" className="hover:text-blue-400 transition">
              Register
            </Link>
          </div>
        </div>


        <p className="text-sm text-white/60">
          @ 2026 Yatra All rights reserved.
        </p>
      </div>
    </footer>
  );
}