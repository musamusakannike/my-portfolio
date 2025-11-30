import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import ProjectOneImage from "@/assets/images/project1.png";
import ProjectTwoImage from "@/assets/images/project2.png";
import ProjectThreeImage from "@/assets/images/project3.png";
import ProjectFourImage from "@/assets/images/project4.png";
import ProjectSixImage from "@/assets/images/project6.png";
import ProjectSevenImage from "@/assets/images/project7.png";
import ProjectEightImage from "@/assets/images/project8.png";
import ProjectNineImage from "@/assets/images/project9.png";
import ProjectTenImage from "@/assets/images/project10.png";

const Projects = () => {
  const projects = [
    {
      title: "Dishful Recipe Generator",
      description:
        "Dishful is an AI-powered recipe generator that can create mouthwatering dishes from your text and images.",
      image: ProjectOneImage,
      websiteLink: "https://dishful-frontend.vercel.app/",
      githubLink: "https://github.com/musamusakannike/dishful",
      tags: ["React", "AI", "Node.js"],
    },
    {
      title: "BitHub: Social Media for Devs",
      description:
        "A platform to Connect, Share, and Engage with Like-Minded Programmers",
      image: ProjectTwoImage,
      websiteLink: "https://bithub-social.vercel.app/",
      githubLink: "https://github.com/musamusakannike/bithub",
      tags: ["Next.js", "MongoDB", "Tailwind"],
    },
    {
      title: "WatchWave: Movie App",
      description:
        "Discover latest, trending and big hit movies across a vast number of categories on WatchWave.",
      image: ProjectThreeImage,
      websiteLink: "https://watch-wave2.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["React", "API", "CSS"],
    },
    {
      title: "Creator AI",
      description:
        "Innovative AI tool for content creators, streamlining the creative process.",
      image: ProjectFourImage,
      websiteLink: "https://creatortest.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["AI", "Next.js", "OpenAI"],
    },
    {
      title: "Captain Levi",
      description:
        "A portfolio website for a web 3 based community manager and content creator.",
      image: ProjectSixImage,
      websiteLink: "https://captain-levi.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["React", "Web3", "Portfolio"],
    },
    {
      title: "CryptoDuckling: A crypto site",
      description:
        "A beautiful and responsive landing page for for a crypto project.",
      image: ProjectSevenImage,
      websiteLink: "https://crypto-ducklings.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["React", "Crypto", "Landing"],
    },
    {
      title: "CryptoDuckling: A crypto site",
      description:
        "A beautiful and responsive landing page for for a crypto project.",
      image: ProjectEightImage,
      websiteLink: "https://crypto-ducklings.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["React", "Crypto", "Landing"],
    },
    {
      title: "CryptoDuckling: A crypto site",
      description:
        "A beautiful and responsive landing page for for a crypto project.",
      image: ProjectNineImage,
      websiteLink: "https://crypto-ducklings.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["React", "Crypto", "Landing"],
    },
    {
      title: "CryptoDuckling: A crypto site",
      description:
        "A beautiful and responsive landing page for for a crypto project.",
      image: ProjectTenImage,
      websiteLink: "https://crypto-ducklings.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
      tags: ["React", "Crypto", "Landing"],
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
              className="group glass rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Link
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform"
                  >
                    <FaExternalLinkAlt className="text-lg" />
                  </Link>
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform"
                  >
                    <FaGithub className="text-lg" />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags?.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <Link
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center text-sm font-medium"
                  >
                    <FaExternalLinkAlt className="mr-2 text-xs" />
                    Live Demo
                  </Link>
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm"
                  >
                    <FaGithub className="mr-2" />
                    Source
                  </Link>
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
