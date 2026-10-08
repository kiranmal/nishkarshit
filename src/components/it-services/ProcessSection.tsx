"use client";
import React from "react";

const steps = [
  {
    number: "01",
    title: "Requirements Analysis",
    purpose:
      "Create an overview of the project, determine requirements, and set the product groundwork.",
    personnel: "Business analysts",
    output: "An SRS document that defines project goals and needs",
  },
  {
    number: "02",
    title: "Design",
    purpose:
      "Design the upcoming product (architecture, UI, features, security measures, etc.).",
    personnel: "Architects and UI/UX Designer",
    output: "A detailed DDS document that explains how to code the product",
  },
  {
    number: "03",
    title: "Software Development",
    purpose:
      "Translate the system design into source code and build the first version of the product.",
    personnel: "Developers, Project Managers",
    output: "Testable, fully functional software",
  },
  {
    number: "04",
    title: "Software Testing",
    purpose:
      "Ensure the product has no bugs or exploits and that it is in line with DDS expectations.",
    personnel: "All levels of testers",
    output: "A thoroughly tested version of the product",
  },
  {
    number: "05",
    title: "Deployment",
    purpose:
      "Push the new product into production by gradually phasing it into use.",
    personnel: "Deployment engineers",
    output: "The release of a fully functional and tested product",
  },
  {
    number: "06",
    title: "Support & Maintenance",
    purpose:
      "Keep the product safe and at optimal performance, plus occasionally add new features.",
    personnel: "Production support engineers, testers, and developers",
    output:
      "A fully monitored product that is continuously seeing improvements",
  },
];

const ProcessSection = () => {
  return (
    <section className="bg-[#0d0d0d] text-white py-20 px-6 md:px-16">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-orange-500">OUR PROCESS</p>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
          Process Designed for <span className="text-orange-500">Success</span>
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          A systematic approach to deliver high-quality software solutions that
          drive business growth
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-xl p-6 shadow-md border border-[#2a2a2a] relative overflow-hidden"
          >
            {/* Number badge */}
            <div className="text-3xl font-bold text-orange-500 mb-3">
              {step.number}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>

            {/* Purpose */}
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-bold text-white">Purpose:</span>{" "}
              {step.purpose}
            </p>

            {/* Key Personnel */}
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-bold text-white">Key Personnel:</span>{" "}
              {step.personnel}
            </p>

            {/* Output */}
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">Output:</span>{" "}
              {step.output}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
