"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import TerminalWindow from "@/components/ui/TerminalWindow";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

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
      {/* Background Grid - CSS handled in globals or local */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typography & Info */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-4">
            <Badge variant="accent">AVAILABLE FOR HIRE</Badge>
            <span className="font-mono text-xs text-gray-500">
              LAGOS, NG [UTC+1] — {time}
            </span>
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
            Building high-density engineering solutions. Specializing in
            scalability, AI integrations, and industrial-grade web architecture.
            Currently transforming ideas directly into deployed systems.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="#projects"
              className="group relative px-6 py-3 bg-white text-black font-mono font-bold text-sm uppercase tracking-wide hover:bg-[var(--color-toxic-green)] transition-colors duration-300"
            >
              Explore Modules
            </Link>
            <Link
              href="#contact"
              className="px-6 py-3 border border-white/20 text-white font-mono text-sm uppercase tracking-wide hover:bg-white/5 transition-colors duration-300"
            >
              Initiate Contact
            </Link>
          </div>
        </div>

        {/* Right Column: Terminal Visualization */}
        <div className="lg:col-span-5 hidden lg:block">
          <TerminalWindow title="musa-kannike:~/about">
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-300">neofetch</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="text-[var(--color-toxic-green)] whitespace-pre leading-tight">
                  {`
      /\\
     /  \\
    /    \\
   /      \\
  /________\\
  |        |
  |   __   |
  |  |  |  |
  |__|__|__|
`}
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="text-blue-400">User:</span> Musa Kannike
                  </p>
                  <p>
                    <span className="text-blue-400">Role:</span> Fullstack Dev
                  </p>
                  <p>
                    <span className="text-blue-400">Stack:</span> MERN, Next.js
                  </p>
                  <p>
                    <span className="text-blue-400">Focus:</span> AI & Perf.
                  </p>
                  <p>
                    <span className="text-blue-400">Status:</span> Coding...
                  </p>

                  <div className="flex gap-2 mt-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-400">~</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="ml-2 w-2 h-4 bg-gray-400 inline-block align-middle"
                />
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>

      {/* Footer Scroll Indication */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono">
          Scroll for logs
        </span>
        <HiArrowDown />
      </motion.div>
    </section>
  );
};

export default Hero;
