"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);


// ─── Import images – replace with your actual paths ───────────────────────────
import terrachowImg from "@/assets/images/terrachow.png";
import lamatfikrImg from "@/assets/images/lamatfikr.png";
import proffyemphyImg from "@/assets/images/proffyemphy.png";
import swiftratesImg from "@/assets/images/swiftrates.png";
import synapseImg from "@/assets/images/synapse.png";
import taashamImg from "@/assets/images/taasham.png";
import glamconnectImg from "@/assets/images/glamconnect.png";
import gadgetsafricaImg from "@/assets/images/360gadgets.png";
import aiWordProcessorImg from "@/assets/images/ai-word-processor.png";

const projects = [
  {
    title: "Terrachow",
    category: "Mobile App",
    description:
      "A food delivery platform connecting users with local vendors. Features real-time tracking, secure payments, and easy delivery management.",
    tags: ["React Native", "Node.js", "MongoDB"],
    role: "Team Member",
    image: terrachowImg,
    isPrivate: true,
    links: {
      website: "https://store.terrachow.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.terrachow.terrachow",
      appStore: "https://apps.apple.com/us/app/terrachow/id1587526296",
    },
  },
  {
    title: "360GadgetsAfrica",
    category: "E-Commerce",
    description:
      "A complete e-commerce platform for gadgets and digital services. Buy airtime, data, and the latest tech with ease.",
    tags: ["React", "React Native", "Node.js"],
    role: "Team Member",
    isPrivate: true,
    image: gadgetsafricaImg,
    links: {
      website: "https://360gadgetsafrica.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.gadgetsafrica.gadgetsafrica",
      appStore:
        "https://apps.apple.com/us/app/360gadgetsafrica/id6736353137",
    },
  },
  {
    title: "LamatFikr",
    category: "Social Platform",
    description:
      "A global social network with a built-in marketplace. Connects people through chats, feeds, and online shopping.",
    tags: ["Node.js", "MongoDB", "GetStream", "Next.js"],
    role: "Team Member",
    image: lamatfikrImg,
    isPrivate: true,
    links: { website: "https://lamatfikr.com" },
  },
  {
    title: "GlamConnect",
    category: "Service Marketplace",
    description:
      "A platform connecting beauty professionals with clients. Simplifies booking, portfolio showcasing, and payments.",
    tags: ["Next.js", "Flutter", "Node.js"],
    role: "Team Member",
    image: glamconnectImg,
    isPrivate: true,
    links: {
      website: "https://glamconnect.sa",
      playStore:
        "https://play.google.com/store/apps/details?id=sa.aba.glam_connect",
      appStore: "https://apps.apple.com/us/app/glamconnect/id6755059933",
    },
  },
  {
    title: "Synapse AI",
    category: "AI / ML",
    description:
      "A smart learning assistant powered by AI. Helps users study better through personalized conversations.",
    tags: ["React", "Gemini API", "React Native"],
    role: "Sole Developer",
    image: synapseImg,
    links: {
      website: "https://synapse.codiac.online",
      github: {
        frontend:
          "https://github.com/musamusakannike/synapse/tree/main/frontend",
        server:
          "https://github.com/musamusakannike/synapse/tree/main/server",
        mobile:
          "https://github.com/musamusakannike/synapse/tree/main/mobile",
      },
    },
  },
  {
    title: "Swiftrates",
    category: "Fintech",
    description:
      "A fast currency converter with live market rates. Provides accurate and up-to-date exchange information.",
    tags: ["React Native", "NativeWind", "REST API"],
    role: "Developer",
    image: swiftratesImg,
    isPrivate: true,
    links: {
      website: "https://swiftrates.net",
      playStore:
        "https://play.google.com/store/apps/details?id=com.prhuzaifa.swiftReats",
      appStore: "https://apps.apple.com/us/app/swiftrates/id6752546067",
    },
  },
  {
    title: "Proffyemphy",
    category: "E-Learning",
    description:
      "An e-learning platform for students. Offers video lessons, practice tests, and progress tracking across devices.",
    tags: ["Next.js", "Electron", "React Native"],
    role: "Developer",
    image: proffyemphyImg,
    isPrivate: true,
    links: {
      website: "https://proffyemphy.vercel.app/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.musamusakannike.proffyemphymobileapp",
      desktop:
        "https://pub-c55ee396a09e45e6b0bd6191ca45d178.r2.dev/proffyemphyidealacademy/desktop-1.0.0-setup.exe",
    },
  },
  {
    title: "TaasHAM",
    category: "Freelance",
    description:
      "A freelance marketplace for event planners. Features project bidding, secure payments, and user reviews.",
    tags: ["Next.js", "Payment Gateway", "Arabic RTL"],
    role: "Team Member",
    image: taashamImg,
    isPrivate: true,
    isBeta: true,
    links: { website: "https://taasham.com" },
  },
  {
    title: "AI Word Processor",
    category: "AI Tool",
    description:
      "Creates Word documents from text prompts using AI. Automates document creation and formatting.",
    tags: ["Next.js", "Python", "Fast API", "Gemini API"],
    role: "Sole Developer",
    image: aiWordProcessorImg,
    links: {
      website: "https://ai-word-processor.vercel.app",
      github: {
        frontend:
          "https://github.com/musamusakannike/AI-Word-Processor/tree/main/frontend",
        server:
          "https://github.com/musamusakannike/AI-Word-Processor/tree/main/server",
      },
    },
  },
];

