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
    { name: "Next.js", icon: <SiNextdotjs className="text-4xl text-black" /> },
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-4xl text-blue-600" />,
    },
    { name: "Node.js", icon: <FaNodeJs className="text-4xl text-green-500" /> },
    { name: "Express", icon: <SiExpress className="text-4xl text-gray-500" /> },
    {
      name: "MongoDB",
      icon: <SiMongodb className="text-4xl text-green-500" />,
    },
    { name: "Git", icon: <FaGitAlt className="text-4xl text-orange-600" /> },
    { name: "GitHub", icon: <FaGithub className="text-4xl text-gray-800" /> },
    {
      name: "React Native",
      icon: <TbBrandReactNative className="text-4xl text-blue-500" />,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0D17] via-[#1A1A40] to-[#3A0CA3]">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 container mx-auto px-8 py-16 sm:px-16 md:py-24 lg:py-32 text-white">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-in-up">
          About Me
        </h2>
        <div className="max-w-4xl mx-auto bg-white bg-opacity-10 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white flex flex-col text-center items-center justify-center">
              <h3 className="text-2xl lg:text-3xl font-semibold">
                Musa Musa Kannike
              </h3>
              <p className="mt-2">Fullstack Developer</p>
              <a
                href="#"
                className="bg-[#1A1A40] px-3 py-2 rounded-full text-lg font-bold mt-2"
              >
                Download Resume
              </a>
            </div>
            <div className="p-8">
              <p className="text-gray-200 leading-relaxed animate-fade-in-up animation-delay-200">
                Hello! I'm Musa, an 18-year-old passionate fullstack developer
                with a love for coding. My journey in the world of programming
                has been exciting, and I'm constantly expanding my skills and
                knowledge. I specialize in creating responsive and dynamic web
                applications using a variety of modern technologies.
              </p>
              <p className="mt-4 text-gray-200 leading-relaxed animate-fade-in-up animation-delay-400">
                My expertise spans both frontend and backend development, and
                I'm always eager to learn new technologies. Currently, I'm
                diving deeper into mobile app development with React Native,
                exploring new ways to create seamless cross-platform
                experiences.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0B0D17] via-[#1A1A40] to-[#3A0CA3] p-8">
            <h4 className="text-xl font-semibold text-white mb-4">
              My Tech Stack
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-white bg-opacity-10 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill.icon}
                  <span className="mt-2 text-sm text-white text-center">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
