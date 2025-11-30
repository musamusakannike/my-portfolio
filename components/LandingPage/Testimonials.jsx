"use client";

import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import "react-horizontal-scrolling-menu/dist/styles.css";

const Testimonials = () => {
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

  return (
    <section
      id="testimonials"
      className="relative py-24 overflow-hidden bg-[#0d0d0d]"
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
      <div className="absolute top-40 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-4 animate-fade-in-up">
            What People Say
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-fade-in-up">
            Testimonials
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="animate-fade-in-up animation-delay-200">
          <ScrollMenu>
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[350px] glass rounded-2xl p-8 mx-3 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <FaQuoteLeft className="text-white text-lg" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                  &quot;{testimonial.feedback}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center pt-6 border-t border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/10">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-semibold">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-gray-500 text-xs">
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
