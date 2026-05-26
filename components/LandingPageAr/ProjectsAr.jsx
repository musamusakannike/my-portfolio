"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

import terrachowImg from "@/assets/images/terrachow.png";
import lamatfikrImg from "@/assets/images/lamatfikr.png";
import proffyemphyImg from "@/assets/images/proffyemphy.png";
import swiftratesImg from "@/assets/images/swiftrates.png";
import synapseImg from "@/assets/images/synapse.png";
import taashamImg from "@/assets/images/taasham.png";
import glamconnectImg from "@/assets/images/glamconnect.png";
import gadgetsafricaImg from "@/assets/images/360gadgets.png";
import aiWordProcessorImg from "@/assets/images/ai-word-processor.png";
import cloudstechImg from "@/assets/images/cloudstech.png";
import quranicImg from "@/assets/images/quranic.png";
import bbosspayImg from "@/assets/images/bbosspay.png";

const projects = [
  {
    title: "تيراتشو",
    category: "تطبيق هاتف",
    description:
      "منصة توصيل طعام تربط المستخدمين مع البائعين المحليين. تتميز بالتتبع في الوقت الفعلي، المدفوعات الآمنة، وسهولة إدارة التوصيل.",
    tags: ["React Native", "Node.js", "MongoDB"],
    role: "عضو فريق",
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
    category: "تجارة إلكترونية",
    description:
      "منصة تجارة إلكترونية كاملة للأجهزة والخدمات الرقمية. اشترِ رصيد المكالمات والبيانات وأحدث التقنيات بسهولة.",
    tags: ["React", "React Native", "Node.js"],
    role: "عضو فريق",
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
    title: "Cloudstech",
    category: "وكالة برمجيات وذكاء اصطناعي",
    description: "وكالة برمجيات وذكاء اصطناعي دولية تبني حلولاً مبتكرة للشركات.",
    tags: ["Next.js", "Gemini API", "Supabase"],
    role: "عضو فريق",
    image: cloudstechImg,
    isPrivate: true,
    links: {
      website: "https://www.cloudstech.org/",
    },
  },
  {
    title: "Quranic",
    category: "تطبيق هاتف",
    description: "تطبيق إسلامي يساعد المستخدمين على استكشاف القرآن الكريم مع ترجمات وتلاوات جميلة.",
    tags: ["React Native", "Node.js", "MongoDB"],
    role: "مطور وحيد",
    image: quranicImg,
    isPrivate: true,
    links: {
      website: "https://quranic.expo.app/",
      playStore: "https://play.google.com/store/apps/details?id=com.codiac.quranic",
      appStore: "https://apps.apple.com/ng/app/quranic-read-listen/id6760474571",
    },
  },
  {
    title: "BBossPay",
    category: "منصة شحن افتراضية",
    description: "منصة شحن افتراضية مقرها نيجيريا لشراء البيانات ورصيد المكالمات والفواتير بأسعار رخيصة.",
    tags: ["Next.js", "React Native", "Node.js"],
    role: "مطور",
    isPrivate: true,
    image: bbosspayImg,
    links: {
      website: "https://www.bbosspay.com/",
    },
  },
  {
    title: "LamatFikr",
    category: "منصة اجتماعية",
    description:
      "شبكة اجتماعية عالمية مع سوق مدمج. يربط الناس من خلال الدردشات والموجزات والتسوق عبر الإنترنت.",
    tags: ["Node.js", "MongoDB", "GetStream", "Next.js"],
    role: "عضو فريق",
    image: lamatfikrImg,
    isPrivate: true,
    links: { website: "https://lamatfikr.com" },
  },
  {
    title: "GlamConnect",
    category: "سوق خدمات",
    description:
      "منصة تربط محترفي التجميل بالعملاء. تبسط الحجز، وعرض الأعمال، والمدفوعات.",
    tags: ["Next.js", "Flutter", "Node.js"],
    role: "عضو فريق",
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
    category: "ذكاء اصطناعي",
    description:
      "مساعد تعليمي ذكي مدعوم بالذكاء الاصطناعي. يساعد المستخدمين على الدراسة بشكل أفضل من خلال محادثات مخصصة.",
    tags: ["React", "Gemini API", "React Native"],
    role: "مطور وحيد",
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
    category: "تقنية مالية",
    description:
      "محول عملات سريع مع أسعار السوق المباشرة. يوفر معلومات صرف دقيقة ومحدثة.",
    tags: ["React Native", "NativeWind", "REST API"],
    role: "مطور",
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
    category: "تعليم إلكتروني",
    description:
      "منصة تعليم إلكتروني للطلاب. تقدم دروس فيديو، واختبارات تجريبية، وتتبع التقدم عبر الأجهزة.",
    tags: ["Next.js", "Electron", "React Native"],
    role: "مطور",
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
    category: "عمل حر",
    description:
      "سوق عمل حر لمنظمي الفعاليات. يتميز بالمزايدة على المشاريع، والمدفوعات الآمنة، وتقييمات المستخدمين.",
    tags: ["Next.js", "Payment Gateway", "Arabic RTL"],
    role: "عضو فريق",
    image: taashamImg,
    isPrivate: true,
    isBeta: true,
    links: { website: "https://taasham.com" },
  },
  {
    title: "AI Word Processor",
    category: "أداة ذكاء اصطناعي",
    description:
      "ينشئ مستندات وورد من توجيهات نصية باستخدام الذكاء الاصطناعي. يؤتمت إنشاء المستندات وتنسيقها.",
    tags: ["Next.js", "Python", "Fast API", "Gemini API"],
    role: "مطور وحيد",
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

function ProjectCard({ project, index, total }) {
  const [expanded, setExpanded] = useState(false);

  const githubLinks = project.links.github
    ? Object.entries(project.links.github).filter(([, v]) => v)
    : [];

  return (
    <div
      className="proj-card"
      data-index={index}
      style={{
        "--card-index": index,
        "--card-total": total,
        zIndex: index + 1,
      }}
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
        <div className="card-cat-badge font-cairo">{project.category}</div>

        {(project.isPrivate || project.isBeta) && (
          <div className="card-flags font-cairo">
            {project.isPrivate && (
              <span className="flag flag-private">
                <IconLock />
                خاص
              </span>
            )}
            {project.isBeta && <span className="flag flag-beta">بيتا</span>}
          </div>
        )}
      </div>

      {/* ── Info half ──────────────────────────────────────────────── */}
      <div className="card-info font-cairo">
        <div className="card-info-top">
          <div className="card-role-line">
            <span className="card-role">{project.role}</span>
          </div>

          <h3 className="card-title font-el-messiri">{project.title}</h3>

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
              <span>زيارة الموقع</span>
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
                title="متجر جوجل بلاي"
              >
                <IconPlay />
                <span>متجر جوجل</span>
              </a>
            )}
            {project.links.appStore && (
              <a
                href={project.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn link-ghost"
                title="متجر التطبيقات"
              >
                <IconApple />
                <span>متجر أبل</span>
              </a>
            )}
            {project.links.desktop && (
              <a
                href={project.links.desktop}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn link-ghost"
                title="تطبيق سطح المكتب"
              >
                <IconDownload />
                <span>سطح المكتب</span>
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
                <span>مستودعات GitHub</span>
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
        .proj-card {
          position: sticky;
          top: calc(80px + var(--card-index) * 14px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
          border-radius: 24px;
          overflow: hidden;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          box-shadow:
            0 8px 40px var(--border-primary),
            0 1px 0 var(--border-primary) inset;
          will-change: transform;
          transition: box-shadow 0.3s, background 0.3s, border-color 0.3s;
          margin-bottom: 0;
        }

        .proj-card:hover {
          box-shadow:
            0 16px 60px var(--border-secondary),
            0 1px 0 var(--border-secondary) inset;
        }

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
          right: 22px;
          font-family: var(--font-cairo), system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.55);
          text-transform: uppercase;
        }

        .card-cat-badge {
          position: absolute;
          top: 20px;
          left: 22px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-secondary);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-primary);
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }

        .card-flags {
          position: absolute;
          bottom: 20px;
          right: 22px;
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
          background: var(--glass-bg);
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          backdrop-filter: blur(8px);
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }

        .flag-beta {
          background: var(--color-toxic-green);
          color: var(--bg-primary);
        }

        .card-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px 36px 32px;
          background: var(--bg-secondary);
          font-family: var(--font-cairo), system-ui, -apple-system, sans-serif;
          transition: background 0.3s, color 0.3s;
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
          color: var(--text-tertiary);
          border-bottom: 1px solid var(--border-secondary);
          padding-bottom: 2px;
          transition: color 0.3s, border-color 0.3s;
        }

        .card-title {
          font-family: var(--font-el-messiri), system-ui, sans-serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -1px;
          color: var(--text-primary);
          margin-bottom: 16px;
          transition: color 0.3s;
        }

        .card-desc {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 22px;
          max-width: 400px;
          transition: color 0.3s;
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
          border: 1px solid var(--border-primary);
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.04em;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }

        .tag:hover {
          background: var(--border-primary);
          color: var(--text-primary);
          border-color: var(--border-secondary);
        }

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
          font-family: var(--font-cairo), system-ui, sans-serif;
          cursor: pointer;
          transition: transform 0.2s, background 0.3s, box-shadow 0.3s, color 0.3s, border-color 0.3s;
          white-space: nowrap;
        }

        .link-btn :global(svg) {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        .link-primary {
          background: var(--text-primary);
          color: var(--bg-primary);
          padding: 11px 20px;
          box-shadow: 0 4px 16px var(--border-secondary);
          width: 100%;
          justify-content: space-between;
        }

        .link-primary:hover {
          background: var(--text-secondary);
          color: var(--bg-primary);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px var(--border-secondary);
        }

        .link-arrow {
          display: flex;
          align-items: center;
          transition: transform 0.2s;
          transform: scaleX(-1); /* Flips arrow for RTL */
        }

        .link-primary:hover .link-arrow {
          transform: translateX(-3px) scaleX(-1);
        }

        .link-ghost {
          background: var(--glass-bg);
          border: 1px solid var(--border-primary);
          color: var(--text-secondary);
          padding: 9px 16px;
        }

        .link-ghost:hover {
          background: var(--border-primary);
          border-color: var(--border-secondary);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .github-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .github-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--border-primary);
          border-radius: 12px;
          padding: 9px 16px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-cairo), system-ui, sans-serif;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
          text-align: right;
        }

        .github-toggle :global(svg) {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        .github-toggle:hover {
          background: var(--border-primary);
          border-color: var(--border-secondary);
          color: var(--text-primary);
        }

        .github-chevron {
          display: flex;
          align-items: center;
          margin-right: auto;
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
          padding: 4px 16px 4px 0;
          border-right: 1px solid var(--border-primary);
          margin-right: 16px;
        }

        .github-sub-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-tertiary);
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .github-sub-link:hover {
          color: var(--text-primary);
        }

        .github-sub-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--text-tertiary);
          flex-shrink: 0;
        }

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

