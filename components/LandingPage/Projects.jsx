"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
import Badge from "@/components/ui/Badge";
import terrachowImg from "@/assets/images/terrachow.png";
import lamatfikrImg from "@/assets/images/lamatfikr.png";
import proffyemphyImg from "@/assets/images/proffyemphy.png";
import swiftratesImg from "@/assets/images/swiftrates.png";
import synapseImg from "@/assets/images/synapse.png";
import taashamImg from "@/assets/images/taasham.png";
import glamconnectImg from "@/assets/images/glamconnect.png";
import gadgetsafricaImg from "@/assets/images/360gadgets.png";
import aiWordProcessorImg from "@/assets/images/ai-word-processor.png";

const Projects = () => {
  const projects = [
    {
      title: "Terrachow",
      category: "Mobile App",
      description:
        "A food delivery platform connecting users with local vendors. Features real-time tracking, secure payments, and easy delivery management.",
      tags: ["React Native", "Node.js", "MongoDB"],
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
      category: "E-Commerce",
      description:
        "A complete e-commerce platform for gadgets and digital services. Buy airtime, data, and the latest tech with ease.",
      tags: ["React", "React Native", "Node.js"],
      role: "Team Member",
      isPrivate: true,
      image: gadgetsafricaImg,
      links: {
        website: "https://360gadgetsafrica.com/",
        playStore:
          "https://play.google.com/store/apps/details?id=com.gadgetsafrica.gadgetsafrica",
        appStore: "https://apps.apple.com/us/app/360gadgetsafrica/id6736353137",
      },
    },
    {
      title: "LamatFikr",
      category: "Social Platform",
      description:
        "A global social network with a built-in marketplace. Connects people through chats, feeds, and online shopping.",
      tags: ["Node.js", "MongoDB", "GetStream", "Next.js"],
      role: "Team Member",
      image: lamatfikrImg,
      isPrivate: true,
      links: {
        website: "https://lamatfikr.com",
      },
    },
    {
      title: "GlamConnect",
      category: "Service Marketplace",
      description:
        "A platform connecting beauty professionals with clients. Simplifies booking, portfolio showcasing, and payments.",
      tags: ["Next.js", "Flutter", "Node.js"],
      role: "Team Member",
      image: glamconnectImg,
      isPrivate: true,
      links: {
        website: "https://glamconnect.sa",
        playStore:
          "https://play.google.com/store/apps/details?id=sa.aba.glam_connect",
        appStore: "https://apps.apple.com/us/app/glamconnect/id6755059933",
      },
    },
    {
      title: "Synapse AI",
      category: "AI/ML",
      description:
        "A smart learning assistant powered by AI. Helps users study better through personalized conversations.",
      tags: ["React", "Gemini API", "React Native"],
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
      category: "Fintech",
      description:
        "A fast currency converter with live market rates. Provides accurate and up-to-date exchange information.",
      tags: ["React Native", "NativeWind", "REST API"],
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
      title: "Proffyemphy",
      category: "E-Learning",
      description:
        "An e-learning platform for students. Offers video lessons, practice tests, and progress tracking across devices.",
      tags: ["Next.js", "Electron", "React Native"],
      role: "Developer",
      image: proffyemphyImg,
      isPrivate: true,
      links: {
        website: "https://proffyemphy.vercel.app/",
        playStore:
          "https://play.google.com/store/apps/details?id=com.musamusakannike.proffyemphymobileapp",
        desktop:
          "https://pub-c55ee396a09e45e6b0bd6191ca45d178.r2.dev/proffyemphyidealacademy/desktop-1.0.0-setup.exe",
      },
    },
    {
      title: "TaasHAM",
      category: "Freelance",
      description:
        "A freelance marketplace for event planners. Features project bidding, secure payments, and user reviews.",
      tags: ["Next.js", "Payment Gateway", "Arabic RTL"],
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
      category: "AI Tool",
      description:
        "Creates Word documents from text prompts using AI. Automates document creation and formatting.",
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

  return (
    <section
      id="projects"
      className="py-24 bg-[#0A0A0A] relative border-t border-white/5"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="font-mono text-[var(--color-toxic-green)] text-sm mb-2 block">
              02. MY WORK
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              FEATURED
              <br />
              PROJECTS
            </h2>
          </div>
          <div className="mt-4 md:mt-0 max-w-sm text-right">
            <p className="text-gray-500 text-sm font-mono">
              Featured Projects
              <br />
              Total Projects: {projects.length}
            </p>
          </div>
        </div>

        {/* Projects Grid of "Cards" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              key={index}
              className="group relative bg-[#111] border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image 'Screen' */}
              <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-black">
                {project.image ? (
                  <>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                    />
                    {/* CRT/Scanline overlay for image only */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10 opacity-30"></div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/20 font-mono text-4xl">
                    NO_SIGNAL
                  </div>
                )}

                <div className="absolute top-2 right-2 z-20 flex gap-2">
                  {project.isPrivate && <Badge variant="danger">PVT</Badge>}
                  {project.isBeta && <Badge variant="warning">BETA</Badge>}
                </div>
              </div>

              {/* Content Block */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-toxic-green)] transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-gray-500">
                      {project.category} // {project.role}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-6 font-mono leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                  {project.description}
                </p>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 text-gray-400 font-mono uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] px-2 py-1 text-gray-500 font-mono">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex gap-3">
                      {project.links.website ? (
                        <Link
                          href={project.links.website}
                          target="_blank"
                          className="text-white hover:text-[var(--color-toxic-green)] transition-colors"
                          title="Launch"
                        >
                          <FaExternalLinkAlt size={16} />
                        </Link>
                      ) : null}

                      {project.links.github &&
                        (typeof project.links.github === "string" ? (
                          <Link
                            href={project.links.github}
                            target="_blank"
                            className="text-white hover:text-white/80 transition-colors"
                            title="Source"
                          >
                            <FaGithub size={18} />
                          </Link>
                        ) : (
                          <div className="flex gap-2">
                            {project.links.github.frontend && (
                              <Link
                                href={project.links.github.frontend}
                                target="_blank"
                                title="FE Source"
                              >
                                <FaCode />
                              </Link>
                            )}
                            {project.links.github.server && (
                              <Link
                                href={project.links.github.server}
                                target="_blank"
                                title="BE Source"
                              >
                                <FaServer />
                              </Link>
                            )}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-2 text-gray-400">
                      {project.links.playStore && (
                        <Link
                          href={project.links.playStore}
                          target="_blank"
                          className="hover:text-green-400"
                        >
                          <FaGooglePlay size={16} />
                        </Link>
                      )}
                      {project.links.appStore && (
                        <Link
                          href={project.links.appStore}
                          target="_blank"
                          className="hover:text-white"
                        >
                          <FaApple size={18} />
                        </Link>
                      )}
                      {project.links.desktop && (
                        <Link
                          href={project.links.desktop}
                          target="_blank"
                          className="hover:text-blue-400"
                        >
                          <FaDesktop size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
