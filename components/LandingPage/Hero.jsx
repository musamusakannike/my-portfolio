"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";

export default function Hero() {
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const fallbackRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);

  const ids = useMemo(
    () => ({
      eyebrow: "hero-eyebrow",
      headline: "hero-headline",
      sub: "hero-sub",
      cta: "hero-cta",
      stats: "hero-stats",
      bottomBar: "hero-bottom-bar",
      scrollHint: "hero-scroll-hint",
      contactBtn: "hero-contact-btn",
    }),
    [],
  );

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });
    tl.to(`#${ids.eyebrow}`, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
      .to(`#${ids.headline}`, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=.4")
      .to(`#${ids.sub}`, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.5")
      .to(`#${ids.cta}`, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.4")
      .to(`#${ids.stats}`, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.4")
      .to(`#${ids.bottomBar}`, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=.3")
      .to(`#${ids.scrollHint}`, { opacity: 1, duration: 0.6 }, "-=.4")
      .to(`#${ids.contactBtn}`, { opacity: 1, duration: 0.6 }, "-=.6");
    return () => { tl.kill(); };
  }, [ids]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !loader || !fallback) return;

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      fallback.classList.add("show");
      loader.classList.add("hidden");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Pure white / grey lighting for monochrome aesthetic
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 4.0);
    sun.position.set(4, 6, 4);
    sun.castShadow = true;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xdddddd, 1.0);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xaaaaaa, 1.5);
    rim.position.set(2, -4, -2);
    scene.add(rim);

    const point1 = new THREE.PointLight(0xffffff, 2.0, 12);
    point1.position.set(-2, 3, 2);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xcccccc, 1.5, 10);
    point2.position.set(3, -2, 1);
    scene.add(point2);

    // Monochrome disc material — white/silver
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      roughness: 0.12,
      metalness: 0.6,
      envMapIntensity: 1,
    });

    const group = new THREE.Group();
    scene.add(group);

    const discs = [];
    const discGeometries = [];

    const DISCS = 22;
    for (let i = 0; i < DISCS; i++) {
      const t = i / (DISCS - 1);
      const angle = t * Math.PI * 3.6;
      const radius = 1.2 - t * 0.72;
      const thickness = (0.04 + t * 0.01) * radius;
      const yPos = t * 4.0 - 2.0;
      const xPos = Math.cos(angle) * (0.2 * (1 - t));

      const geo = new THREE.TorusGeometry(radius, thickness, 6, 60);
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(xPos, yPos, 0);
      mesh.rotation.x = Math.PI / 2 + t * 0.15;
      mesh.rotation.z = angle;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.baseY = yPos;

      group.add(mesh);
      discs.push(mesh);
      discGeometries.push(geo);
    }

    group.rotation.z = -0.1;
    group.rotation.x = 0.05;
    group.position.set(window.innerWidth < 900 ? 0 : 0.6, window.innerWidth < 900 ? -0.8 : 0, 0);
    if (window.innerWidth < 900) group.scale.set(0.85, 0.85, 0.85);

    // White particles
    const partGeo = new THREE.BufferGeometry();
    const partCount = 80;
    const positions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.25,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onResize = () => {
      if (!renderer) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Update position for mobile
      if (w < 900) {
        group.position.set(0, -0.8, 0);
        group.scale.set(0.75, 0.75, 0.75);
      } else {
        group.position.set(0.6, 0, 0);
        group.scale.set(1, 1, 1);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    loader.classList.add("hidden");
    group.scale.set(0, 0, 0);
    gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1,.6)", delay: 0.3 });

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = window.requestAnimationFrame(render);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      group.rotation.y = t * 0.18 + mouse.x * 0.25;
      group.rotation.x = 0.05 + mouse.y * -0.12;

      discs.forEach((mesh, i) => {
        const wave = Math.sin(t * 1.2 + i * 0.35) * 0.06;
        const baseY = mesh.userData.baseY;
        mesh.position.y = baseY + wave;
        const scl = 1 + Math.sin(t * 0.8 + i * 0.4) * 0.015;
        mesh.scale.set(scl, scl, 1);
      });

      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.025;

      // Subtle grey oscillation
      const grey = 0.88 + Math.sin(t * 0.15) * 0.06;
      mat.color.setRGB(grey, grey, grey);
      mat.emissive.setRGB(0.05, 0.05, 0.05);

      renderer.render(scene, camera);
    };
    render();

    const resizeTimer = window.setTimeout(onResize, 100);

    return () => {
      window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      scene.remove(group);
      scene.remove(particles);
      discs.forEach((m) => { group.remove(m); });
      discGeometries.forEach((g) => g.dispose());
      partGeo.dispose();
      partMat.dispose();
      mat.dispose();
      renderer?.dispose();
      renderer = null;
    };
  }, []);

  return (
    <section className="hero">
      {/* ── Nav ── */}
      <nav className={`nav ${navScrolled ? "scrolled" : ""}`}>
        <div className="logo">CODIAC</div>
        <div className="navRight">
          <a href="#projects">
            <button className="btnGhost" type="button">Work</button>
          </a>
          <a href="#contact">
            <button className="btnPrimary" type="button">Hire me</button>
          </a>
        </div>
      </nav>

      {/* ── Background ── */}
      <div className="heroBg" />

      {/* ── Three.js loader + canvas ── */}
      <div ref={loaderRef} className="canvasLoader">
        <div className="loaderRing" />
      </div>
      <canvas ref={canvasRef} className="threeCanvas" />
      <div ref={fallbackRef} className="videoFallback" />

      {/* ── Hero content ── */}
      <div className="heroContent">
        <div className="heroLeft">

          {/* Headline */}
          <h1 id={ids.headline} className="headline">
            Musa<span className="mobileHide"><br /></span> Musa<br />
            <em>Kannike</em>
          </h1>

          {/* Sub */}
          <p id={ids.sub} className="heroSub text-white text-shadow-md">
            Fullstack developer crafting elegant products — from pixel-perfect interfaces to robust, scalable backends.
          </p>

          {/* CTA buttons */}
          <div id={ids.cta} className="ctaRow">
            <a className="ctaBtn ctaBtnPrimary" href="#projects">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v5H3zM3 10h8v11H3zM13 10h8v11h-8z" />
              </svg>
              <span>View Projects</span>
            </a>
            <a className="ctaBtn ctaBtnGhost" href="#contact">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Stats */}
          <div id={ids.stats} className="heroStats">
            <div className="statItem">
              <span className="statNum">5+</span>
              <span className="statLbl">Years exp.</span>
            </div>
            <div className="statSep" />
            <div className="statItem">
              <span className="statNum">30+</span>
              <span className="statLbl">Projects shipped</span>
            </div>
            <div className="statSep" />
            <div className="statItem">
              <span className="statNum">12+</span>
              <span className="statLbl">Happy clients</span>
            </div>
          </div>
        </div>

        <div className="heroRight" />
      </div>

      {/* ── Bottom nav bar ── */}
      <div id={ids.bottomBar} className="bottomBar">
        {[
          { label: "Home",     icon: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" },
          { label: "About",    icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
          { label: "Projects", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
          { label: "Contact",  icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" },
        ].map((item, i) => (
          <a key={item.label} href={`#${item.label.toLowerCase()}`} className={`barItem${i === 0 ? " barHome" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d={item.icon} />
            </svg>
            {item.label}
          </a>
        ))}
      </div>

      {/* ── Scroll hint ── */}
      <div id={ids.scrollHint} className="scrollHint">
        <span className="scrollHintLine" />
        Scroll
      </div>

      {/* ── GitHub button ── */}
      <a id={ids.contactBtn} className="githubBtn" href="https://github.com/musamusakannike" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
        GitHub
      </a>

      {/* ── Styles ── */}
      <style jsx>{`
        /* ─────────────────────────────────
           BASE
        ───────────────────────────────── */
        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
          display: flex;
          align-items: center;
          font-family: "DM Sans", system-ui, -apple-system, sans-serif;
          color: #fff;
        }

        /* ─────────────────────────────────
           BACKGROUND — deep black with subtle grain
        ───────────────────────────────── */
        .heroBg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 90% at 30% 50%,
            #2a2a2a 0%,
            #161616 35%,
            #0d0d0d 65%,
            #000000 100%
          );
          z-index: 0;
        }

        .heroBg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          mix-blend-mode: overlay;
        }

        /* ─────────────────────────────────
           NAV
        ───────────────────────────────── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          background: transparent;
          transition: background 0.4s;
        }

        .nav.scrolled {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(18px);
        }

        .logo {
          font-family: "Syne", system-ui, sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .nav.scrolled .logo {
          color: #000;
        }

        .navRight {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btnGhost {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          padding: 10px 18px;
          border-radius: 100px;
          transition: color 0.25s, background 0.25s;
        }

        .btnGhost:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .nav.scrolled .btnGhost { color: #111; }
        .nav.scrolled .btnGhost:hover { background: rgba(0,0,0,0.07); color: #000; }

        .btnPrimary {
          background: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          color: #000;
          padding: 11px 24px;
          border-radius: 100px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 18px rgba(255,255,255,0.15);
        }

        .btnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(255,255,255,0.25);
        }

        .nav.scrolled .btnPrimary { background: #000; color: #fff; }

        /* ─────────────────────────────────
           CANVAS / LOADER
        ───────────────────────────────── */
        .threeCanvas {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .canvasLoader {
          position: absolute; inset: 0;
          z-index: 2;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.6s;
        }

        .canvasLoader.hidden { opacity: 0; pointer-events: none; }

        .loaderRing {
          width: 48px; height: 48px;
          border: 2px solid rgba(255,255,255,0.15);
          border-top-color: rgba(255,255,255,0.8);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .videoFallback { display: none; position: absolute; inset: 0; z-index: 1; }
        .videoFallback.show { display: block; }

        /* ─────────────────────────────────
           HERO CONTENT
        ───────────────────────────────── */
        .heroContent {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          padding: 0 56px;
          gap: 40px;
          align-items: center;
        }

        .heroLeft { max-width: 560px; }
        .heroRight {}

        /* Eyebrow */
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.22);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          margin-bottom: 28px;
          opacity: 0;
          transform: translateY(14px);
        }

        .eyebrowDot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Headline */
        .headline {
          font-family: "Syne", system-ui, sans-serif;
          font-size: clamp(52px, 7vw, 92px);
          font-weight: 800;
          line-height: 0.95;
          color: #fff;
          letter-spacing: -2px;
          opacity: 0;
          transform: translateY(24px);
        }

        .headline em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sub */
        .heroSub {
          margin-top: 28px;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
          max-width: 380px;
          opacity: 0;
          transform: translateY(18px);
        }

        /* CTA row */
        .ctaRow {
          margin-top: 44px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(18px);
        }

        .ctaBtn {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 14px;
          padding: 13px 24px;
          cursor: pointer;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
        }

        .ctaBtn svg {
          width: 18px; height: 18px;
          flex-shrink: 0;
        }

        .ctaBtnPrimary {
          background: #fff;
          color: #000;
          box-shadow: 0 4px 24px rgba(255,255,255,0.18);
        }

        .ctaBtnPrimary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255,255,255,0.28);
        }

        .ctaBtnGhost {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.22);
          color: #fff;
          backdrop-filter: blur(12px);
        }

        .ctaBtnGhost:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        /* Stats */
        .heroStats {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-top: 56px;
          opacity: 0;
          transform: translateY(18px);
        }

        .statItem { display: flex; flex-direction: column; gap: 2px; }

        .statNum {
          font-family: "Syne", system-ui, sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .statLbl {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
          letter-spacing: 0.04em;
        }

        .statSep {
          width: 1px; height: 40px;
          background: rgba(255,255,255,0.15);
        }

        /* ─────────────────────────────────
           BOTTOM BAR
        ───────────────────────────────── */
        .bottomBar {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 6px 8px;
          opacity: 0;
        }

        .barItem {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          text-decoration: none;
          transition: background 0.25s, color 0.25s;
          white-space: nowrap;
          user-select: none;
        }

        .barItem svg { width: 16px; height: 16px; }

        .barItem:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .barHome {
          background: #fff;
          color: #000;
          padding: 10px 14px;
        }

        .barHome:hover { background: #e0e0e0; color: #000; }

        /* ─────────────────────────────────
           SCROLL HINT
        ───────────────────────────────── */
        .scrollHint {
          position: absolute;
          bottom: 40px; left: 56px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          opacity: 0;
        }

        .scrollHintLine {
          width: 32px; height: 1px;
          background: rgba(255,255,255,0.2);
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

        /* ─────────────────────────────────
           GITHUB BUTTON
        ───────────────────────────────── */
        .githubBtn {
          position: absolute;
          bottom: 32px; right: 48px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 12px 20px;
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
          opacity: 0;
          font-family: inherit;
        }

        .githubBtn svg {
          width: 16px; height: 16px;
          fill: currentColor;
          flex-shrink: 0;
        }

        .githubBtn:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        /* ─────────────────────────────────
           RESPONSIVE
        ───────────────────────────────── */
        @media (max-width: 900px) {
          .heroContent {
            grid-template-columns: 1fr;
            padding: 0 24px;
            text-align: center;
            justify-items: center;
          }

          .heroLeft {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .mobileHide { display: none; }

          .headline {
            font-size: clamp(48px, 12vw, 72px);
            margin-top: -20px;
            text-shadow: 0 0 40px rgba(0,0,0,0.5);
          }

          .heroSub {
            margin: 24px auto 0;
            max-width: 440px;
            font-size: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .ctaRow {
            justify-content: center;
            margin-top: 32px;
          }

          .heroStats {
            justify-content: center;
            gap: 20px;
            margin-top: 48px;
            width: 100%;
          }

          .statNum { font-size: 24px; }

          .nav { padding: 0 24px; }
          .nav .btnGhost { display: none; } /* Hide 'Work' button on mobile to save space */

          .bottomBar {
            bottom: 20px;
            width: calc(100% - 32px);
            left: 16px;
            right: 16px;
            transform: none;
            justify-content: center;
            gap: 8px;
            padding: 6px;
          }

          .scrollHint { display: none; }
          .githubBtn { display: none; }

          .threeCanvas {
            opacity: 0.6;
          }
        }

        @media (max-width: 500px) {
          .heroStats { gap: 12px; }
          .statSep { display: none; }
          .statNum { font-size: 20px; }
          .statLbl { font-size: 10px; }

          .barItem {
            padding: 10px 14px;
            font-size: 0; /* Hide text on small screens, icons only */
            gap: 0;
          }
          .barItem svg { width: 20px; height: 20px; }
          .barHome { padding: 10px 14px; }
        }
      `}</style>
    </section>
  );
}