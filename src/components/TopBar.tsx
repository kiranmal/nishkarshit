"use client";

import { Mail, Phone } from "lucide-react";
import { FacebookIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61556237244104",
  instagram: "https://www.instagram.com/nishkarsh_it/",
  linkedin:
    "https://www.linkedin.com/company/nishkarsh-it-solution-private-limited",
};
const tickerItems = [
  "GOVERNMENT PROJECTS",
  "MANPOWER",
  "INSURANCE",
  "HEALTHCARE",
  "RETAIL",
  "PHARMA",
  "BANKING",
  "EDUCATION",
  "INFORMATION TECHNOLOGY",
];

export default function TopBar() {
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-[#00AEEF] text-white text-[15px] font-medium h-13 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex items-center gap-6 px-4 py-2 h-full">
        {/* Scrolling ticker */}
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap gap-10 w-max">
            {loop.map((item, i) => (
              <span key={i} className="tracking-wide">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <button className="border border-white/70 rounded px-1 py-3 text-[45] font-semibold hover:bg-white hover:text-brand-cyan transition-colors">
            <a href="/#enquiry">Business Enquiry</a>
          </button>
          <a
            href="mailto:info@nishkarshit.com"
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            <Mail size={14} />
            info@nishkarshit.com
          </a>
          <a
            href="tel:01169270913"
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            <Phone size={14} />
            011 6927 0913
          </a>
          <div className="flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <FacebookIcon
                size={18}
                className="hover:opacity-80 cursor-pointer"
              />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <LinkedinIcon
                size={18}
                className="hover:opacity-80 cursor-pointer"
              />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <InstagramIcon
                size={18}
                className="hover:opacity-80 cursor-pointer"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
