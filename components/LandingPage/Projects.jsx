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

const Projects = () => {
  const projects = [
    {
      title: "Dishful Recipe Generator",
      description:
        "Dishful is an AI-powered recipe generator that can create mouthwatering dishes from your text and images.",
      image: ProjectOneImage,
      websiteLink: "https://dishful-frontend.vercel.app/",
      githubLink: "https://github.com/musamusakannike/dishful",
    },
    {
      title: "BitHub: Social Media for Devs",
      description:
        "A platform to Connect, Share, and Engage with Like-Minded Programmers",
      image: ProjectTwoImage,
      websiteLink: "https://bithub-social.vercel.app/",
      githubLink: "https://github.com/musamusakannike/bithub",
    },
    {
      title: "WatchWave: Movie App",
      description:
        "Discover latest, trending and big hit movies across a vast number of categories on WatchWave.",
      image: ProjectThreeImage,
      websiteLink: "https://watch-wave2.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
    },
    {
      title: "Creator AI",
      description:
        "Innovative AI tool for content creators, streamlining the creative process.",
      image: ProjectFourImage,
      websiteLink: "https://creatortest.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
    },
    {
      title: "Captain Levi",
      description:
        "A portfolio website for a web 3 based community manager and content creator.",
      image: ProjectSixImage,
      websiteLink: "https://captain-levi.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
    },
    {
      title: "CryptoDuckling: A crypto site",
      description:
        "A beautiful and responsive landing page for for a crypto project.",
      image: ProjectSevenImage,
      websiteLink: "https://crypto-ducklings.vercel.app/",
      githubLink: "https://github.com/musamusakannike/watchwave",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Space-themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px)",
            backgroundSize: "550px 550px",
            backgroundPosition: "0 0,40px 60px",
            opacity: 0.1,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white animate-fade-in-up">
          My Projects
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg backdrop-filter backdrop-blur-lg transition-transform duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <Link
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Visit Site
                  </Link>
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-300 flex items-center"
                  >
                    <FaGithub className="mr-2" />
                    View Code
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
