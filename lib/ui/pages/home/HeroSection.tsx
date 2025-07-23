"use client";

import Image from "next/image";
import { Button } from "@/lib/ui/components/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-72">
      {/* Background Image */}
      <Image
        src="/hero-bg.jpg"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 w-85 mx-auto">
        {/* Hero Text SVG */}
        <div className="relative mb-8">
          <Image
            src="/hero-txt.svg"
            alt="Hero Text"
            width={400}
            height={200}
            className="w-full h-auto"
          />
        </div>

        {/* Call to Action Button */}
        <div className="w-full max-w-md">
          <Link href="/products" className="block">
            <Button className="bg-white text-black font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
              SHOP NOW
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
