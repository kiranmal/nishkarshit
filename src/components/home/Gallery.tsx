"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { optimizeImage } from "@/lib/img";
import type { GalleryContent } from "@/lib/cms/home";

export default function Gallery({ content }: { content: GalleryContent }) {
  const tiles = content.items.filter((t) => t.visible !== false && t.image);
  return (
    <section className="py-16 md:py-20 bg-[#062E49]">
      {/* Heading */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2
          className="text-3xl md:text-6xl font-bold text-[#c8bfbf]"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {content.heading}
        </h2>
      </div>

      {/* Slider */}
      <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8">
        <Swiper
          modules={[Autoplay]}
          className="w-full"
          spaceBetween={20}
          slidesPerView={1}
          loop={tiles.length > 4}
          speed={800}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {tiles.map((tile, index) => (
            <SwiperSlide key={index}>
              <div className="w-full aspect-square overflow-hidden rounded-xl">
                <img
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  src={optimizeImage(tile.image)}
                  alt={tile.alt || tile.title || `Gallery ${index + 1}`}
                  title={tile.title || undefined}
                  className="block w-full h-full object-cover"
                  style={{
                    opacity: 1,
                    filter: "none",
                    imageRendering: "auto",
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
