"use client";

import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import SocialSidebar from "./SocialSidebar";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative min-h-screen pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-screen h-full object-cover z-0"
      >
        <source src="/background_video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10 pointer-events-none" />

      {/* Transparent Grid */}
      <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center bg-transparent [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Spotlights */}
      <div className="z-30">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* Logo */}
      <div className="absolute p-1 top-6 left-6 z-50">
        <Image
          src="/CompanyLogo.png"
          alt="Niskarsh IT Logo"
          width={250}
          height={250}
          className="w-20 h-auto"
        />
      </div>

      {/* Social Icons */}
      <div className="absolute top-6 p-3 right-6 z-50">
        <SocialSidebar orientation="horizontal" />
      </div>

      {/* Hero Content */}
      <div className="relative z-40 flex flex-col items-center justify-center px-4 text-center space-y-4">
        <p className="uppercase tracking-widest text-xs sm:text-sm max-w-xs pt-6 sm:pt-6 md:pt-8">
          Grow Your Business With Niskarsh
        </p>

        <TextGenerateEffect
          words={
            "Niskarsh IT Solution\nTransforming Concepts into Seamless User Experiences"
          }
          className="text-[28px] sm:text-[36px] md:text-5xl lg:text-6xl font-semibold leading-snug sm:leading-tight whitespace-pre-line"
        />

        <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-muted-foreground">
          The next generation Technology
        </p>
      </div>
    </div>
  );
};

export default Hero;
