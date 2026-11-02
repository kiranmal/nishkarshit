"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { optimizeImage } from "@/lib/img";
import type { BusinessSolutionsContent } from "@/lib/cms/home";
import Link from "next/link";

export default function BusinessSolutionsSlider({ content }: { content: BusinessSolutionsContent }) {
  const { heading, description } = content;
  const solutions = content.items.filter((x) => x.visible !== false);
  return (
    <section className="py-16 md:py-20 bg-[#062E49]">
      {/* Section Heading */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {heading}
        </h2>

        {description && <p className="text-white/80 mt-2">{description}</p>}
      </div>

      {/* Slider */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1.15}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
          }}
          loop={solutions.length > 3}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 3.2,
            },
          }}
        >
          {solutions.map((s, idx) => (
            <SwiperSlide key={idx}>
              {/* ONE CARD */}
              <div className="rounded-2xl overflow-hidden bg-[#F8FAFC] shadow-lg h-full">
                {/* IMAGE */}
                <div className="h-56 overflow-hidden">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={optimizeImage(s.image, 900)}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* TEXT BELOW IMAGE */}
                <div className="p-6 text-left">
                  <h3 className="text-xl font-bold text-[#062E49] mb-2">
                    {s.link ? <Link href={s.link}>{s.title}</Link> : s.title}
                  </h3>

                  <p className="text-sm text-[#062E49]/75 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
