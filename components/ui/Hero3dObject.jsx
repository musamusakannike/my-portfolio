"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────
// VARIANT 1 — STACKED DISCS (Jeton-inspired)
// ─────────────────────────────────────────────────────────
function buildStackedDiscs(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const discCount = 9;
  const discs = [];

  const colors = [
    0xe05c5c, 0xd96b68, 0xcf7a72, 0xca897a, 0xca9280,
    0xd09c88, 0xd8a494, 0xe0afa2, 0xe8bdb0,
  ];

  for (let i = 0; i < discCount; i++) {
    const radius = 1.15 - i * 0.022;
    const geo = new THREE.CylinderGeometry(radius, radius, 0.14, 72);
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i],
      metalness: 0.3,
      roughness: 0.3,
    });
    const disc = new THREE.Mesh(geo, mat);
    disc.position.set(
      Math.sin(i * 0.55) * 0.16,
      -i * 0.38 + (discCount * 0.19),
      Math.cos(i * 0.55) * 0.06,
    );
    disc.rotation.z = Math.sin(i * 0.38) * 0.07;
    disc.castShadow = true;
    disc.receiveShadow = true;
    disc.userData = { baseY: disc.position.y, phase: i * 0.42 };
    group.add(disc);
    discs.push(disc);
  }

  const warm = new THREE.PointLight(0xff8055, 7, 18);
  warm.position.set(3, 4, 3);
  scene.add(warm);
  scene.add(new THREE.PointLight(0xffd0a0, 4, 14, 0));
  scene.add(new THREE.AmbientLight(0xffe8d8, 0.65));

  let rafId;
  const loop = (t) => {
    rafId = requestAnimationFrame(loop);
    const time = t * 0.001;
    group.rotation.y = time * 0.28;
    discs.forEach((d) => {
      d.position.y =
        d.userData.baseY + Math.sin(time * 1.1 + d.userData.phase) * 0.08;
      d.rotation.z = Math.sin(time * 0.5 + d.userData.phase) * 0.055;
    });
    warm.position.x = Math.cos(time * 0.5) * 5;
    warm.position.z = Math.sin(time * 0.5) * 5;
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────
// VARIANT 2 — CHAIN LINKS (Sadewa-inspired)
// ─────────────────────────────────────────────────────────
function buildChainLinks(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  const key = new THREE.DirectionalLight(0xffffff, 3.5);
  key.position.set(6, 8, 5);
  key.castShadow = true;
  scene.add(key);

  const greenPt = new THREE.PointLight(0x88ff00, 6, 20);
  greenPt.position.set(-3, 2, 4);
  scene.add(greenPt);

  const rim = new THREE.PointLight(0xccffaa, 2.5, 14);
  rim.position.set(0, -4, -3);
  scene.add(rim);

  // Build a C-shaped bracket via tube along an arc
  function makeBracket(
    color,
    emissive,
    metalness,
    roughness,
    transmission,
  ) {
    const pts = [];
    const segs = 48;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 1.6 - Math.PI * 0.8;
      pts.push(new THREE.Vector3(Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 64, 0.27, 20, false);
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: 0.1,
      metalness,
      roughness,
      transparent: transmission > 0,
      opacity: transmission > 0 ? 0.88 : 1.0,
      transmission,
      ior: 1.45,
    });
    return new THREE.Mesh(geo, mat);
  }

  const greenB = makeBracket(0x82e800, 0x3a8800, 0.25, 0.12, 0);
  greenB.rotation.z = Math.PI / 2;
  greenB.position.set(0, 0.2, 0);

  const silverB = makeBracket(0x9eb3bf, 0x1a2a3a, 0.75, 0.08, 0.18);
  silverB.rotation.x = Math.PI / 2;
  silverB.position.set(0, -0.2, 0);

  const group = new THREE.Group();
  group.add(greenB, silverB);
  scene.add(group);

  let rafId;
  const loop = (t) => {
    rafId = requestAnimationFrame(loop);
    const time = t * 0.001;
    group.rotation.y = time * 0.32;
    group.rotation.x = Math.sin(time * 0.38) * 0.2;
    greenB.rotation.z = Math.PI / 2 + Math.sin(time * 0.55) * 0.14;
    silverB.rotation.x = Math.PI / 2 + Math.sin(time * 0.45 + 1.2) * 0.12;
    greenPt.position.x = Math.cos(time * 0.7) * 5;
    greenPt.position.z = Math.sin(time * 0.7) * 5;
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────
// VARIANT 3 — CUBE CLUSTER (Resend-inspired)
// ─────────────────────────────────────────────────────────
function buildCubeCluster(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.07));

  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(7, 9, 5);
  key.castShadow = true;
  scene.add(key);

  const side = new THREE.PointLight(0x5577aa, 1.8, 22);
  side.position.set(-6, 2, 2);
  scene.add(side);

  const under = new THREE.PointLight(0x223344, 1.2, 14);
  under.position.set(0, -6, 0);
  scene.add(under);

  // Three material flavours — matte, semi-specular, almost-mirror
  const mats = [
    new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.15, roughness: 0.92 }),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.55, roughness: 0.35 }),
    new THREE.MeshStandardMaterial({ color: 0x202020, metalness: 0.88, roughness: 0.12 }),
  ];

  const cubeSize = 0.68;
  const gap = 0.065;
  const step = cubeSize + gap;
  const N = 3;

  const entries = [];
  const group = new THREE.Group();
  scene.add(group);

  let idx = 0;
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      for (let z = 0; z < N; z++) {
        const geo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const mesh = new THREE.Mesh(geo, mats[idx % mats.length]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const px = (x - 1) * step;
        const py = (y - 1) * step;
        const pz = (z - 1) * step;
        mesh.position.set(px, py, pz);
        entries.push({ mesh, base: new THREE.Vector3(px, py, pz), phase: idx * 0.44 });
        group.add(mesh);
        idx++;
      }
    }
  }

  let rafId;
  const loop = (t) => {
    rafId = requestAnimationFrame(loop);
    const time = t * 0.001;
    group.rotation.y = time * 0.2;
    group.rotation.x = Math.sin(time * 0.17) * 0.16 + 0.28;
    entries.forEach(({ mesh, base, phase }) => {
      mesh.position.x = base.x + Math.sin(time * 0.75 + phase) * 0.016;
      mesh.position.y = base.y + Math.sin(time * 0.6 + phase * 1.4) * 0.02;
      mesh.position.z = base.z + Math.cos(time * 0.68 + phase) * 0.013;
    });
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
const Hero3DObject = ({ variant = "stacked-discs" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || 460;
    const h = mount.clientHeight || 460;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camZ =
      variant === "cube-cluster" ? 6.8 : variant === "chain-links" ? 5.6 : 5.9;
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0, camZ);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // Build scene
    let variantCleanup;
    if (variant === "stacked-discs") variantCleanup = buildStackedDiscs(scene);
    else if (variant === "chain-links") variantCleanup = buildChainLinks(scene);
    else variantCleanup = buildCubeCluster(scene);

    // Render loop
    let rafId;
    const render = () => {
      rafId = requestAnimationFrame(render);
      camera.position.x += (mouse.x * 0.45 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.28 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    render();

    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      variantCleanup?.();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [variant]);

  return <div ref={mountRef} className="w-full h-full min-h-[420px]" />;
};

export default Hero3DObject;