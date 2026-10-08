"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  CheckCircle,
  Code,
  Users,
  Brush,
  Lightbulb,
  Search,
  Rocket,
} from "lucide-react";

import {
  FaLightbulb,
  FaTruck,
  FaUserCheck,
  FaUsers,
  FaCode,
} from "react-icons/fa";

const processSteps = [
  {
    icon: <Search className="w-6 h-6 text-blue-600" />,
    title: "Requirement Gathering",
    desc: "Understanding client goals, audience & vision.",
    yOffset: "-10px",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: "Strategic Planning",
    desc: "Blueprinting the solution with timelines & tasks.",
    yOffset: "20px",
  },
  {
    icon: <Brush className="w-6 h-6 text-pink-500" />,
    title: "Creative Designs",
    desc: "Building intuitive, modern, user-centric UI/UX.",
    yOffset: "-25px",
  },
  {
    icon: <Users className="w-6 h-6 text-green-500" />,
    title: "Transparent Collaboration",
    desc: "Clear updates & feedback loops throughout.",
    yOffset: "15px",
  },
  {
    icon: <Code className="w-6 h-6 text-indigo-600" />,
    title: "Robust Development",
    desc: "Efficient code with performance & security.",
    yOffset: "-20px",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-teal-600" />,
    title: "Quality Assurance",
    desc: "Testing, refining & ensuring excellence.",
    yOffset: "10px",
  },
  {
    icon: <Rocket className="w-6 h-6 text-red-500" />,
    title: "Client Satisfaction",
    desc: "Launch, support & lasting partnership.",
    yOffset: "-15px",
  },
];

const features = [
  {
    icon: <FaLightbulb />,
    title: "Creative",
    color: "#00bcd4",
    yOffset: "-10px",
  },
  {
    icon: <FaTruck />,
    title: "Delivery on Time",
    color: "#3f51b5",
    yOffset: "20px",
  },
  {
    icon: <FaUserCheck />,
    title: "Personalized Service",
    color: "#9c27b0",
    yOffset: "-25px",
  },
  {
    icon: <FaUsers />,
    title: "Proficient & Dedicated Team",
    color: "#e91e63",
    yOffset: "10px",
  },
  {
    icon: <FaCode />,
    title: "Maintaining a Quality Code",
    color: "#ff9800",
    yOffset: "-15px",
  },
];

export default function AboutProcessSection() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className=" text-white">
      {/* --- Why Choose Us Section --- */}
      <section className="relative overflow-hidden py-20 px-4 md:px-16 z-10">
        <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0 z-0" />
        <div className="absolute w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 right-0 z-0" />

        <div className="relative flex flex-col md:flex-row items-center justify-center mt-16 z-10 gap-10">
          <div
  data-aos="zoom-in"
  className="bg-[#0070f3] text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-6 sm:px-8 md:px-10 py-10 sm:py-12 rounded-xl w-full sm:w-[260px] md:w-[300px] h-[200px] sm:h-[230px] md:h-[250px] relative shadow-2xl"
>
  <div className="absolute bottom-[-14px] left-6 sm:bottom-[-18px] sm:left-8 md:bottom-[-20px] md:left-10 w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 bg-[#0070f3] rotate-45" />
  <div className="flex flex-col justify-center items-center h-full text-center">
    <p>WHY</p>
    <p>CHOOSE US?</p>
  </div>
</div>


          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 w-full md:w-auto">
            {features.map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                style={{ transform: `translateY(${item.yOffset})` }}
                className="flex flex-col items-center text-center group transition-all duration-300 w-28"
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center text-lg md:text-xl shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-2xl mb-2"
                  style={{
                    borderColor: item.color,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <p className="text-sm md:text-base font-semibold tracking-wide text-gray-200">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Process Roadmap Section --- */}
     {/* --- Process Roadmap Section --- */}
<section className="py-20 px-4 sm:px-6">
  <div className="max-w-4xl mx-auto text-center mb-16">
    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Process</h2>
    <p className="text-base sm:text-lg text-gray-300">
      From concept to launch, we guide every step with precision,
      creativity, and transparency.
    </p>
  </div>

  <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-6 md:gap-10">
    {processSteps.map((step, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.2 }}
        viewport={{ once: true }}
        style={{ transform: `translateY(${step.yOffset})` }}
        className="w-full md:w-[45%] max-w-md px-4"
      >
        <div className="bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-blue-500/30 transition-shadow duration-300 h-full">
          <div className="flex items-start sm:items-center gap-x-4 mb-4">
            <div className="bg-slate-900 border-4 border-blue-500 rounded-full p-3 shrink-0">
              {step.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-400">
              {step.title}
            </h3>
          </div>
          <p className="text-gray-300 pl-14 text-sm sm:text-base">
            {step.desc}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
</section>

    </div>
  );
}
