"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const tiles = [
  {
    image: "https://nishkarshit.com/assets/Software-B9q3P1k-.jpg",
  },
  {
    image: "https://nishkarshit.com/assets/business-ZsSXwq_Y.jpg",
  },
  {
    image: "https://nishkarshit.com/assets/infra-CZsnXnNs.jpg",
  },
  {
    image: "https://nishkarshit.com/assets/loans-YGZ8EeNz.jpg",
  },
  {
    image: "https://nishkarshit.com/assets/manpower-KZfVqRy-.jpg",
  },
  {
    image: "https://nishkarshit.com/assets/Software-B9q3P1k-.jpg",
  },
];

export default function Gallery() {
  return (
    <section className="py-16 md:py-20 bg-[#062E49]">
      {/* Heading */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2
          className="text-3xl md:text-6xl font-bold text-[#c8bfbf]"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Our Gallery
        </h2>
      </div>

      {/* Slider */}
      <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8">
        <Swiper
          modules={[Autoplay]}
          className="w-full"
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
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
                  src={tile.image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
