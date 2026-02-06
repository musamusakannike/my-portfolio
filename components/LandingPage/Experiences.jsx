"use client";

import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaCalendar,
  FaMapMarkerAlt,
  FaCodeBranch,
} from "react-icons/fa";
import Badge from "@/components/ui/Badge";

const Experiences = () => {
  const experiences = [
    {
      id: "commit-4",
      hash: "7f1c9b",
      title: "Fullstack Developer",
      company: "Cloudstech",
      location: "Remote",
      period: "Jan 2026 - Present",
      description:
        "Engineering high-performance web and mobile applications for a global clientele. Architecting scalable full-stack solutions and converting complex requirements into deployed systems.",
      skills: ["Next.js", "Express", "MongoDB", "React Native", "Redux"],
      type: "feat",
    },
    {
      id: "commit-3",
      hash: "a86015",
      title: "Backend Developer",
      company: "360gadgetsafrica",
      location: "Remote",
      period: "Oct 2024 - Present",
      description:
        "backend architecture optimization. Designed RESTful APIs, optimized database queries, and implemented caching mechanisms for high-traffic commerce systems.",
      skills: ["Node.js", "Express", "MongoDB", "REST API"],
      type: "refactor",
    },
    {
      id: "commit-2",
      hash: "2a5ccf",
      title: "Mobile App Dev Intern",
      company: "Terrachow Logistics",
      location: "Remote",
      period: "Jan 2024 - Oct 2024",
      description:
        "Mobile application development and maintenance. Implemented new feature sets for logistics tracking and user management systems.",
      skills: ["React Native", "TypeScript", "Redux"],
      type: "fix",
    },
    {
      id: "commit-1",
      hash: "fc2762",
      title: "Freelance Developer",
      company: "Self-employed",
      location: "Remote",
      period: "Jan 2022 - Present",
      description:
        "Full lifecycle development for SMB clients. Managed client requirements, design, development, and deployment of custom web solutions.",
      skills: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
      type: "init",
    },
  ];

  return (
    <section
      id="experience"
      className="py-24 bg-[#0A0A0A] relative border-t border-white/5 font-mono"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <span className="text-[var(--color-toxic-green)] text-sm mb-2 block">
            03. LOGS
          </span>
          <h2 className="text-4xl font-black text-white">EXPERIENCE</h2>
        </div>

        <div className="relative">
          {/* Main timeline line */}
          <div className="absolute left-8 top-4 bottom-4 w-px bg-white/10 hidden md:block"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12"
              >
                {/* Left: Meta (Hash & Date) */}
                <div className="md:col-span-3 text-right pt-1 hidden md:block">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-xs text-gray-500">
                      {exp.hash}
                    </span>
                    <span className="text-sm text-gray-400 font-bold">
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* Center: Node/Dot */}
                <div className="absolute left-8 top-1.5 -translate-x-1/2 hidden md:flex items-center justify-center bg-[#0A0A0A] z-10">
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      exp.type === "feat"
                        ? "border-green-500 bg-green-900"
                        : exp.type === "fix"
                          ? "border-orange-500 bg-orange-900"
                          : exp.type === "refactor"
                            ? "border-blue-500 bg-blue-900"
                            : "border-gray-500 bg-gray-900"
                    }`}
                  ></div>
                </div>

                {/* Right: Content Card */}
                <div className="md:col-span-9">
                  <div className="relative p-6 border border-white/10 bg-[#111] hover:border-white/20 transition-all group">
                    <div className="absolute -left-1 top-6 w-1 h-8 bg-[var(--color-toxic-green)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-white">
                            {exp.title}
                          </h3>
                          <Badge
                            variant={
                              exp.title.includes("Intern")
                                ? "default"
                                : "accent"
                            }
                          >
                            {exp.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FaBriefcase size={12} />
                          <span className="text-white">{exp.company}</span>
                          <span className="text-gray-600">|</span>
                          <FaMapMarkerAlt size={12} />
                          <span>{exp.location}</span>
                        </div>
                        {/* Mobile Date */}
                        <div className="md:hidden mt-2 text-xs text-gray-500 font-mono">
                          {exp.period}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-1 bg-white/5 text-gray-500 font-mono border border-white/5 hover:text-white transition-colors"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 md:pl-32">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 px-4 py-2 border border-dashed border-gray-800 rounded-full">
              <FaCodeBranch />
              <span>origin/main up to date</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
