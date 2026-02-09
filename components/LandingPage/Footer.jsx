"use client";

import Link from "next/link";
import {
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaLinkedin,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 font-mono relative overflow-hidden">
      {/* Scanlines generic */}
      <div className="absolute inset-0 bg-scanline opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-black text-white tracking-tighter mb-4 block"
            >
              MUSA<span className="text-[var(--color-toxic-green)]">_</span>
              KANNIKE
            </Link>
            <p className="text-gray-500 text-sm max-w-sm mb-6">
              Deployed from Lagos, Nigeria. <br />
              Building high-quality web applications and AI systems.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/musamusakannike"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://twitter.com/musa_codes"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="mailto:musamusakannike@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-bold mb-4 text-sm">NAVIGATION</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link
                  href="#about"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  href="#projects"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="#experience"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 flex flex-col justify-between">
            <div className="text-right">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs text-[var(--color-toxic-green)] hover:underline"
              >
                Back to Top <FaArrowUp />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>
            SYSTEM_STATUS: <span className="text-green-500">ONLINE</span>
          </p>
          <p>&copy; {currentYear} MUSA KANNIKE. MIT LICENSE.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
