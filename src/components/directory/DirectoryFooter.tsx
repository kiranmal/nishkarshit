import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FacebookIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";

const vehicles = ["🚌", "🚗", "🚑", "🚚", "🚕", "🚐"];

export default function DirectoryFooter() {
  return (
    <footer>
      {/* Animated transportation strip */}
      <div className="relative h-16 md:h-20 overflow-hidden bg-gradient-to-b from-sky-300 to-sky-200">
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-500" />
        <div className="absolute bottom-0 left-0 w-full h-[3px] border-t-2 border-dashed border-yellow-300" />
        <div className="flex items-center gap-10 whitespace-nowrap animate-[scroll-x_18s_linear_infinite] absolute bottom-1">
          {[...vehicles, ...vehicles, ...vehicles, ...vehicles].map((v, i) => (
            <span key={i} className="text-3xl md:text-4xl">
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#05070f] text-white">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                SRM
              </div>
              <span className="font-bold text-lg">Nishkarsh IT Solution</span>
            </div>
            <p className="text-sm text-white/50 mb-4">
              The next generation of technology
            </p>
            <p className="text-sm text-white/60 mb-4">
              Professional IT solutions, software development and business
              directory services.
            </p>
            <div className="flex gap-3">
              {[FacebookIcon, InstagramIcon, LinkedinIcon, MessageCircle].map((Icon, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <Icon size={16} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/directory" className="hover:text-white">Home</Link></li>
              <li><Link href="/directory/listings" className="hover:text-white">Listings</Link></li>
              <li><Link href="/directory/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/directory/blogs" className="hover:text-white">Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white">About Us</Link></li>
              <li><Link href="/" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Nishkarsh IT Solution Private Limited, Noida Sector 3, Uttar Pradesh 201301</li>
              <li>+91 9219572223</li>
              <li>info@nishkarshit.com</li>
              <li>www.nishkarshit.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40 max-w-[1300px] mx-auto">
          <span>© 2026 Nishkarsh IT Solution Private Limited. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white">Privacy Policy</Link>
            <Link href="/" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