export default function ProjectsAr() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".proj-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".proj-eyebrow",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".proj-heading .word", {
        opacity: 0,
        y: 45,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".proj-heading",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".proj-sub", {
        opacity: 0,
        y: 16,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".proj-sub",
          start: "top 90%",
          once: true,
        },
      });

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".proj-stack",
            start: "top 80%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      document.querySelectorAll(".proj-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 75 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );

        if (window.innerWidth > 768) {
          gsap.to(card, {
            scale: 0.94 + i * 0.005,
            scrollTrigger: {
              trigger: card,
              start: "top 12%",
              end: "bottom 12%",
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="proj-section">
      <div className="proj-bg-decor font-cairo" />

      <div className="proj-inner">
        {/* ── Header ── */}
        <header className="proj-header">
          <div className="proj-eyebrow eyebrow font-el-messiri">
            <span className="eyebrowDot" />
            المشاريع
          </div>

          <h2 className="proj-heading font-el-messiri">
            <span className="word">أحدث</span>{" "}
            <span className="word">
              <em>الأعمال</em>
            </span>
          </h2>

          <p className="proj-sub font-cairo">
            مجموعة مختارة من المشاريع التي قمت بتطويرها مؤخرًا.
          </p>
        </header>

        {/* ── Sticky Stack of Cards ── */}
        <div className="proj-stack">
          {projects.map((proj, i) => (
            <ProjectCard
              key={proj.title}
              project={proj}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .proj-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          font-family: var(--font-cairo), system-ui, -apple-system, sans-serif;
          color: var(--text-primary);
          padding: 130px 0 160px;
          background: transparent;
          transition: color 0.3s;
        }

        .proj-bg-decor {
          position: absolute;
          inset: 0;
          background: transparent;
          pointer-events: none;
          z-index: 0;
        }

        .proj-inner {
          position: relative;
          z-index: 10;
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 56px;
        }

        .proj-header {
          margin-bottom: 80px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--border-primary);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 28px;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }

        .eyebrowDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-primary);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .proj-heading {
          font-family: var(--font-el-messiri), system-ui, sans-serif;
          font-size: clamp(48px, 7.5vw, 92px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -2.5px;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .proj-heading em {
          font-style: normal;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .proj-sub {
          font-size: 17px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 440px;
          transition: color 0.3s;
        }

        .proj-stack {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 60px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .proj-inner {
            padding: 0 24px;
          }

          .proj-header {
            margin-bottom: 48px;
          }

          .proj-stack {
            gap: 32px;
          }
        }
      `}</style>
    </section>
  );
}
