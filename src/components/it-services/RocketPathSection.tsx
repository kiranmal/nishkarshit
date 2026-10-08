"use client";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Code,
  Users,
  Brush,
  Lightbulb,
  Search,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: <Search className="w-6 h-6 text-blue-600" />,
    title: "Requirement Gathering",
    desc: "Understanding client goals, audience & vision.",
    yOffset: "0px",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: "Strategic Planning",
    desc: "Blueprinting the solution with timelines & tasks.",
    yOffset: "-20px",
  },
  {
    icon: <Brush className="w-6 h-6 text-pink-500" />,
    title: "Creative Designs",
    desc: "Building intuitive, modern, user-centric UI/UX.",
    yOffset: "10px",
  },
  {
    icon: <Users className="w-6 h-6 text-green-500" />,
    title: "Transparent Collaboration",
    desc: "Clear updates & feedback loops throughout.",
    yOffset: "-15px",
  },
  {
    icon: <Code className="w-6 h-6 text-indigo-600" />,
    title: "Robust Development",
    desc: "Efficient code with performance & security.",
    yOffset: "5px",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-teal-600" />,
    title: "Quality Assurance",
    desc: "Testing, refining & ensuring excellence.",
    yOffset: "-10px",
  },
  {
    icon: <Rocket className="w-6 h-6 text-red-500" />,
    title: "Client Satisfaction",
    desc: "Launch, support & lasting partnership.",
    yOffset: "0px",
  },
];

export default function ProcessRoadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Our Process</h2>
        <p className="text-lg text-gray-300">
          From concept to launch, we guide every step with precision,
          creativity, and transparency.
        </p>
      </div>

      {/* Timeline + floating cards */}
      <div className="relative ml-4 md:ml-10 pl-4  border-blue-500">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            style={{ transform: `translateY(${step.yOffset})` }}
            className="relative mb-12"
          >
            <div className="bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-blue-500/30 transition-shadow duration-300 w-full max-w-xl ml-4">
              {/* Icon + Title row */}
              <div className="flex items-center gap-x-4 mb-2">
                <div className="bg-slate-900 border-4 border-blue-500 rounded-full p-3 shrink-0">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-400">
                  {step.title}
                </h3>
              </div>
              {/* Description */}
              <p className="text-gray-300 pl-14">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
