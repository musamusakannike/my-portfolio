"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import dynamic from "next/dynamic";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

// Dynamically import to avoid SSR issues with Three.js
const Hero3DObject = dynamic(() => import("@/components/ui/Hero3DObject"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] flex items-center justify-center">
      <div className="w-2 h-8 bg-[var(--color-toxic-green)] animate-pulse" />
    </div>
  ),
});

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Fullstack Engineer", "AI Architect", "Technical Specialist"];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Time Indicator
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Africa/Lagos",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] pointer-events-none" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Hero3DObject variant="stars" className="w-full h-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typography & Info */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-4">
            <Badge variant="accent">AVAILABLE FOR HIRE</Badge>
            {/* <span className="font-mono text-xs text-gray-500">
              LAGOS, NG [UTC+1] — {time}
            </span> */}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-none">
            MUSA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">
              KANNIKE.
            </span>
          </h1>

          <div className="h-8 mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-xl md:text-2xl font-mono text-[var(--color-toxic-green)]"
              >
                {">"} {roles[roleIndex]}_
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="max-w-xl text-gray-400 leading-relaxed mb-10 border-l mb:border-l-2 border-white/10 pl-4 md:pl-6 text-sm md:text-base">
            I build high-quality web and mobile applications. Specializing in
            scalable systems and AI solutions, I turn complex ideas into
            reality.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="#projects"
              className="group relative px-6 py-3 bg-white text-black font-mono font-bold text-sm uppercase tracking-wide hover:bg-[var(--color-toxic-green)] transition-colors duration-300"
            >
              View Projects
            </Link>
            <Link
              href="#contact"
              className="px-6 py-3 border border-white/20 text-white font-mono text-sm uppercase tracking-wide hover:bg-white/5 transition-colors duration-300"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Object */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center" style={{ height: "480px" }}>
          <Hero3DObject />
        </div>
      </div>

      {/* Footer Scroll Indication */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono">
          Scroll down
        </span>
        <HiArrowDown />
      </motion.div>
    </section>
  );
};

export default Hero;