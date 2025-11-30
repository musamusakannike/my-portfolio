"use client";
import { useState } from "react";
import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

const Experiences = () => {
  const [activeExperience, setActiveExperience] = useState(null);

  const experiences = [
    {
      title: "Backend Developer",
      company: "360gadgetsafrica",
      location: "Remote",
      period: "Oct 2024 - Present",
      description:
        "Designed and implemented RESTful APIs using Node.js and Express. Optimized database queries and implemented caching mechanisms for improved performance. Collaborated with cross-functional teams to deliver secure and scalable backend solutions.",
      skills: ["Node.js", "Express", "MongoDB", "REST API"],
    },
    {
      title: "Mobile App Developer Intern",
      company: "Terrachow Logistics",
      location: "Remote",
      period: "Jan 2024 - Oct 2024",
      description:
        "Developed and maintained complex mobile application using React Native. Implemented new features and optimized existing codebase for better performance.",
      skills: ["React Native", "TypeScript", "Redux"],
    },
    {
      title: "Freelance Web Developer",
      company: "Self-employed",
      location: "Remote",
      period: "Jan 2022 - Present",
      description:
        "Created custom websites for small businesses using HTML, CSS, and JavaScript. Managed client relationships and delivered projects on time and within budget.",
      skills: [
        "Next.js",
        "Tailwind CSS",
        "Node.js",
        "Express",
        "MongoDB",
        "REST API",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="relative py-24 overflow-hidden bg-[#0a0a0a]"
    >
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
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-4 animate-fade-in-up">
            My Journey
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-fade-in-up">
            Work Experience
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"></div>

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative mb-12 animate-fade-in-up ${
                index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:ml-auto"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#0a0a0a] z-10"></div>

              {/* Card */}
              <div
                className={`ml-8 md:ml-0 ${
                  index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                }`}
              >
                <div
                  className={`glass rounded-2xl p-6 transition-all duration-300 ${
                    activeExperience === index
                      ? "scale-[1.02] shadow-xl"
                      : "hover:scale-[1.01]"
                  }`}
                  onMouseEnter={() => setActiveExperience(index)}
                  onMouseLeave={() => setActiveExperience(null)}
                >
                  {/* Period badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gray-400 text-sm mb-4">
                    <FaCalendar className="text-xs" />
                    <span>{exp.period}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {exp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-xs" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-xs" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {exp.skills?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                      >
                        {skill}
                      </span>
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

export default Experiences;
