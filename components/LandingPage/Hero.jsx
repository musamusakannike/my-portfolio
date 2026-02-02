"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiArrowDown } from "react-icons/hi";
import gsap from "gsap";

const Hero = () => {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const socialRef = useRef(null);
  const decorativeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for initial load
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state hide
      gsap.set(
        [
          nameRef.current,
          titleRef.current,
          descRef.current,
          buttonsRef.current,
          socialRef.current,
        ],
        {
          opacity: 0,
          y: 50,
        },
      );

      // Decorative background elements animation
      gsap.to(".orb", {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        scale: "random(0.8, 1.2)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1,
      });

      // Main Content Animation
      tl.to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.2,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.8",
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.8",
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6",
        )
        .to(
          socialRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern with fade mask */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        ></div>

        {/* Animated Orbs */}
        <div ref={decorativeRef}>
          <div className="orb absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
          <div className="orb absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
          <div className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Greeting - Subtle */}
        <p className="text-sm md:text-base font-medium tracking-[0.2em] text-gray-400 uppercase mb-6">
          I AM
        </p>

        {/* Name - Massive & Bold */}
        <div ref={nameRef} className="mb-6 mix-blend-lighten">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-300 tracking-tighter leading-none">
            MUSA MUSA
          </h1>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 tracking-tighter leading-none mt-[-0.2em]">
            KANNIKE
          </h1>
        </div>

        {/* Title - Clean & Sharp */}
        <h2
          ref={titleRef}
          className="hidden md:block text-2xl md:text-3xl font-light text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          <span className="font-semibold text-white">Fullstack Developer</span>{" "}
          specialized in building exceptional digital experiences.
        </h2>

        {/* Description - Readable & Contrast */}
        <p
          ref={descRef}
          className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Transforming ideas into reality with{" "}
          <span className="font-semibold text-white">React</span>,{" "}
          <span className="font-semibold text-white">Next.js</span>, and{" "}
          <span className="font-semibold text-white">Node.js</span>. I build
          scalable, accessible, and performant web applications.
        </p>

        {/* CTA Buttons - Interactive */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link
            href="#projects"
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              View My Work
              <HiArrowDown className="group-hover:rotate-[-90deg] transition-transform duration-300" />
            </span>
          </Link>
          <Link
            href="#contact"
            className="group px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 hover:border-white/50"
          >
            Contact Me
          </Link>
        </div>

        {/* Social Links - Minimalist */}
        <div ref={socialRef} className="flex justify-center gap-8">
          {[
            {
              Icon: FaGithub,
              href: "https://github.com/musamusakannike",
              label: "GitHub",
            },
            {
              Icon: FaTwitter,
              href: "https://twitter.com/musa_codes",
              label: "Twitter",
            },
            {
              Icon: FaLinkedin,
              href: "https://linkedin.com",
              label: "LinkedIn",
            }, // Add LinkedIn if available or remove
          ].map(({ Icon, href, label }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-500 hover:text-white hover:scale-110 transition-all duration-300"
            >
              <Icon size={28} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
