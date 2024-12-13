"use client";
import { useState } from "react";
import { FaBriefcase, FaCalendar } from "react-icons/fa";

const Experiences = () => {
  const [activeExperience, setActiveExperience] = useState(null);

  const experiences = [
    {
      title: "Mobile App Developer Intern",
      company: "Terrachow Logistics",
      period: "Oct 2024 - Present",
      description:
        "Developed and maintained complex mobile application using React Native. Implemented new features and optimized existing codebase for better performance.",
    },
    {
      title: "Frontend Developer Intern",
      company: "WebCraft Solutions",
      period: "Jun 2022 - Dec 2022",
      description:
        "Assisted in building responsive user interfaces using React and Next.js. Collaborated with the design team to implement pixel-perfect layouts and animations.",
    },
    {
      title: "Freelance Web Developer",
      company: "Self-employed",
      period: "Jan 2022 - May 2022",
      description:
        "Created custom websites for small businesses using HTML, CSS, and JavaScript. Managed client relationships and delivered projects on time and within budget.",
    },
  ];

  return (
    <section id="experience" className="relative py-20 overflow-hidden">
      {/* Space-themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            opacity: 0.2,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white animate-fade-in-up">
          My Experiences
        </h2>
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="mb-8 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-lg shadow-lg transition-all duration-300 ${
                  activeExperience === index ? "scale-105" : "hover:scale-102"
                }`}
                onMouseEnter={() => setActiveExperience(index)}
                onMouseLeave={() => setActiveExperience(null)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2 md:mb-0">
                    {exp.title}
                  </h3>
                  <div className="flex items-center text-blue-300">
                    <FaCalendar className="mr-2" />
                    <span>{exp.period}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-300 mb-4">
                  <FaBriefcase className="mr-2" />
                  <span>{exp.company}</span>
                </div>
                <p className="text-gray-300">{exp.description}</p>
              </div>
              {index < experiences.length - 1 && (
                <div className="w-px h-8 bg-blue-400 mx-auto my-2 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
