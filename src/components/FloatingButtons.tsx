"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircleMore } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed left-5 bottom-6 z-40 flex flex-col gap-3">
      <motion.a
        href="https://wa.me/911169270913"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircleMore size={22} />
      </motion.a>
      <a
        href="tel:01169270913"
        aria-label="Call"
        className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
