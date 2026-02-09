"use client";

import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaPython,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiJquery,
  SiNextdotjs,
  SiTypescript,
  SiExpress,
  SiMongodb,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import Badge from "@/components/ui/Badge";
import TerminalWindow from "@/components/ui/TerminalWindow";

const AboutMe = () => {
  const skills = [
    { name: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
    { name: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
    { name: "Python", icon: <FaPython className="text-blue-300" /> },
    { name: "React", icon: <FaReact className="text-cyan-400" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
    {
      name: "React Native",
      icon: <TbBrandReactNative className="text-cyan-400" />,
    },
    { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
    { name: "Express", icon: <SiExpress className="text-white" /> },
    { name: "MongoDB", icon: <SiMongodb className="text-green-400" /> },
    { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-300" /> },
    { name: "Git", icon: <FaGitAlt className="text-orange-500" /> },
    { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-[#0A0A0A] relative border-t border-white/5 font-mono"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Col: Identity */}
        <div>
          <div className="mb-12">
            <span className="text-[var(--color-toxic-green)] text-sm mb-2 block">
              01. ABOUT ME
            </span>
            <h2 className="text-4xl font-black text-white">WHO I AM</h2>
          </div>

          <div className="p-1 border border-white/10 inline-block mb-8">
            <div className="w-32 h-32 bg-[#111] flex items-center justify-center border border-white/5 relative overflow-hidden group">
              {/* Scanline */}
              <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none"></div>
              <span className="text-4xl font-bold text-gray-700 group-hover:text-white transition-colors">
                MM
              </span>
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
            </div>
          </div>

          <div className="space-y-6 text-gray-400 leading-relaxed font-sans text-lg">
            <p>
              <strong className="text-white">Musa Musa Kannike</strong> is a
              passionate Fullstack Engineer focused on building robust and
              user-friendly applications.
            </p>
            <p>
              I focus on creating seamless experiences. My goal is to build
              software that is both powerful and easy to use. I am currently
              exploring AI to make applications smarter.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href="/Musa Musa Kannike CV.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm uppercase hover:bg-[var(--color-toxic-green)] transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Right Col: Tech Arsenal (Terminal Style) */}
        <div className="lg:pt-20">
          <TerminalWindow title="musa-kannike:~/skills">
            <div className="mb-4 text-gray-500 text-xs">
              Last login: {new Date().toDateString()} on ttys001
            </div>
            <div className="mb-4">
              <span className="text-green-500">➜</span>{" "}
              <span className="text-blue-400">~</span>{" "}
              <span className="text-yellow-300">list-skills</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2 p-2 hover:bg-white/5 transition-colors cursor-default"
                >
                  <span className="text-lg">{skill.icon}</span>
                  <span className="text-xs text-gray-300">{skill.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 mb-2">
              <span className="text-green-500">➜</span>{" "}
              <span className="text-blue-400">~</span>{" "}
              <span className="text-yellow-300">echo $CURRENT_FOCUS</span>
            </div>
            <div className="text-gray-300 text-xs">
              "Artificial Intelligence", "Large Language Models", "System
              Architecture"
            </div>

            <div className="mt-4">
              <span className="text-green-500">➜</span>{" "}
              <span className="text-blue-400">~</span>{" "}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="ml-2 w-2 h-4 bg-gray-400 inline-block align-middle"
              />
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
