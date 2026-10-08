"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const solutions = [
  {
    title: "Business Solutions",
    desc: "End-to-end technology solutions built around how your business runs.",
    image: "https://nishkarshit.com/assets/business-ZsSXwq_Y.jpg",
  },
  {
    title: "Infrastructure",
    desc: "Reliable IT infrastructure and cloud setup that scales with you.",
    image: "https://nishkarshit.com/assets/infra-CZsnXnNs.jpg",
  },
  {
    title: "Loans",
    desc: "Fast, transparent loan facilitation for individuals and businesses.",
    image: "https://nishkarshit.com/assets/loans-YGZ8EeNz.jpg",
  },
  {
    title: "Manpower",
    desc: "Skilled workforce solutions and staffing support across sectors.",
    image: "https://nishkarshit.com/assets/manpower-KZfVqRy-.jpg",
  },
];

export default function BusinessSolutionsSlider({
  heading,
  description,
}: {
  heading?: string;
  description?: string;
} = {}) {
  return (
    <section className="py-16 md:py-20 bg-[#062E49]">
      {/* Section Heading */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {heading || "Bringing Transformation to Every Business"}
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
          loop
          breakpoints={{
            640: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 3.2,
            },
          }}
        >
          {solutions.map((s) => (
            <SwiperSlide key={s.title}>
              {/* ONE CARD */}
              <div className="rounded-2xl overflow-hidden bg-[#F8FAFC] shadow-lg h-full">
                {/* IMAGE */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* TEXT BELOW IMAGE */}
                <div className="p-6 text-left">
                  <h3 className="text-xl font-bold text-[#062E49] mb-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-[#062E49]/75 leading-relaxed">
                    {s.desc}
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
