"use client";

import { useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "TechCorp Solutions",
      feedback:
        "Musa is an exceptional developer with a keen eye for detail. His ability to translate complex requirements into elegant code is truly impressive.",
    },
    {
      name: "Alex Rodriguez",
      role: "CTO",
      company: "StartUp Innovators",
      feedback:
        "Working with Musa was a game-changer for our project. His technical skills and problem-solving abilities are top-notch.",
    },
    {
      name: "Emily Chen",
      role: "UX Designer",
      company: "DesignHub Agency",
      feedback:
        "Musa's frontend development skills brought our designs to life beautifully. His attention to user experience made our collaboration seamless.",
    },
    {
      name: "Michael Brown",
      role: "Freelance Client",
      company: null,
      feedback:
        "I hired Musa for a complex web application, and he delivered beyond my expectations. His communication and project management skills are excellent.",
    },
    {
      name: "Lisa Taylor",
      role: "Senior Developer",
      company: "CodeCraft Inc.",
      feedback:
        "As a colleague, I can attest to Musa's dedication and skill. He's always eager to learn and consistently delivers high-quality code.",
    },
  ];

  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollInterval;

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        if (
          carousel.scrollLeft + carousel.clientWidth >=
          carousel.scrollWidth
        ) {
          carousel.scrollLeft = 0;
        } else {
          carousel.scrollLeft += 1;
        }
      }, 30);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
    };

    startScroll();
    carousel.addEventListener("mouseenter", stopScroll);
    carousel.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      carousel.removeEventListener("mouseenter", stopScroll);
      carousel.removeEventListener("mouseleave", startScroll);
    };
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Space-themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px, 100px 100px",
            backgroundPosition: "0 0, 25px 25px",
            opacity: 0.2,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white animate-fade-in-up">
          Testimonials
        </h2>
        <div
          ref={carouselRef}
          className="flex overflow-x-hidden flex-auto space-x-6 pb-8 animate-fade-in-up"
          style={{ scrollBehavior: "smooth" }}
        >
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-lg shadow-lg"
            >
              <FaQuoteLeft className="text-blue-400 text-2xl mb-4" />
              <p className="text-gray-300 mb-4">{testimonial.feedback}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">
                    {testimonial.name}
                  </h3>
                  <p className="text-blue-300 text-sm">{testimonial.role}</p>
                  {testimonial.company && (
                    <p className="text-gray-400 text-sm">
                      {testimonial.company}
                    </p>
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

export default Testimonials;