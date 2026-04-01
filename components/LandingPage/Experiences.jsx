"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: "exp-4",
    title: "Fullstack Developer",
    company: "Cloudstech",
    location: "Remote",
    period: "Jan 2026 – Present",
    description:
      "Building high-quality web and mobile apps for global clients. I create scalable solutions and turn requirements into working software.",
    skills: ["Next.js", "Express", "MongoDB", "React Native", "Redux"],
    isCurrent: true,
  },
  {
    id: "exp-3",
    title: "Backend Developer",
    company: "360gadgetsafrica",
    location: "Remote",
    period: "Oct 2024 – Present",
    description:
      "Improved backend systems. Designed APIs, optimized databases, and made high-traffic online stores faster and more reliable.",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    isCurrent: true,
  },
  {
    id: "exp-2",
    title: "Mobile App Dev Intern",
    company: "Terrachow Logistics",
    location: "Remote",
    period: "Jan 2024 – Oct 2024",
    description:
      "Built and maintained mobile apps. Added new features for tracking deliveries and managing users.",
    skills: ["React Native", "TypeScript", "Redux"],
    isCurrent: false,
  },
  {
    id: "exp-1",
    title: "Freelance Developer",
    company: "Self-employed",
    location: "Remote",
    period: "Jan 2022 – Present",
    description:
      "Complete development for small businesses. I handle everything from planning and design to building and launching custom websites.",
    skills: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
    isCurrent: true,
  },
];

// Slight stagger offsets per card so the list feels organic, not rigid
const marginOffsets = ["0%", "5%", "0%", "5%"];

