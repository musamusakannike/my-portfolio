"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaArrowUp } from "react-icons/fa";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom-=100",
          }
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative py-20 overflow-hidden bg-[#050505] border-t border-white/5">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16 z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-6">
              Musa Musa<span className="text-cyan-400">.</span>
            </h3>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
              Fullstack developer crafting digital experiences that matter. Open to new opportunities and collaborations.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { Icon: FaGithub, href: "https://github.com/musamusakannike" },
                { Icon: FaTwitter, href: "https://twitter.com/musa_codes" },
                { Icon: FaEnvelope, href: "mailto:musamusakannike@gmail.com" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-300"
                >
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Explore
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:musamusakannike@gmail.com"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-base break-all"
                >
                  musamusakannike@gmail.com
                </a>
              </li>
              <li>
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                  Available for work
                </span>
              </li>
            </ul>
            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-8 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Back to top"
            >
              <FaArrowUp className="text-lg" />
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
              Built with <FaHeart className="text-red-500 animate-pulse" /> using Next.js & GSAP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
