"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaQuoteLeft, FaCheckCircle, FaStar } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

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
  {
    name: "Adeniyi Taoheed",
    role: "CEO @ Cloudstech",
    feedback: "Musa is a very good developer. He is able to deliver projects on time and with high quality. I would recommend him for any development work.",
    verified: true,
  }
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".test-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".test-eyebrow", start: "top 88%", once: true },
      });

      gsap.from(".test-heading", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".test-heading", start: "top 88%", once: true },
      });
      
      gsap.from(".marquee-wrapper", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".marquee-wrapper", start: "top 90%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="test-section">
      <div className="test-noise" />

      <div className="test-inner">
        <header className="test-header">
          <div className="eyebrow test-eyebrow">
            <span className="eyebrowDot" />
            Testimonials
          </div>
          <h2 className="test-heading">
            What my clients <br /> <em>are saying</em>
          </h2>
        </header>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee">
          <div className="marquee-content">
            {testimonials.map((t, i) => (
              <div key={i} className="test-card">
                <FaQuoteLeft className="quote-icon" />
                <p className="test-feedback">{t.feedback}</p>
                
                <hr className="test-divider" />
                
                <div className="test-author">
                  <div className="author-info">
                    <h4 className="author-name">
                      {t.name}
                      {t.verified && <FaCheckCircle className="verified-icon" />}
                    </h4>
                    <span className="author-role">{t.role}</span>
                  </div>
                  <div className="stars">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar key={idx} className="star-icon" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Duplicate for infinite scroll */}
          <div className="marquee-content" aria-hidden="true">
            {testimonials.map((t, i) => (
              <div key={i + 10} className="test-card">
                <FaQuoteLeft className="quote-icon" />
                <p className="test-feedback">{t.feedback}</p>
                
                <hr className="test-divider" />
                
                <div className="test-author">
                  <div className="author-info">
                    <h4 className="author-name">
                      {t.name}
                      {t.verified && <FaCheckCircle className="verified-icon" />}
                    </h4>
                    <span className="author-role">{t.role}</span>
                  </div>
                  <div className="stars">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar key={idx} className="star-icon" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adding a subtle gradient fade on the sides to blend with the background */}
      <div className="fade-left" />
      <div className="fade-right" />

      <style jsx>{`
        .test-section {
          position: relative;
          width: 100%;
          min-height: 80vh;
          padding: 130px 0 160px;
          background: #000;
          overflow: hidden;
          font-family: "DM Sans", system-ui, -apple-system, sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .test-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.55;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
        }

        .test-inner {
          position: relative;
          z-index: 10;
          max-width: 860px;
          margin: 0 auto;
          padding: 0 56px;
          width: 100%;
        }

        .test-header {
          margin-bottom: 60px;
          text-align: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 28px;
        }

        .eyebrowDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .test-heading {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(40px, 6vw, 76px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -2px;
          color: #fff;
        }

        .test-heading em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.38));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Marquee */
        .marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          z-index: 2;
          display: flex;
          padding: 20px 0;
        }

        .marquee {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll 45s linear infinite;
        }
        
        .marquee:hover {
          animation-play-state: paused;
        }

        .marquee-content {
          display: flex;
          gap: 24px;
        }

        @keyframes scroll {
          to {
            transform: translateX(calc(-50% - 12px));
          }
        }

        /* Card Styles */
        .test-card {
          width: 420px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          padding: 40px 36px;
          transition: background 0.35s, border-color 0.35s, transform 0.35s, box-shadow 0.35s;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(10px);
          white-space: normal;
        }

        .test-card:hover {
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
        }

        .quote-icon {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.15);
          margin-bottom: 20px;
        }

        .test-feedback {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          flex-grow: 1;
        }

        .test-divider {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 28px 0 20px;
        }

        .test-author {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        
        .author-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .author-name {
          font-family: "Syne", system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified-icon {
          color: #3b82f6; /* Blue check mark */
          font-size: 14px;
        }

        .author-role {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        
        .stars {
          display: flex;
          gap: 4px;
        }
        
        .star-icon {
          color: #fbbf24;
          font-size: 12px;
        }

        /* Fades */
        .fade-left, .fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 15vw;
          z-index: 5;
          pointer-events: none;
        }

        .fade-left {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        }

        .fade-right {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .test-inner {
            padding: 0 24px;
          }
          
          .test-card {
            width: 320px;
            padding: 30px 24px;
          }
          
          .test-heading {
            font-size: clamp(32px, 8vw, 42px);
          }

          .fade-left, .fade-right {
            width: 8vw;
          }
        }
      `}</style>
    </section>
  );
}