export default function Experience() {
  const sectionRef = useRef(null);
  const blobRef = useRef(null);
  const titleRef = useRef(null);

  // ── Parallax: background blob drifts up slower than scroll ─────────────
  useEffect(() => {
    const blob = blobRef.current;
    const title = titleRef.current;
    if (!blob || !title) return;

    gsap.to(blob, {
      y: "-22%",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Heading drifts up slightly faster than the section
    gsap.to(title, {
      y: -55,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "center top",
        scrub: true,
      },
    });
  }, []);

  // ── Card animations + per-card parallax ────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow fade-up
      gsap.from(".exp-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-eyebrow", start: "top 88%", once: true },
      });

      // Heading words pop in with stagger
      gsap.from(".exp-heading .word", {
        opacity: 0,
        y: 50,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".exp-heading", start: "top 88%", once: true },
      });

      // Sub text
      gsap.from(".exp-sub", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-sub", start: "top 90%", once: true },
      });

      // Timeline line draws downward
      gsap.fromTo(
        ".timeline-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".exp-cards",
            start: "top 72%",
            end: "bottom 65%",
            scrub: true,
          },
        }
      );

      // Cards: fade + slide up on entry
      document.querySelectorAll(".exp-card").forEach((card) => {
        // Entrance
        gsap.fromTo(
          card,
          { opacity: 0, y: 65 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 86%", once: true },
          }
        );

        // Continuous parallax: card drifts up gently while scrolled past
        gsap.to(card, {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        });
      });

      // Year labels: faster parallax for depth
      document.querySelectorAll(".card-year-label").forEach((el) => {
        gsap.to(el, {
          y: -55,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".exp-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      });

      // Skill pills cascade in
      document.querySelectorAll(".exp-card").forEach((card) => {
        gsap.from(card.querySelectorAll(".skill-tag"), {
          opacity: 0,
          scale: 0.78,
          duration: 0.45,
          ease: "back.out(1.8)",
          stagger: 0.055,
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="exp-section">
      {/* Parallax background blob */}
      <div ref={blobRef} className="exp-blob" />
      <div className="exp-noise" />

      <div className="exp-inner">
        {/* ── Header ── */}
        <header className="exp-header">
          <div className="exp-eyebrow eyebrow">
            <span className="eyebrowDot" />
            Experience
          </div>

          <h2 ref={titleRef} className="exp-heading">
            <span className="word">Where</span>{" "}
            <span className="word">I've</span>{" "}
            <span className="word">
              <em>worked</em>
            </span>
          </h2>

          <p className="exp-sub">
            {experiences.length} roles across startups, agencies, and
            freelance — always remote, always shipping.
          </p>
        </header>

        {/* ── Timeline + Cards ── */}
        <div className="exp-cards">
          {/* Vertical rule */}
          <div className="timeline-track">
            <div className="timeline-fill" />
          </div>

          {experiences.map((exp, i) => (
            <article
              key={exp.id}
              className="exp-card"
              style={{ marginLeft: marginOffsets[i] }}
            >
              {/* Timeline node */}
              <div className="card-node">
                <div className="node-ring" />
                <div className="node-dot" />
                {exp.isCurrent && <div className="node-ripple" />}
              </div>

              {/* Floating year — parallax element */}
              <div className="card-year-label">
                {exp.period.split("–")[0].trim()}
              </div>

              {/* Card */}
              <div className="card-body">
                {/* Header */}
                <div className="card-head">
                  <div className="card-head-left">
                    <div className="card-title-row">
                      <h3 className="card-title">{exp.title}</h3>
                      {exp.isCurrent && (
                        <span className="now-badge">
                          <span className="now-dot" />
                          Now
                        </span>
                      )}
                    </div>
                    <div className="card-meta">
                      <span className="meta-company">{exp.company}</span>
                      <span className="meta-sep" />
                      <span className="meta-location">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <span className="card-period">{exp.period}</span>
                </div>

                <hr className="card-rule" />

                <p className="card-desc">{exp.description}</p>

                <div className="card-skills">
                  {exp.skills.map((s) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span className="hint-line" />
        Scroll
      </div>

      <style jsx>{`
        /* ─── Section ─────────────────────────────────────── */
        .exp-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          font-family: "DM Sans", system-ui, -apple-system, sans-serif;
          color: #fff;
          padding: 130px 0 200px;
          overflow: hidden;
          background: #000;
        }

        /* ─── Background elements ─────────────────────────── */
        .exp-blob {
          position: absolute;
          top: -5%;
          right: -20%;
          width: 750px;
          height: 750px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.045) 0%,
            transparent 68%
          );
          will-change: transform;
          pointer-events: none;
          z-index: 0;
        }

        .exp-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.55;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
        }

        /* ─── Inner layout ────────────────────────────────── */
        .exp-inner {
          position: relative;
          z-index: 10;
          max-width: 860px;
          margin: 0 auto;
          padding: 0 56px;
        }

        /* ─── Header ──────────────────────────────────────── */
        .exp-header {
          margin-bottom: 88px;
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

        .exp-heading {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(46px, 7vw, 90px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -2.5px;
          color: #fff;
          margin-bottom: 22px;
          will-change: transform;
        }

        .word {
          display: inline-block;
        }

        .exp-heading em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.38));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .exp-sub {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.42);
          max-width: 440px;
        }

        /* ─── Cards wrapper ───────────────────────────────── */
        .exp-cards {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 44px;
          padding-left: 40px;
        }

        /* Vertical timeline rule */
        .timeline-track {
          position: absolute;
          left: 10px;
          top: 14px;
          bottom: 14px;
          width: 1px;
          background: rgba(255, 255, 255, 0.07);
          overflow: hidden;
        }

        .timeline-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            #ffffff 0%,
            rgba(255, 255, 255, 0.12) 100%
          );
          transform-origin: top center;
          transform: scaleY(0);
        }

        /* ─── Individual card ─────────────────────────────── */
        .exp-card {
          position: relative;
          will-change: transform;
        }

        /* Node */
        .card-node {
          position: absolute;
          left: -40px;
          top: 30px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .node-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.22);
          transition: border-color 0.35s, transform 0.35s;
        }

        .node-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #fff;
          position: relative;
          z-index: 1;
          transition: transform 0.3s;
        }

        .node-ripple {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          animation: ripple 2.4s ease-out infinite;
        }

        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .exp-card:hover .node-ring {
          border-color: rgba(255, 255, 255, 0.65);
          transform: scale(1.1);
        }

        .exp-card:hover .node-dot {
          transform: scale(1.15);
        }

        /* Year label */
        .card-year-label {
          position: absolute;
          left: -148px;
          top: 27px;
          font-family: "Syne", system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.18);
          white-space: nowrap;
          will-change: transform;
        }

        /* ─── Card body ───────────────────────────────────── */
        .card-body {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          padding: 30px 32px 26px;
          transition: background 0.35s, border-color 0.35s, box-shadow 0.35s,
            transform 0.35s;
        }

        .exp-card:hover .card-body {
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.13);
          box-shadow: 0 16px 56px rgba(0, 0, 0, 0.45);
          transform: translateY(-3px);
        }

        /* Card head */
        .card-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .card-head-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .card-title {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(20px, 2.6vw, 28px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .now-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.65);
        }

        .now-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #86efac;
          flex-shrink: 0;
          animation: pulse 2s ease-in-out infinite;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .meta-company {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.58);
        }

        .meta-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .meta-location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 300;
        }

        .meta-location svg {
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }

        .card-period {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.25);
          white-space: nowrap;
          font-weight: 400;
          letter-spacing: 0.02em;
          padding-top: 5px;
          flex-shrink: 0;
        }

        /* Rule */
        .card-rule {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin-bottom: 18px;
        }

        /* Description */
        .card-desc {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.82;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 22px;
        }

        /* Skills */
        .card-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          padding: 5px 13px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.03em;
          transition: background 0.2s, color 0.2s, border-color 0.2s,
            transform 0.2s;
          cursor: default;
        }

        .skill-tag:hover {
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.24);
          transform: translateY(-2px);
        }

        /* ─── Scroll hint ─────────────────────────────────── */
        .scroll-hint {
          position: absolute;
          bottom: 64px;
          left: 56px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.28);
          font-weight: 500;
          font-family: "DM Sans", system-ui, sans-serif;
        }

        .hint-line {
          width: 32px;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
        }

        .hint-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: #fff;
          transform: translateX(-100%);
          animation: slideLine 2s ease-in-out infinite 1.2s;
        }

        @keyframes slideLine {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        /* ─── Responsive ──────────────────────────────────── */
        @media (max-width: 768px) {
          .exp-inner {
            padding: 0 20px;
          }

          .exp-cards {
            padding-left: 28px;
            gap: 32px;
          }

          .card-year-label {
            display: none;
          }

          .card-head {
            flex-direction: column;
            gap: 6px;
          }

          .card-body {
            padding: 20px 18px 18px;
          }

          .scroll-hint {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}