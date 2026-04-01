"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  FaJs,
  FaPython,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaHtml5,
  FaDownload,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
  { name: "Python", icon: <FaPython className="text-blue-300" /> },
  { name: "React", icon: <FaReact className="text-cyan-400" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
  { name: "React Native", icon: <TbBrandReactNative className="text-cyan-400" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Express", icon: <SiExpress className="text-white" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-400" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-300" /> },
  { name: "Git", icon: <FaGitAlt className="text-orange-500" /> },
  { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
];

const traits = [
  {
    label: "Clean Code",
    desc: "I write readable, maintainable code with a focus on long-term scalability.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: "Full-Stack",
    desc: "Comfortable at every layer — from database schema to pixel-perfect UI.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: "Fast Learner",
    desc: "I pick up new stacks and patterns quickly, thriving in evolving environments.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Collaborative",
    desc: "Strong communicator who enjoys pairing, code review, and team problem-solving.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  // ── Three.js floating sphere cluster ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 3.5);
    sun.position.set(3, 5, 4);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xaaaaaa, 1.5);
    rim.position.set(-3, -3, -2);
    scene.add(rim);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      roughness: 0.15,
      metalness: 0.55,
    });

    const group = new THREE.Group();
    scene.add(group);

    // Icosahedron core
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const wireGeo = new THREE.EdgesGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wire);

    // Orbiting tori (same language as hero discs)
    const orbitals = [];
    const orbitalGeos = [];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusGeometry(1.6 + i * 0.55, 0.025, 6, 80);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = (Math.PI / 3) * i;
      mesh.rotation.z = (Math.PI / 5) * i;
      group.add(mesh);
      orbitals.push(mesh);
      orbitalGeos.push(geo);
    }

    // Floating dot particles
    const partGeo = new THREE.BufferGeometry();
    const partCount = 60;
    const pos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const partMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.022, transparent: true, opacity: 0.22 });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    const onResize = () => {
      if (!renderer) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Entrance scale
    group.scale.set(0, 0, 0);
    gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: "elastic.out(1,.6)", delay: 0.5 });

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouse = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      group.rotation.y = t * 0.12 + mouse.x * 0.2;
      group.rotation.x = mouse.y * -0.1;

      orbitals.forEach((o, i) => {
        o.rotation.z = t * (0.15 + i * 0.07);
        o.rotation.x = t * (0.1 + i * 0.05);
      });

      wire.rotation.y = -t * 0.08;
      wire.rotation.x = t * 0.04;
      particles.rotation.y = t * 0.03;

      const grey = 0.85 + Math.sin(t * 0.2) * 0.08;
      mat.color.setRGB(grey, grey, grey);

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      orbitalGeos.forEach((g) => g.dispose());
      coreGeo.dispose(); wireGeo.dispose(); partGeo.dispose();
      mat.dispose(); wireMat.dispose(); partMat.dispose();
      renderer?.dispose();
    };
  }, []);

  // ── GSAP scroll-triggered entrance animations ─────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow + heading
      gsap.from(".about-eyebrow", {
        opacity: 0, y: 20, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".about-eyebrow", start: "top 85%", once: true },
      });
      gsap.from(".about-heading", {
        opacity: 0, y: 30, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".about-heading", start: "top 85%", once: true },
      });

      // Bio paragraphs
      gsap.from(".about-bio p", {
        opacity: 0, y: 20, duration: 0.7, ease: "power3.out", stagger: 0.15,
        scrollTrigger: { trigger: ".about-bio", start: "top 82%", once: true },
      });

      // Download button
      gsap.from(".about-download", {
        opacity: 0, y: 16, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".about-download", start: "top 88%", once: true },
      });

      // Trait cards
      gsap.from(".trait-card", {
        opacity: 0, y: 30, duration: 0.65, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".traits-grid", start: "top 82%", once: true },
      });

      // Skills section label
      gsap.from(".skills-label", {
        opacity: 0, y: 16, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".skills-label", start: "top 88%", once: true },
      });

      // Skill pills
      gsap.from(".skill-pill", {
        opacity: 0, scale: 0.85, y: 10, duration: 0.5, ease: "back.out(1.4)", stagger: 0.05,
        scrollTrigger: { trigger: ".skills-grid", start: "top 85%", once: true },
      });

      // Divider line
      gsap.from(".about-divider", {
        scaleX: 0, transformOrigin: "left center", duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".about-divider", start: "top 88%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="about-bg" />

      {/* Three.js canvas — positioned right side */}
      <canvas ref={canvasRef} className="about-canvas" />

      <div className="about-container">
        {/* ── Left column ─────────────────────────────── */}
        <div className="about-left">
          {/* Eyebrow */}
          <div className="mb-5 font-mono border-b border-white/20 inline pb-1 px-1">
            ABOUT ME
          </div>

          {/* Heading */}
          <h2 className="about-heading">
            Turning ideas<br />
            into <em>real products</em>
          </h2>

          <hr className="about-divider" />

          {/* Bio */}
          <div className="about-bio">
            <p>
              I'm <strong>Musa Musa Kannike</strong>, a fullstack developer with a passion for building products that are as solid under the hood as they are beautiful on the surface. I work across the entire stack — crafting responsive frontends, robust APIs, and everything in between.
            </p>
            <p>
              With 5+ years of experience, I've shipped 30+ projects ranging from greenfield startups to complex enterprise systems. I care deeply about developer experience, code quality, and shipping things that actually work.
            </p>
          </div>

          {/* Download CV */}
          <a
            className="about-download"
            href="/Musa Musa Kannike CV.pdf"
            download
          >
            <FaDownload />
            <span>Download Resumé</span>
          </a>

          {/* Trait cards */}
          <div className="traits-grid">
            {traits.map((t) => (
              <div key={t.label} className="trait-card">
                <div className="trait-icon">{t.icon}</div>
                <div>
                  <div className="trait-label">{t.label}</div>
                  <div className="trait-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — placeholder for canvas + skills ── */}
        <div className="about-right">
          {/* Canvas lives here (absolute, fills right side) */}

          {/* Skills */}
          <div className="skills-panel">
            <div className="skills-label eyebrow">
              <span className="eyebrowDot" />
              Tech stack
            </div>
            <div className="skills-grid">
              {skills.map((s) => (
                <div key={s.name} className="skill-pill">
                  <span className="skill-icon">{s.icon}</span>
                  <span className="skill-name">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="about-scroll-hint">
        <span className="scrollHintLine" />
        Scroll
      </div>

      <style jsx>{`
        /* ── Section shell ── */
        .about-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          font-family: "DM Sans", system-ui, -apple-system, sans-serif;
          color: #fff;
          padding: 120px 0 100px;
        }

        /* ── Background (matches hero) ── */
        .about-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 90% at 70% 50%,
            #1e1e1e 0%,
            #111111 35%,
            #080808 65%,
            #000000 100%
          );
          z-index: 0;
        }

        .about-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.5;
          mix-blend-mode: overlay;
        }

        /* ── Three.js canvas ── */
        .about-canvas {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        /* ── Layout ── */
        .about-container {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          padding: 0 56px;
          gap: 60px;
          align-items: center;
        }

        .about-left {
          max-width: 560px;
        }

        .about-right {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: flex-end;
        }

        /* ── Eyebrow (reused from hero) ── */
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

        /* ── Heading ── */
        .about-heading {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(38px, 5vw, 68px);
          font-weight: 800;
          line-height: 0.97;
          color: #fff;
          letter-spacing: -1.5px;
          margin-bottom: 32px;
        }

        .about-heading em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 30%, rgba(255, 255, 255, 0.45));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Divider ── */
        .about-divider {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0 0 32px;
        }

        /* ── Bio ── */
        .about-bio {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .about-bio p {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.65);
          max-width: 480px;
        }

        .about-bio strong {
          color: #fff;
          font-weight: 600;
        }

        /* ── Download button ── */
        .about-download {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          color: #000;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          padding: 13px 26px;
          border-radius: 100px;
          text-decoration: none;
          cursor: pointer;
          margin-bottom: 52px;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 24px rgba(255, 255, 255, 0.15);
        }

        .about-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.25);
          background: #e8e8e8;
        }

        .about-download :global(svg) {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        /* ── Trait cards ── */
        .traits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .trait-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 18px 16px;
          transition: background 0.25s, border-color 0.25s, transform 0.2s;
        }

        .trait-card:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-2px);
        }

        .trait-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .trait-icon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .trait-label {
          font-family: "Syne", system-ui, sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .trait-desc {
          font-size: 12px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
        }

        /* ── Skills panel (right column) ── */
        .skills-panel {
          position: relative;
          z-index: 2;
          width: 100%;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 32px;
        }

        .skills-label {
          margin-bottom: 24px;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .skill-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          cursor: default;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }

        .skill-pill:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.28);
          transform: translateY(-2px);
        }

        .skill-icon {
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 1;
        }

        .skill-name {
          white-space: nowrap;
        }

        /* ── Scroll hint (same as hero) ── */
        .about-scroll-hint {
          position: absolute;
          bottom: 40px;
          left: 56px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
        }

        .scrollHintLine {
          width: 32px;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
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
          .about-container {
            grid-template-columns: 1fr;
            padding: 0 28px;
          }

          .about-canvas {
            width: 100%;
            height: 320px;
            top: auto;
            bottom: 0;
            opacity: 0.4;
          }

          .about-right {
            min-height: auto;
          }

          .traits-grid {
            grid-template-columns: 1fr;
          }

          .about-scroll-hint {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}