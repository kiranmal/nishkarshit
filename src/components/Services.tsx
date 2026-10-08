"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
const services = [
  {
    title: "Website Design & Development",
    desc: "Responsive, fast, SEO-ready websites built for growth.",
  },
  {
    title: "Digital Marketing",
    desc: "SEO, social media, and performance campaigns that convert.",
  },
  {
    title: "Software & Mobile Apps",
    desc: "Custom software and cross-platform mobile applications.",
  },
  {
    title: "CRM & ERP Development",
    desc: "Streamline operations with tailored business systems.",
  },
  {
    title: "E-commerce Solutions",
    desc: "End-to-end online store design, build, and integration.",
  },
  {
    title: "Manpower & Staffing",
    desc: "Skilled resourcing across IT, banking, and retail sectors.",
  },
  {
    title: "Banking & Fintech",
    desc: "Loan facilitation, insurance, and financial technology services.",
  },
  {
    title: "Healthcare & Pharma IT",
    desc: "Digital systems built for healthcare and pharma operations.",
  },
];
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
function ServiceCard({ title, desc }: { title: string; desc: string }) {
  /* * Main card rotation */ const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 180, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 180, damping: 20 });
  /* * Mouse position */ const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 200, damping: 20 });
  /* * Individual element movement */ const titleX = useTransform(
    smoothMouseX,
    [-1, 1],
    [-8, 8],
  );
  const titleY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);
  const imageX = useTransform(smoothMouseX, [-1, 1], [-5, 5]);
  const imageY = useTransform(smoothMouseY, [-1, 1], [-5, 5]);
  const descX = useTransform(smoothMouseX, [-1, 1], [-3, 3]);
  const descY = useTransform(smoothMouseY, [-1, 1], [-3, 3]);
  /* * Mouse movement */ const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    /* * Rotation */ const rotateYValue = ((x - centerX) / centerX) * 15;
    const rotateXValue = ((centerY - y) / centerY) * 15;
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    /* * Normalize mouse position * * -1 = left/top * 0 = center * 1 = right/bottom */ const normalizedX =
      (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };
  /* * Reset everything */ const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };
  return (
    <div style={{ perspective: "1200px" }}>
      {" "}
      <motion.div
        variants={item}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
        }}
        className=" relative min-h-[220px] rounded-xl border border-gray-100 bg-white p-5 shadow-sm cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl "
      >
        {" "}
        {/* Background glow */}{" "}
        <motion.div
          className=" absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-cyan/10 blur-2xl pointer-events-none "
          style={{ x: imageX, y: imageY, transform: "translateZ(10px)" }}
        />{" "}
        {/* Image / Placeholder */}{" "}
        <motion.div
          className=" relative z-10 w-full h-24 rounded-lg placeholder-img mb-3 "
          style={{
            x: imageX,
            y: imageY,
            transform: "translateZ(40px)",
            transformStyle: "preserve-3d",
          }}
        />{" "}
        {/* Title */}{" "}
        <motion.h3
          className=" relative z-20 font-bold text-brand-navy text-lg mb-2 "
          style={{
            x: titleX,
            y: titleY,
            transform: "translateZ(70px)",
            transformStyle: "preserve-3d",
          }}
        >
          {" "}
          {title}{" "}
        </motion.h3>{" "}
        {/* Description */}{" "}
        <motion.p
          className=" relative z-20 text-sm text-gray-500 leading-relaxed "
          style={{
            x: descX,
            y: descY,
            transform: "translateZ(45px)",
            transformStyle: "preserve-3d",
          }}
        >
          {" "}
          {desc}{" "}
        </motion.p>{" "}
        {/* Bottom decorative line */}{" "}
        <motion.div
          className=" absolute bottom-0 left-5 h-[3px] w-12 rounded-full bg-brand-cyan "
          style={{ x: titleX, transform: "translateZ(30px)" }}
        />{" "}
      </motion.div>{" "}
    </div>
  );
}
export default function Services() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
      {" "}
      {/* Section Heading */}{" "}
      <div className="text-center mb-14">
        {" "}
        <p className="text-brand-cyan font-semibold tracking-wide mb-2">
          {" "}
          What We Do{" "}
        </p>{" "}
        <h2
          className=" text-3xl md:text-4xl font-bold text-brand-navy "
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {" "}
          Our Services{" "}
        </h2>{" "}
      </div>{" "}
      {/* Services Grid */}{" "}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 "
        style={{ perspective: 1200 }}
      >
        {" "}
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            desc={service.desc}
          />
        ))}{" "}
      </motion.div>{" "}
      {/* View All Services */}{" "}
      <div className="text-center mt-12">
        {" "}
        <Link
          href="/services"
          className=" inline-flex items-center justify-center rounded-full border-2 px-7 py-2.5 text-[15px] font-semibold transition-all duration-300 hover:bg-[#d8102e] hover:text-white "
          style={{ borderColor: "#d8102e", color: "#d8102e" }}
        >
          {" "}
          View All Services{" "}
        </Link>{" "}
      </div>{" "}
    </section>
  );
}
