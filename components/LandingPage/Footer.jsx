"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 overflow-hidden bg-[#0a0a0a] border-t border-white/5">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Musa Musa Kannike
            </h3>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Fullstack developer passionate about creating beautiful, functional, and user-friendly web applications. Let&apos;s build something amazing together.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://github.com/musamusakannike"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href="https://linkedin.com/in/musamusakannike"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <FaLinkedin className="text-lg" />
              </a>
              <a
                href="https://twitter.com/musa_codes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href="mailto:musamusakannike@gmail.com"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <FaEnvelope className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "#" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
                { name: "Testimonials", href: "#testimonials" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:musamusakannike@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  musamusakannike@gmail.com
                </a>
              </li>
              <li>
                <span className="text-gray-400 text-sm">
                  Available for freelance
                </span>
              </li>
            </ul>
            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-6 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-all duration-300 hover:scale-110"
              aria-label="Back to top"
            >
              <FaArrowUp className="text-sm" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Musa Musa Kannike. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              Designed and built with{" "}
              <FaHeart className="text-red-500 animate-pulse" /> using Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
