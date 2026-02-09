"use client";

import { useRef } from "react";
import { FaQuoteLeft, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Jimoh Abdullah",
      role: "Co-founder @ Synapse AI",
      feedback:
        "Musa is an exceptional developer with a keen eye for detail. His ability to translate complex requirements into elegant code is truly impressive.",
      verified: true,
    },
    {
      name: "Ibrahim Mubaraq",
      role: "Co-founder @ Synapse AI",
      feedback:
        "Working with Musa was a game-changer for our project. His technical skills and problem-solving abilities are top-notch.",
      verified: true,
    },
    {
      name: "Abdulrahman Habeeb",
      role: "CEO @ 360gadgetsafrica",
      feedback:
        "I hired Musa for a complex web application, and he delivered beyond my expectations. His communication and project management skills are excellent.",
      verified: true,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 bg-[#0A0A0A] relative border-t border-white/5 font-mono"
    >
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="text-[var(--color-toxic-green)] text-sm mb-2 block">
            04. CLIENT FEEDBACK
          </span>
          <h2 className="text-3xl font-black text-white">TESTIMONIALS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={i}
              className="bg-[#111] p-6 border border-white/10 relative group hover:border-[var(--color-toxic-green)]/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1 text-[var(--color-toxic-green)] text-xs">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                {t.verified && (
                  <div className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    <FaCheckCircle size={10} />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-6 leading-relaxed italic relative z-10">
                &quot;{t.feedback}&quot;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-sm flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-[var(--color-toxic-green)] transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-[var(--color-toxic-green)] transition-colors"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
