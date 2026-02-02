"use client";

import { useRef, useEffect } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import "react-horizontal-scrolling-menu/dist/styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const containerRef = useRef(null);

  const testimonials = [
    {
      name: "Jimoh Abdullah",
      role: "Co-founder",
      company: "Synapse AI",
      feedback:
        "Musa is an exceptional developer with a keen eye for detail. His ability to translate complex requirements into elegant code is truly impressive.",
      rating: 5,
    },
    {
      name: "Ibrahim Mubaraq",
      role: "Co-founder",
      company: "Synapse AI",
      feedback:
        "Working with Musa was a game-changer for our project. His technical skills and problem-solving abilities are top-notch.",
      rating: 5,
    },
    {
      name: "Abdulrahman Habeeb",
      role: "CEO",
      company: "360gadgetsafrica",
      feedback:
        "I hired Musa for a complex web application, and he delivered beyond my expectations. His communication and project management skills are excellent.",
      rating: 5,
    },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-[#0d0d0d]"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16 z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-cyan-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            What People Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Testimonials Carousel */}
        <div>
          <ScrollMenu>
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[400px] bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-0 p-10 mx-4 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-900/10 group"
              >
                {/* Quote Icon */}
                <div className="w-14 h-14 rounded-0 bg-cyan-500/10 flex items-center justify-center mb-8">
                  <FaQuoteLeft className="text-cyan-400 text-xl" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-cyan-500 text-sm" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-gray-300 leading-relaxed mb-8 text-base italic">
                  &quot;{testimonial.feedback}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center pt-8 border-t border-white/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-0 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                      {testimonial.name}
                    </h3>
                    <p className="text-cyan-400 text-sm font-medium">
                      {testimonial.role}
                    </p>
                    {testimonial.company && (
                      <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollMenu>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
