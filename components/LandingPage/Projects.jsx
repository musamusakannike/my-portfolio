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

const Projects = () => {
  const projects = [
    {
      title: "Synapse AI",
      subtitle: "AI-Powered Learning Assistant",
      description:
        "An intelligent learning assistant powered by Google's Gemini API. Synapse helps students and learners understand complex topics through conversational AI, providing personalized explanations and study support across web and mobile platforms.",
      tags: ["React", "Node.js", "Gemini API", "React Native", "MongoDB"],
      role: "Sole Developer",
      links: {
        website: "https://synapsebot.vercel.app",
        github: {
          frontend: "https://github.com/musamusakannike/synapse/tree/main/frontend",
          server: "https://github.com/musamusakannike/synapse/tree/main/server",
          mobile: "https://github.com/musamusakannike/synapse/tree/main/mobile",
        },
      },
    },
    {
      title: "Proffyemphy's Ideal Academy",
      subtitle: "E-Learning Platform for Nigerian Students",
      description:
        "A comprehensive learning platform designed for Nigerian students in secondary and tertiary institutions. Features include video lessons, practice tests, and progress tracking. Available on web, iOS, Android, and Windows desktop.",
      tags: ["Next.js", "React Native", "Electron", "Node.js", "MongoDB"],
      role: "Developer",
      isPrivate: true,
      links: {
        website: "https://proffyemphy.vercel.app/",
        playStore: "https://play.google.com/store/apps/details?id=com.musamusakannike.proffyemphymobileapp",
        appStore: "https://apps.apple.com/us/app/proffyemphy-ideal-academy/id6744728561",
        desktop: "https://pub-c55ee396a09e45e6b0bd6191ca45d178.r2.dev/proffyemphyidealacademy/desktop-1.0.0-setup.exe",
      },
    },
    {
      title: "Terrachow",
      subtitle: "B2C Food Logistics Platform",
      description:
        "A food logistics platform serving the Nigerian region, connecting consumers with restaurants and food vendors. Features real-time order tracking, secure payments, and seamless delivery coordination.",
      tags: ["React Native", "Node.js", "MongoDB", "Express", "REST API"],
      role: "Team Member",
      isPrivate: true,
      links: {
        website: "https://terrachow.com/",
        playStore: "https://play.google.com/store/apps/details?id=com.terrachow.terrachow",
        appStore: "https://apps.apple.com/us/app/terrachow/id1587526296",
      },
    },
    {
      title: "360GadgetsAfrica",
      subtitle: "E-Commerce & VTU Platform",
      description:
        "A comprehensive e-commerce platform for Nigerians to purchase tech gadgets from trusted vendors. Also provides VTU (Virtual Top-Up) services for airtime and data purchases, combining retail and fintech solutions.",
      tags: ["React", "React Native", "Node.js", "Payment Integration", "E-commerce"],
      role: "Team Member",
      isPrivate: true,
      links: {
        website: "https://360gadgetsafrica.com/",
        playStore: "https://play.google.com/store/apps/details?id=com.gadgetsafrica.gadgetsafrica",
        appStore: "https://apps.apple.com/us/app/360gadgetsafrica/id6736353137",
      },
    },
    {
      title: "TaasHAM",
      subtitle: "Freelance Platform for Event Planners",
      description:
        "A Saudi Arabia-based freelance marketplace connecting event planners with clients. Features include profile management, project bidding, secure payments, and review systems. Currently in closed testing phase.",
      tags: ["Next.js", "Node.js", "MongoDB", "Payment Gateway", "Arabic RTL"],
      role: "Sole Developer",
      isPrivate: true,
      isBeta: true,
      links: {
        website: "https://taasham.com",
      },
    },
  ];

  return (
    <section id="projects" className="relative py-24 overflow-hidden bg-[#0d0d0d]">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-4 animate-fade-in-up">
            My Work
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-fade-in-up">
            Featured Projects
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group glass rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with badges */}
              <div className="p-6 pb-0">
                {/* Status badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.isBeta && (
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Beta
                    </span>
                  )}
                  {project.isPrivate && (
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
                      Private Codebase
                    </span>
                  )}
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300">
                    {project.role}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{project.subtitle}</p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="px-6 flex-grow">
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Links Section */}
              <div className="p-6 pt-4 mt-auto">
                <div className="border-t border-white/10 pt-4">
                  {/* Primary Links Row */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {project.links.website && (
                      <Link
                        href={project.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                        Website
                      </Link>
                    )}
                  </div>

                  {/* App Store Links */}
                  {(project.links.playStore || project.links.appStore || project.links.desktop) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.links.playStore && (
                        <Link
                          href={project.links.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs hover:bg-white/20 transition-colors"
                        >
                          <FaGooglePlay className="text-green-400" />
                          Play Store
                        </Link>
                      )}
                      {project.links.appStore && (
                        <Link
                          href={project.links.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs hover:bg-white/20 transition-colors"
                        >
                          <FaApple className="text-gray-300" />
                          App Store
                        </Link>
                      )}
                      {project.links.desktop && (
                        <Link
                          href={project.links.desktop}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs hover:bg-white/20 transition-colors"
                        >
                          <FaDesktop className="text-blue-400" />
                          Windows
                        </Link>
                      )}
                    </div>
                  )}

                  {/* GitHub Links */}
                  {project.links.github && (
                    <div className="flex flex-wrap gap-2">
                      {typeof project.links.github === "string" ? (
                        <Link
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <FaGithub />
                          Source Code
                        </Link>
                      ) : (
                        <>
                          {project.links.github.frontend && (
                            <Link
                              href={project.links.github.frontend}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <FaCode className="text-cyan-400" />
                              Frontend
                            </Link>
                          )}
                          {project.links.github.server && (
                            <Link
                              href={project.links.github.server}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <FaServer className="text-green-400" />
                              Server
                            </Link>
                          )}
                          {project.links.github.mobile && (
                            <Link
                              href={project.links.github.mobile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <FaMobileAlt className="text-purple-400" />
                              Mobile
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  )}
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
