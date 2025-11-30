"use client";

import { useState, useEffect } from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaBootstrap,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaDownload,
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

const AboutMe = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const skills = [
    { name: "HTML", icon: <FaHtml5 className="text-4xl text-orange-500" /> },
    { name: "CSS", icon: <FaCss3Alt className="text-4xl text-blue-500" /> },
    { name: "JavaScript", icon: <FaJs className="text-4xl text-yellow-400" /> },
    {
      name: "Bootstrap",
      icon: <FaBootstrap className="text-4xl text-purple-500" />,
    },
    {
      name: "Tailwind",
      icon: <SiTailwindcss className="text-4xl text-cyan-400" />,
    },
    { name: "jQuery", icon: <SiJquery className="text-4xl text-blue-600" /> },
    { name: "React", icon: <FaReact className="text-4xl text-blue-400" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-4xl text-white" /> },
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-4xl text-blue-600" />,
    },
    { name: "Node.js", icon: <FaNodeJs className="text-4xl text-green-500" /> },
    { name: "Express", icon: <SiExpress className="text-4xl text-gray-400" /> },
    {
      name: "MongoDB",
      icon: <SiMongodb className="text-4xl text-green-500" />,
    },
    { name: "Git", icon: <FaGitAlt className="text-4xl text-orange-600" /> },
    { name: "GitHub", icon: <FaGithub className="text-4xl text-white" /> },
    {
      name: "React Native",
      icon: <TbBrandReactNative className="text-4xl text-blue-500" />,
    },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-4 animate-fade-in-up">
            Get to know me
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-fade-in-up">
            About Me
          </h2>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl overflow-hidden glow">
            <div className="md:flex">
              {/* Left Panel - Profile */}
              <div className="md:w-1/3 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-8 flex flex-col items-center justify-center text-center border-r border-white/5">
                {/* Avatar placeholder */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-6 ring-4 ring-white/10">
                  <span className="text-4xl font-bold text-white">MM</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Musa Musa Kannike
                </h3>
                <p className="text-gray-400 mb-6">Fullstack Developer</p>
                <a
                  href="/Musa Musa Kannike CV.pdf"
                  download
                  className="group inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  <FaDownload className="text-sm group-hover:animate-bounce" />
                  Download Resume
                </a>
              </div>

              {/* Right Panel - Bio */}
              <div className="md:w-2/3 p-8 lg:p-10">
                <h4 className="text-xl font-semibold text-white mb-4">
                  Who I Am
                </h4>
                <p className="text-gray-400 leading-relaxed mb-4 animate-fade-in-up animation-delay-200">
                  I am a highly skilled and results-oriented Software Engineer
                  with a robust background in full-stack development,
                  specializing in the MERN stack. Proven ability to design,
                  develop, and deploy scalable applications for diverse sectors.
                  I am an expert in leveraging technologies such as Node.js,
                  Express, MongoDB, and the React ecosystem (React.js, Next.js,
                  React Native) to deliver successful, high-quality projects.
                </p>
                <p className="text-gray-400 leading-relaxed animate-fade-in-up animation-delay-400">
                  My expertise spans frontend, mobile and backend development, and
                  I&apos;m always eager to learn new technologies. Currently,
                  I&apos;m diving deeper into AI and Machine Learning technologies using Python.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">3+</p>
                    <p className="text-gray-500 text-sm">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">20+</p>
                    <p className="text-gray-500 text-sm">Projects Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">15+</p>
                    <p className="text-gray-500 text-sm">Happy Clients</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="bg-[#0d0d0d] p-8 border-t border-white/5">
              <h4 className="text-xl font-semibold text-white mb-6 text-center">
                My Tech Stack
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/10 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <span className="mt-2 text-sm text-gray-400 text-center group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
