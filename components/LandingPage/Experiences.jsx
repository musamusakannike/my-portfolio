"use client";
import { useState, useRef, useEffect } from "react";
import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Experiences = () => {
  const [activeExperience, setActiveExperience] = useState(null);
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  const experiences = [
    {
      title: "Fullstack Developer",
      company: "Cloudstech",
      location: "Remote",
      period: "Jan 2026 - Present",
      description:
        "Engineering high-performance web and mobile applications for a global clientele. Responsible for architecting scalable full-stack solutions, integrating complex APIs, and delivering seamless cross-platform user experiences using modern JavaScript frameworks.",
      skills: [
        "Next.js",
        "Express",
        "MongoDB",
        "React Native",
        "Redux",
        "Tailwind CSS",
      ],
    },
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

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Line growth animation
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        },
      );

      // Experience Cards Animation
      const items = gsap.utils.toArray(".experience-item");
      items.forEach((item, index) => {
        const isLeft = index % 2 === 0;
        gsap.fromTo(
          item,
          { x: isLeft ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16 z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-cyan-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            My Journey
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Work Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-full"
          ></div>

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`experience-item relative mb-12 ${
                index % 2 === 0
                  ? "md:pr-12 md:text-right"
                  : "md:pl-12 md:ml-auto"
              } md:w-1/2 w-full pl-8 md:pl-0`}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[-5px] md:left-auto md:right-auto md:top-6 top-1 transform md:-translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-cyan-500 shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"
                style={index % 2 === 0 ? { right: "-6px" } : { left: "-6px" }}
              ></div>

              {/* Card */}
              <div
                className={`group relative bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-0 p-8 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/10 ${
                  activeExperience === index ? "border-cyan-500/50" : ""
                }`}
                onMouseEnter={() => setActiveExperience(index)}
                onMouseLeave={() => setActiveExperience(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-0 pointer-events-none" />

                <div
                  className={`flex flex-col ${index % 2 === 0 ? "md:items-end" : "md:items-start"}`}
                >
                  {/* Period badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-0 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/20">
                    <FaCalendar className="text-xs" />
                    <span>{exp.period}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {exp.title}
                  </h3>

                  <div
                    className={`flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
                  >
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-cyan-500" />
                      <span className="font-medium text-gray-300">
                        {exp.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-cyan-500" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                    {exp.description}
                  </p>

                  {/* Skills */}
                  <div
                    className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
                  >
                    {exp.skills?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-[10px] font-bold px-2 py-1 rounded-0 bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white transition-colors"
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
