"use client";

import { useEffect, useRef } from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaDownload,
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
  const containerRef = useRef(null);
  const profileRef = useRef(null);
  const contentRef = useRef(null);
  const skillsRef = useRef(null);

  const skills = [
    { name: "HTML", icon: <FaHtml5 className="text-4xl text-orange-500" /> },
    { name: "CSS", icon: <FaCss3Alt className="text-4xl text-blue-500" /> },
    { name: "JavaScript", icon: <FaJs className="text-4xl text-yellow-400" /> },
    {
      name: "Python",
      icon: <FaPython className="text-4xl text-purple-500" />,
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
    { name: "Express", icon: <SiExpress className="text-4xl text-white" /> }, // Changed color to white for visibility
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

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Profile Section Animation
      gsap.fromTo(
        profileRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        },
      );

      // Content Section Animation relative to Profile
      gsap.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        },
      );

      // Skills Animation
      gsap.fromTo(
        skillsRef.current.children,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: {
            amount: 1,
            grid: "auto",
            from: "center",
          },
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 85%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background Stylings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px]" />
        <div className="absolute left-0 bottom-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-cyan-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            About Me
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Who I Am
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div className="md:flex">
              {/* Left Panel - Profile */}
              <div
                ref={profileRef}
                className="md:w-1/3 bg-black/40 p-10 flex flex-col items-center justify-center text-center border-r border-white/5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />

                {/* Avatar */}
                <div className="relative z-10 w-40 h-40 rounded-full p-1 bg-cyan-400 mb-8 shadow-lg shadow-cyan-500/20">
                  <div className="relative w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {/* <span className="text-5xl font-bold text-white">MM</span> */}
                    <Image
                      src="https://i.ibb.co/35KsGPxW/compressed.png"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <h3 className="relative z-10 text-2xl font-bold text-white mb-2">
                  Musa Musa Kannike
                </h3>
                <p className="relative z-10 text-cyan-400 font-medium mb-8">
                  Fullstack Developer
                </p>

                <a
                  href="/Musa Musa Kannike CV.pdf"
                  download
                  className="relative z-10 group inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-cyan-50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <FaDownload className="text-sm group-hover:translate-y-0.5 transition-transform" />
                  Download Resume
                </a>
              </div>

              {/* Right Panel - Bio */}
              <div className="md:w-2/3 p-10 lg:p-12">
                <div ref={contentRef}>
                  <h4 className="text-2xl font-bold text-white mb-6">
                    Passionate about building scalable solutions.
                  </h4>
                  <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                    I am a highly skilled and results-oriented Software Engineer
                    with a robust background in full-stack development,
                    specializing in the MERN stack. I have a proven ability to
                    design, develop, and deploy scalable applications for
                    diverse sectors.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                    My expertise spans frontend, mobile and backend development.
                    Currently, I&apos;m diving deeper into AI and Machine
                    Learning technologies using Python to build the next
                    generation of intelligent applications.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                    <div>
                      <p className="text-4xl font-bold text-white mb-1">3+</p>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        Years Exp.
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-white mb-1">20+</p>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        Projects
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-white mb-1">15+</p>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        Happy Clients
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="bg-black/20 p-10 border-t border-white/5">
              <h4 className="text-xl font-bold text-white mb-8 text-center">
                Technical Arsenal
              </h4>
              <div
                ref={skillsRef}
                className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-6"
              >
                {skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-cyan-500/30 hover:-translate-y-1 relative"
                  >
                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                      {skill.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-400 group-hover:text-cyan-400 transition-colors">
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