// ─── Icon components (inline SVG to avoid extra deps) ────────────────────────
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);
const IconApple = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Card component ────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  total,
}) {
  const [expanded, setExpanded] = useState(false);

  const githubLinks = project.links.github
    ? Object.entries(project.links.github).filter(([, v]) => v)
    : [];

  return (
    <div
      className="proj-card"
      data-index={index}
      style={
        {
          "--card-index": index,
          "--card-total": total,
          zIndex: index + 1,
        }
      }
    >
      {/* ── Image half ─────────────────────────────────────────────── */}
      <div className="card-media">
        <div className="card-img-wrap">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="card-img"
            style={{ objectFit: "cover" }}
          />
          <div className="card-img-overlay" />
        </div>

        {/* Floating badges on image */}
        <div className="card-num">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div className="card-cat-badge">{project.category}</div>

        {(project.isPrivate || project.isBeta) && (
          <div className="card-flags">
            {project.isPrivate && (
              <span className="flag flag-private">
                <IconLock />
                Private
              </span>
            )}
            {project.isBeta && <span className="flag flag-beta">Beta</span>}
          </div>
        )}
      </div>

      {/* ── Info half ──────────────────────────────────────────────── */}
      <div className="card-info">
        <div className="card-info-top">
          <div className="card-role-line">
            <span className="card-role">{project.role}</span>
          </div>

          <h3 className="card-title">{project.title}</h3>

          <p className="card-desc">{project.description}</p>

          {/* Tags */}
          <div className="card-tags">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="card-links">
          {project.links.website && (
            <a
              href={project.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn link-primary"
            >
              <IconGlobe />
              <span>Live Site</span>
              <span className="link-arrow">
                <IconArrow />
              </span>
            </a>
          )}

          <div className="link-row">
            {project.links.playStore && (
              <a
                href={project.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn link-ghost"
                title="Google Play"
              >
                <IconPlay />
                <span>Play Store</span>
              </a>
            )}
            {project.links.appStore && (
              <a
                href={project.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn link-ghost"
                title="App Store"
              >
                <IconApple />
                <span>App Store</span>
              </a>
            )}
            {project.links.desktop && (
              <a
                href={project.links.desktop}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn link-ghost"
                title="Desktop App"
              >
                <IconDownload />
                <span>Desktop</span>
              </a>
            )}
          </div>

          {/* GitHub sub-links */}
          {githubLinks.length > 0 && (
            <div className="github-links">
              <button
                className="github-toggle"
                onClick={() => setExpanded((p) => !p)}
                aria-expanded={expanded}
              >
                <IconGithub />
                <span>GitHub repos</span>
                <span
                  className="github-chevron"
                  style={{
                    transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  <IconArrow />
                </span>
              </button>
              {expanded && (
                <div className="github-sub">
                  {githubLinks.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-sub-link"
                    >
                      <span className="github-sub-dot" />
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ── Card shell ── */
        .proj-card {
          position: sticky;
          top: calc(80px + var(--card-index) * 14px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
          border-radius: 24px;
          overflow: hidden;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.6),
            0 1px 0 rgba(255, 255, 255, 0.06) inset;
          will-change: transform;
          transition: box-shadow 0.3s;
          margin-bottom: 0;
        }

        .proj-card:hover {
          box-shadow:
            0 16px 60px rgba(0, 0, 0, 0.8),
            0 1px 0 rgba(255, 255, 255, 0.1) inset;
        }

        /* ── Media side ── */
        .card-media {
          position: relative;
          overflow: hidden;
          min-height: 320px;
        }

        .card-img-wrap {
          position: absolute;
          inset: 0;
        }

        .card-img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .proj-card:hover .card-img {
          transform: scale(1.04);
        }

        .card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.15) 60%,
            rgba(0, 0, 0, 0.45) 100%
          );
        }

        .card-num {
          position: absolute;
          top: 20px;
          left: 22px;
          font-family: "Syne", system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.55);
          text-transform: uppercase;
        }

        .card-cat-badge {
          position: absolute;
          top: 20px;
          right: 22px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }

        .card-flags {
          position: absolute;
          bottom: 20px;
          left: 22px;
          display: flex;
          gap: 8px;
        }

        .flag {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .flag :global(svg) {
          width: 11px;
          height: 11px;
        }

        .flag-private {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(8px);
        }

        .flag-beta {
          background: rgba(255, 255, 255, 0.9);
          color: #000;
        }

        /* ── Info side ── */
        .card-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px 36px 32px;
          background: #0d0d0d;
        }

        .card-info-top {
          flex: 1;
        }

        .card-role-line {
          margin-bottom: 12px;
        }

        .card-role {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 2px;
        }

        .card-title {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -1px;
          color: #fff;
          margin-bottom: 16px;
        }

        .card-desc {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 22px;
          max-width: 400px;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
        }

        .tag {
          padding: 5px 12px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.04em;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        .tag:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* ── Links ── */
        .card-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .link-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .link-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          font-family: "DM Sans", system-ui, sans-serif;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .link-btn :global(svg) {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        .link-primary {
          background: #fff;
          color: #000;
          padding: 11px 20px;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
          width: 100%;
          justify-content: space-between;
        }

        .link-primary:hover {
          background: #e8e8e8;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 255, 255, 0.18);
        }

        .link-arrow {
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }

        .link-primary:hover .link-arrow {
          transform: translateX(3px);
        }

        .link-ghost {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.75);
          padding: 9px 16px;
        }

        .link-ghost:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          color: #fff;
          transform: translateY(-1px);
        }

        /* GitHub dropdown */
        .github-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .github-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 9px 16px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 13px;
          font-weight: 600;
          font-family: "DM Sans", system-ui, sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-align: left;
        }

        .github-toggle :global(svg) {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        .github-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .github-chevron {
          display: flex;
          align-items: center;
          margin-left: auto;
          transition: transform 0.25s ease;
        }

        .github-chevron :global(svg) {
          width: 13px;
          height: 13px;
        }

        .github-sub {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 4px 0 4px 16px;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          margin-left: 16px;
        }

        .github-sub-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .github-sub-link:hover {
          color: #fff;
        }

        .github-sub-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .proj-card {
            grid-template-columns: 1fr;
            top: calc(60px + var(--card-index) * 8px);
          }

          .card-media {
            min-height: 220px;
          }

          .card-info {
            padding: 24px 22px 24px;
          }

          .card-title {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Main Projects section ─────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // ── Lenis smooth scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onFrame = (time) => {
      lenis.raf(time * 1000); // GSAP provides seconds, Lenis expects ms
    };

    gsap.ticker.add(onFrame);

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.destroy();
    };
  }, []);

  // ── GSAP scroll animations ───────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(".proj-eyebrow", {
        opacity: 0, y: 20, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".proj-eyebrow", start: "top 88%", once: true },
      });
      gsap.from(".proj-heading", {
        opacity: 0, y: 30, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".proj-heading", start: "top 88%", once: true },
      });
      gsap.from(".proj-sub", {
        opacity: 0, y: 20, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".proj-sub", start: "top 88%", once: true },
      });

      // Progress bar
      gsap.to(".progress-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".cards-stack",
          start: "top 80px",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Track active card for counter
      projects.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.proj-card[data-index="${i}"]`,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveIdx(i);
          },
        });
      });

      // Scale-down effect on cards as they get stacked (very subtle)
      document.querySelectorAll(".proj-card").forEach((card, i) => {
        if (i < projects.length - 1) {
          gsap.to(card, {
            scale: 0.97,
            filter: "brightness(0.7)",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 80px",
              end: `+=${window.innerHeight * 0.6}`,
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="projects-bg" />

      {/* ── Header ── */}
      <div className="projects-header">
        <div className="proj-eyebrow eyebrow">
          <span className="eyebrowDot" />
          Selected work
        </div>
        <h2 className="proj-heading">
          Things I've<br />
          <em>shipped</em>
        </h2>
        <p className="proj-sub">
          {projects.length} projects spanning mobile apps, web platforms, AI tools, and beyond.
        </p>
      </div>

      {/* ── Layout: progress rail + cards ── */}
      <div className="proj-layout">
        {/* Side rail */}
        <div className="proj-rail">
          <div className="rail-track">
            <div className="progress-fill" />
          </div>
          <div className="rail-dots">
            {projects.map((p, i) => (
              <button
                key={i}
                className={`rail-dot ${i === activeIdx ? "active" : ""}`}
                onClick={() => {
                  const card = document.querySelector(`.proj-card[data-index="${i}"]`);
                  card?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                title={p.title}
                aria-label={`Jump to ${p.title}`}
              />
            ))}
          </div>
          {/* Active title label */}
          <div className="rail-label">
            <span className="rail-num">{String(activeIdx + 1).padStart(2, "0")}</span>
            <span className="rail-title">{projects[activeIdx].title}</span>
          </div>
        </div>

        {/* Cards stack */}
        <div className="cards-stack">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="proj-scroll-hint">
        <span className="scrollHintLine" />
        Scroll
      </div>

      <style jsx>{`
        /* ── Section ── */
        .projects-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          font-family: "DM Sans", system-ui, -apple-system, sans-serif;
          color: #fff;
          padding: 120px 0 240px;
          overflow: visible;
        }

        /* ── Background ── */
        .projects-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 100% 60% at 20% 10%,
            #141414 0%,
            #0a0a0a 40%,
            #000 100%
          );
          z-index: 0;
        }

        .projects-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        .projects-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.5;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        /* ── Header block ── */
        .projects-header {
          position: relative;
          z-index: 10;
          padding: 0 56px;
          margin-bottom: 72px;
          max-width: 680px;
        }

        /* Eyebrow (reused pattern) */
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

        .proj-heading {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(42px, 6vw, 80px);
          font-weight: 800;
          line-height: 0.96;
          letter-spacing: -2px;
          color: #fff;
          margin-bottom: 20px;
        }

        .proj-heading em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.4));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .proj-sub {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ── Layout ── */
        .proj-layout {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 72px 1fr;
          gap: 40px;
          padding: 0 56px;
          align-items: start;
        }

        /* ── Side rail ── */
        .proj-rail {
          position: sticky;
          top: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding-top: 8px;
        }

        .rail-track {
          width: 2px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 2px;
          transform: scaleY(0);
          transform-origin: top;
        }

        .rail-dots {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .rail-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.3s, transform 0.3s;
        }

        .rail-dot.active {
          background: #fff;
          transform: scale(1.4);
        }

        .rail-label {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }

        .rail-num {
          font-family: "Syne", system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.35);
        }

        .rail-title {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.5);
          max-height: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Cards stack ── */
        .cards-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-bottom: 120px;
        }

        /* ── Scroll hint ── */
        .proj-scroll-hint {
          position: absolute;
          bottom: 80px;
          left: 56px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          font-weight: 500;
        }

        .scrollHintLine {
          width: 32px;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .scrollHintLine::after {
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

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .projects-header {
            padding: 0 24px;
          }

          .proj-layout {
            grid-template-columns: 1fr;
            padding: 0 20px;
            gap: 24px;
          }

          .proj-rail {
            flex-direction: row;
            position: static;
            padding: 0;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .rail-track,
          .rail-label {
            display: none;
          }

          .rail-dots {
            flex-direction: row;
            margin-top: 0;
            flex-wrap: wrap;
          }

          .proj-scroll-hint {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}