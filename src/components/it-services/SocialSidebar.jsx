import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils"; // Optional: if you're using clsx/twMerge utilities

const SocialSidebar = ({ orientation = "vertical" }) => {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "z-30 gap-4 p-2 text-white",
        isVertical ? "flex flex-col" : "flex flex-row",
      )}
    >
      <a
        href="https://www.facebook.com/people/Nishkarsh-It-Solution-Private-Limited/61556237244104/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook size={24} />
      </a>
      <a
        href="https://www.linkedin.com/company/nishkarsh-it-solution-private-limited/?viewAsMember=true"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin size={24} />
      </a>
      <a
        href="https://www.instagram.com/accounts/login/?next=%2Fnishkarsh_it%2F&source=omni_redirect"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram size={24} />
      </a>
    </div>
  );
};

export default SocialSidebar;
