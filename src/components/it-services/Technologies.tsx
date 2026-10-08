"use client";
import React, { useEffect } from "react";
import {
  FaAws,
  FaDev,
  FaMicrosoft,
  FaNodeJs,
  FaReact,
  FaVuejs,
  FaAngular,
  FaShopify,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiMongodb,
  SiMysql,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiIonic,
  SiDotnet,
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";

const techData = [
  {
    title: "Mobile Application Development",
    items: [
      { name: "React Native", icon: <FaReact /> },
      { name: "Flutter", icon: <SiFlutter /> },
      { name: "Kotlin", icon: <SiKotlin /> },
      { name: "Swift", icon: <SiSwift /> },
      { name: "Ionic", icon: <SiIonic /> },
    ],
  },
  {
    title: "Web Development",
    items: [
      { name: "Shopify", icon: <FaShopify /> },
      { name: "ASP .Net", icon: <SiDotnet /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "MERN Stack", icon: "🌐" },
      { name: "MEAN Stack", icon: "🖥️" },
    ],
  },
  {
    title: "Full Stack Development",
    items: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Angular", icon: <FaAngular /> },
      { name: "React.js", icon: <FaReact /> },
      { name: "Vue.js", icon: <FaVuejs /> },
      { name: "MySQL", icon: <SiMysql /> },

      { name: "MongoDB", icon: <SiMongodb /> },
    ],
  },
  {
    title: "Server Management",
    items: [
      { name: "AWS", icon: <FaAws /> },
      { name: "Azure", icon: <FaMicrosoft /> },
      { name: "DevOps", icon: <FaDev /> },
    ],
  },
];

const Technologies = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // once: false makes it fade out too
  }, []);

  return (
    <div className="py-16 px-4 md:px-20 text-white relative z-10">
      <h2
        className="text-3xl md:text-5xl font-bold text-center mb-6 text-cyan-400"
        data-aos="fade-down"
      >
        Technologies We Work With
      </h2>
      <p
        className="text-center text-gray-300 max-w-3xl mx-auto mb-12"
        data-aos="fade-up"
      >
        Delivering and implementing the best of breed services and processes
        from around the world will help businesses achieve their goals.
      </p>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
        {techData.map((category, i) => (
          <div
            key={i}
            className="backdrop-blur-md rounded-xl p-6 transition-all hover:shadow-blue-500/30"
            data-aos="fade-up"
            data-aos-delay={i * 100}
            data-aos-offset="200"
            data-aos-duration="800"
          >
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-4">
              {category.items.map((tech, j) => (
                <div
                  key={j}
                  className="flex flex-col items-center justify-center w-[90px] h-[90px] bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                >
                  <div className="text-2xl mb-1 text-cyan-400">{tech.icon}</div>
                  <span className="text-xs text-center text-white">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
