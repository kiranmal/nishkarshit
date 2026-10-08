"use client";

import {
  Cloud,
  Server,
  MonitorCog,
  Settings,
  Activity,
  Database,
  ShieldCheck,
  Lock,
  Code2,
  HardDrive,
  Boxes,
  BriefcaseBusiness,
} from "lucide-react";

const cloudServices = [
  // Cloud & Dedicated Servers
  {
    category: "Cloud & Dedicated Servers",
    title: "Windows Cloud Server",
    description: "Scale Smarter, Powered by Windows Confidence",
    icon: Server,
  },
  {
    category: "Cloud & Dedicated Servers",
    title: "Linux Cloud Server",
    description: "Fast, Flexible, and Reliable Linux Cloud Power",
    icon: Cloud,
  },
  {
    category: "Cloud & Dedicated Servers",
    title: "Windows Dedicated Server",
    description: "Dedicated Windows Servers for Maximum Efficiency",
    icon: MonitorCog,
  },
  {
    category: "Cloud & Dedicated Servers",
    title: "Linux Dedicated Server",
    description: "Maximize Performance with Linux Dedicated Servers",
    icon: HardDrive,
  },

  // DevOps & Infrastructure
  {
    category: "DevOps & Infrastructure",
    title: "CI/CD Pipeline",
    description: "Speed up delivery without compromising quality",
    icon: Settings,
  },
  {
    category: "DevOps & Infrastructure",
    title: "Infrastructure as Code",
    description: "Manage infra using code (Terraform, AWS CloudFormation)",
    icon: Code2,
  },
  {
    category: "DevOps & Infrastructure",
    title: "Infrastructure Monitoring",
    description: "Track health and uptime with real-time monitoring",
    icon: Activity,
  },

  // Cloud & Software Services
  {
    category: "Cloud & Software Services",
    title: "AWS Compute",
    description: "Accelerate business growth with AWS DevOps",
    icon: Cloud,
  },
  {
    category: "Cloud & Software Services",
    title: "AWS Storage",
    description: "Reinvent your business model with scalable cloud adoption",
    icon: Database,
  },
  {
    category: "Cloud & Software Services",
    title: "Microsoft Office 365",
    description: "Affordable Pricing, Premium Productivity",
    icon: BriefcaseBusiness,
  },
  {
    category: "Cloud & Software Services",
    title: "Microsoft Azure Cloud",
    description: "Seamless Cloud Management with Azure Services",
    icon: Boxes,
  },

  // Security & Protection
  {
    category: "Security & Protection",
    title: "SSL Certificate",
    description: "Secure your website - In Just INR 999/year",
    icon: Lock,
  },
  {
    category: "Security & Protection",
    title: "Sophos Endpoint",
    description: "Endpoint protection for systems & servers",
    icon: ShieldCheck,
  },
  {
    category: "Security & Protection",
    title: "Application Security",
    description: "CI/CD-integrated DevSecOps security testing",
    icon: ShieldCheck,
  },
];

const categories = [
  "Cloud & Dedicated Servers",
  "DevOps & Infrastructure",
  "Cloud & Software Services",
  "Security & Protection",
];

export default function CloudComputing() {
  return (
    <section
      className="
        py-16
        
        px-6
        bg-gradient-to-br
        from-slate-900
        via-sky-950
        to-gray-900
        text-white
      "
    >
      <div className="w-full">
        {/* Main Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-bold text-amber-500 mb-12">
          Powerful Server & Cloud Solutions
        </h1>

        {categories.map((category) => {
          const services = cloudServices.filter(
            (service) => service.category === category,
          );

          return (
            <div key={category} className="mb-12">
              {/* Category Heading */}
              <h2
                className="
                  text-2xl
                  font-semibold
                  mb-6
                  border-b
                  pb-2
                  text-amber-100
                  border-pink-500
                "
              >
                {category}
              </h2>

              {/* Cards */}
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-6
                "
              >
                {services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <div
                      key={service.title}
                      className="
                        p-6
                        rounded-2xl
                        shadow
                        hover:shadow-lg
                        border
                        border-gray-200
                        dark:border-gray-700
                        bg-white
                        dark:bg-[#1c1c1c]
                        transition-all
                        duration-300
                        hover:-translate-y-1
                      "
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Icon
                          size={34}
                          strokeWidth={2}
                          className="text-blue-600 shrink-0"
                        />

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.title}
                        </h3>
                      </div>

                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
