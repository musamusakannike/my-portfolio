"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaGooglePlay,
  FaApple,
  FaDesktop,
  FaServer,
  FaMobileAlt,
  FaCode,
} from "react-icons/fa";
import Image from "next/image";
import terrachowImg from "@/assets/images/terrachow.png";
import lamatfikrImg from "@/assets/images/lamatfikr.png";
import proffyemphyImg from "@/assets/images/proffyemphy.png";
import swiftratesImg from "@/assets/images/swiftrates.png";
import synapseImg from "@/assets/images/synapse.png";
import taashamImg from "@/assets/images/taasham.png";
import glamconnectImg from "@/assets/images/glamconnect.png";
import aiWordProcessorImg from "@/assets/images/ai-word-processor.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  const projects = [
    {
      title: "Terrachow",
      subtitle: "B2C Food Logistics Platform",
      description:
        "A food logistics platform serving the Nigerian region, connecting consumers with restaurants and food vendors. Features real-time order tracking, secure payments, and seamless delivery coordination.",
      tags: ["React Native", "Node.js", "MongoDB", "Express", "REST API"],
      role: "Team Member",
      image: terrachowImg,
      isPrivate: true,
      links: {
        website: "https://store.terrachow.com/",
        playStore:
          "https://play.google.com/store/apps/details?id=com.terrachow.terrachow",
        appStore: "https://apps.apple.com/us/app/terrachow/id1587526296",
      },
    },

    {
      title: "360GadgetsAfrica",
      subtitle: "E-Commerce & VTU Platform",
      description:
        "A comprehensive e-commerce platform for Nigerians to purchase tech gadgets from trusted vendors. Also provides VTU (Virtual Top-Up) services for airtime and data purchases, combining retail and fintech solutions.",
      tags: [
        "React",
        "React Native",
        "Node.js",
        "Payment Integration",
        "E-commerce",
      ],
      role: "Team Member",
      isPrivate: true,
      links: {
        website: "https://360gadgetsafrica.com/",
        playStore:
          "https://play.google.com/store/apps/details?id=com.gadgetsafrica.gadgetsafrica",
        appStore: "https://apps.apple.com/us/app/360gadgetsafrica/id6736353137",
      },
    },
    {
      title: "LamatFikr",
      subtitle: "International Social & Marketplace Platform",
      description:
        "An international social site for users to chat, connect, play, sell and more. LamatFikr combines the main features of a typical social platform — profiles, feeds, real-time chat, and community interactions — with a built-in marketplace for buying and selling items. The platform focuses on rich social experiences across web and mobile, with social feeds, groups, messaging, and commerce features.",
      tags: [
        "Node.js",
        "MongoDB",
        "GetStream",
        "Express",
        "Next.js",
        "Tailwind",
      ],
      role: "Team Member",
      image: lamatfikrImg,
      isPrivate: true,
      links: {
        website: "https://lamatfikr.com",
      },
    },
    {
      title: "GlamConnect",
      subtitle: "Where Beauty Meets Opportunity",
      description:
        "GlamConnect is the next-generation platform transforming how the beauty industry connects. Whether you’re a client booking a makeup artist, an artist showcasing your craft, or a model looking to get discovered, GlamConnect delivers a frictionless, end-to-end experience built for speed, creativity, and growth.",
      tags: ["Next.js", "Node.js", "MongoDB", "Express", "REST API", "Flutter"],
      role: "Team Member",
      image: glamconnectImg,
      isPrivate: true,
      links: {
        website: "https://glamconnect.sa",
        playStore: "https://play.google.com/store/apps/details?id=sa.aba.glam_connect&pcampaignid=web_share",
        appStore: "https://apps.apple.com/us/app/glamconnect/id6755059933",
      },
    },
    {
      title: "Synapse AI",
      subtitle: "AI-Powered Learning Assistant",
      description:
        "An intelligent learning assistant powered by Google's Gemini API. Synapse helps students and learners understand complex topics through conversational AI, providing personalized explanations and study support across web and mobile platforms.",
      tags: ["React", "Node.js", "Gemini API", "React Native", "MongoDB"],
      role: "Sole Developer",
      image: synapseImg,
      links: {
        website: "https://synapsebot.vercel.app",
        github: {
          frontend:
            "https://github.com/musamusakannike/synapse/tree/main/frontend",
          server: "https://github.com/musamusakannike/synapse/tree/main/server",
          mobile: "https://github.com/musamusakannike/synapse/tree/main/mobile",
        },
      },
    },
    {
      title: "Swiftrates",
      subtitle: "Smart Currency Converter",
      description:
        "A dynamic currency converter that integrates third-party exchange rate APIs to provide live market data. Implemented custom logic for precision-based currency conversions and designed a minimalist, responsive UI focused on accessibility and intuitive navigation.",
      tags: ["React Native", "REST API", "NativeWind"],
      role: "Developer",
      image: swiftratesImg,
      isPrivate: true,
      links: {
        website: "https://swiftrates.net",
        playStore:
          "https://play.google.com/store/apps/details?id=com.prhuzaifa.swiftReats",
        appStore: "https://apps.apple.com/us/app/swiftrates/id6752546067",
      },
    },
    {
      title: "Proffyemphy's Ideal Academy",
      subtitle: "E-Learning Platform for Nigerian Students",
      description:
        "A comprehensive learning platform designed for Nigerian students in secondary and tertiary institutions. Features include video lessons, practice tests, and progress tracking. Available on web, iOS, Android, and Windows desktop.",
      tags: ["Next.js", "React Native", "Electron", "Node.js", "MongoDB"],
      role: "Developer",
      image: proffyemphyImg,
      isPrivate: true,
      links: {
        website: "https://proffyemphy.vercel.app/",
        playStore:
          "https://play.google.com/store/apps/details?id=com.musamusakannike.proffyemphymobileapp",
        appStore:
          "https://apps.apple.com/us/app/proffyemphy-ideal-academy/id6744728561",
        desktop:
          "https://pub-c55ee396a09e45e6b0bd6191ca45d178.r2.dev/proffyemphyidealacademy/desktop-1.0.0-setup.exe",
      },
    },
    {
      title: "TaasHAM",
      subtitle: "Freelance Platform for Event Planners",
      description:
        "A Saudi Arabia-based freelance marketplace connecting event planners with clients. Features include profile management, project bidding, secure payments, and review systems. Currently in closed testing phase.",
      tags: ["Next.js", "Node.js", "MongoDB", "Payment Gateway", "Arabic RTL"],
      role: "Team Member",
      image: taashamImg,
      isPrivate: true,
      isBeta: true,
      links: {
        website: "https://taasham.com",
      },
    },
    {
      title: "AI Word Processor",
      subtitle: "Create Documents with AI Magic",
      description:
        "A full-stack application designed to transform natural language prompts into professional Microsoft Word (DOCX) documents. By leveraging the Google Gemini 1.5 Flash model, the system interprets user instructions to generate and execute precise Python code, resulting in high-quality, formatted documents.",
      tags: ["Next.js", "Python", "Fast API", "Gemini API"],
      role: "Sole Developer",
      image: aiWordProcessorImg,
      links: {
        website: "https://ai-word-processor.vercel.app",
        github: {
          frontend:
            "https://github.com/musamusakannike/AI-Word-Processor/tree/main/frontend",
          server:
            "https://github.com/musamusakannike/AI-Word-Processor/tree/main/server",
        },
      },
    },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Projects Animation
      const cards = gsap.utils.toArray(".project-card");
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 transform -translate-y-1/2 left-0 w-full h-[500px] bg-gradient-to-b from-[#111] to-transparent opacity-50" />
      </div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16 z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <p className="text-cyan-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            Portfolio
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
              Works.
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card group relative bg-neutral-900/50 border border-white/5 rounded-0 overflow-hidden hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-900/20 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                    <span className="text-4xl text-white/10 font-bold">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Header with badges */}
              <div className="p-8 pb-0 z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.isBeta && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-0 border border-yellow-500/30 text-yellow-500 uppercase tracking-wide">
                      Beta
                    </span>
                  )}
                  {project.isPrivate && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-0 border border-red-500/30 text-red-500 uppercase tracking-wide">
                      Private
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-1 rounded-0 bg-white/5 text-gray-300 uppercase tracking-wide">
                    {project.role}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm font-medium text-gray-400 mb-6">
                  {project.subtitle}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2.5 py-1 rounded-0 bg-white/5 text-gray-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="px-8 flex-grow z-10">
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                  {project.description}
                </p>
              </div>

              {/* Links Section */}
              <div className="p-8 pt-6 mt-auto z-10">
                <div className="border-t border-white/5 pt-6 flex flex-wrap gap-3">
                  {project.links.website && (
                    <Link
                      href={project.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-0 bg-white text-black text-xs font-bold uppercase tracking-wide hover:bg-cyan-400 transition-colors"
                    >
                      <FaExternalLinkAlt />
                      Live Demo
                    </Link>
                  )}

                  {/* Other Links Dropdown style or simply wrapped */}
                  <div className="flex flex-wrap gap-2">
                    {/* Play Store */}
                    {project.links.playStore && (
                      <Link
                        href={project.links.playStore}
                        target="_blank"
                        className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <FaGooglePlay className="text-lg" />
                      </Link>
                    )}
                    {/* App Store */}
                    {project.links.appStore && (
                      <Link
                        href={project.links.appStore}
                        target="_blank"
                        className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <FaApple className="text-lg" />
                      </Link>
                    )}
                    {/* Desktop */}
                    {project.links.desktop && (
                      <Link
                        href={project.links.desktop}
                        target="_blank"
                        className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <FaDesktop className="text-lg" />
                      </Link>
                    )}

                    {/* GitHub */}
                    {project.links.github &&
                      (typeof project.links.github === "string" ? (
                        <Link
                          href={project.links.github}
                          target="_blank"
                          className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                          <FaGithub className="text-lg" />
                        </Link>
                      ) : (
                        <>
                          {project.links.github.frontend && (
                            <Link
                              href={project.links.github.frontend}
                              target="_blank"
                              title="Frontend Code"
                              className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
                            >
                              <FaCode className="text-lg" />
                            </Link>
                          )}
                          {project.links.github.server && (
                            <Link
                              href={project.links.github.server}
                              target="_blank"
                              title="Server Code"
                              className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-green-400 transition-colors"
                            >
                              <FaServer className="text-lg" />
                            </Link>
                          )}
                          {project.links.github.mobile && (
                            <Link
                              href={project.links.github.mobile}
                              target="_blank"
                              title="Mobile Code"
                              className="p-2 bg-white/5 rounded-0 hover:bg-white/10 text-gray-400 hover:text-purple-400 transition-colors"
                            >
                              <FaMobileAlt className="text-lg" />
                            </Link>
                          )}
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
