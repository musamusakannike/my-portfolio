"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const Hero3DObject = ({ variant = "object", className = "", style }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, variant === "stars" ? 6 : 5);

    const fitCameraToRings = (w, h) => {
      if (variant === "stars") return;
      const maxRadius = 2.65;
      const aspect = (w || 1) / (h || 1);
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const minFov = Math.min(vFov, hFov);
      const distance = maxRadius / Math.tan(minFov / 2);
      camera.position.z = Math.max(distance + 0.6, 5);
    };

    fitCameraToRings(width, height);

    let ambientLight;
    let keyLight;
    let fillLight;
    let rimLight;
    let coreGeo;
    let coreMat;
    let core;
    let wireGeo;
    let wireMat;
    let wire;
    let shellGeo;
    let shellMat;
    let shell;
    let shellWireGeo;
    let shellWireMat;
    let shellWire;
    let satelliteGroup;
    let cubeCount;
    let cubes;
    let ringGeo;
    let ringMat;
    let ring;
    let ring2Geo;
    let ring2Mat;
    let ring2;

    if (variant !== "stars") {
      ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
      scene.add(ambientLight);

      keyLight = new THREE.PointLight(0x39ff14, 8, 20);
      keyLight.position.set(3, 3, 3);
      scene.add(keyLight);

      fillLight = new THREE.PointLight(0x4488ff, 4, 20);
      fillLight.position.set(-3, -2, 2);
      scene.add(fillLight);

      rimLight = new THREE.PointLight(0xffffff, 3, 20);
      rimLight.position.set(0, -3, -2);
      scene.add(rimLight);

      coreGeo = new THREE.IcosahedronGeometry(1, 1);
      coreMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.95,
        roughness: 0.05,
        envMapIntensity: 1,
      });
      core = new THREE.Mesh(coreGeo, coreMat);
      core.castShadow = true;
      scene.add(core);

      wireGeo = new THREE.IcosahedronGeometry(1.01, 1);
      wireMat = new THREE.MeshBasicMaterial({
        color: 0x39ff14,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      wire = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wire);

      shellGeo = new THREE.DodecahedronGeometry(1.6, 0);
      shellMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.35,
        side: THREE.BackSide,
      });
      shell = new THREE.Mesh(shellGeo, shellMat);
      scene.add(shell);

      shellWireGeo = new THREE.DodecahedronGeometry(1.62, 0);
      shellWireMat = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      shellWire = new THREE.Mesh(shellWireGeo, shellWireMat);
      scene.add(shellWire);

      satelliteGroup = new THREE.Group();
      scene.add(satelliteGroup);

      cubeCount = 8;
      cubes = [];
      for (let i = 0; i < cubeCount; i++) {
        const size = 0.06 + Math.random() * 0.08;
        const geo = new THREE.BoxGeometry(size, size, size);
        const mat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x39ff14 : 0xffffff,
          metalness: 0.8,
          roughness: 0.2,
          emissive: i % 2 === 0 ? 0x39ff14 : 0x224488,
          emissiveIntensity: 0.6,
        });
        const cube = new THREE.Mesh(geo, mat);

        const angle = (i / cubeCount) * Math.PI * 2;
        const radius = 2.1 + Math.random() * 0.4;
        const tilt = (Math.random() - 0.5) * 1.2;
        cube.position.set(
          Math.cos(angle) * radius,
          tilt,
          Math.sin(angle) * radius
        );
        cube.userData = {
          angle,
          radius,
          tilt,
          speed: 0.3 + Math.random() * 0.4,
        };
        satelliteGroup.add(cube);
        cubes.push(cube);
      }

      ringGeo = new THREE.TorusGeometry(2.2, 0.008, 8, 120);
      ringMat = new THREE.MeshBasicMaterial({
        color: 0x39ff14,
        transparent: true,
        opacity: 0.3,
      });
      ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      scene.add(ring);

      ring2Geo = new THREE.TorusGeometry(2.5, 0.005, 8, 120);
      ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.2,
      });
      ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.z = Math.PI / 6;
      scene.add(ring2);
    }

    // ── Particle field ────────────────────────────────────────
    const particleCount = variant === "stars" ? 900 : 300;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = (variant === "stars" ? 4.2 : 2.8) + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: variant === "stars" ? 0.012 : 0.018,
      transparent: true,
      opacity: variant === "stars" ? 0.5 : 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Mouse tracking ────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      if (variant === "stars") return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── Resize ────────────────────────────────────────────────
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fitCameraToRings(w, h);
      renderer.setSize(w, h);
    };
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(mount);
    } else {
      window.addEventListener("resize", handleResize);
    }

    // ── Animation loop ────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (variant !== "stars") {
        core.rotation.x = t * 0.12 + mouse.y * 0.3;
        core.rotation.y = t * 0.18 + mouse.x * 0.3;
        wire.rotation.copy(core.rotation);

        shell.rotation.x = -t * 0.07;
        shell.rotation.y = t * 0.1;
        shellWire.rotation.copy(shell.rotation);

        ring.rotation.z = t * 0.08;
        ring2.rotation.z = -t * 0.06;

        cubes.forEach((cube, i) => {
          const { radius, tilt, speed } = cube.userData;
          const a = t * speed + (i / cubeCount) * Math.PI * 2;
          cube.position.set(
            Math.cos(a) * radius,
            tilt + Math.sin(t * 0.5 + i) * 0.15,
            Math.sin(a) * radius
          );
          cube.rotation.x = t * 0.8 + i;
          cube.rotation.y = t * 0.6 + i;
        });
      }

      // Particle slow spin
      particles.rotation.y = t * 0.04;
      particles.rotation.x = variant === "stars" ? t * 0.01 : t * 0.02;

      // Light orbit
      if (variant !== "stars") {
        keyLight.position.x = Math.cos(t * 0.5) * 4;
        keyLight.position.z = Math.sin(t * 0.5) * 4;
        fillLight.position.x = Math.cos(t * 0.4 + Math.PI) * 3;
        fillLight.position.z = Math.sin(t * 0.4 + Math.PI) * 3;

        coreMat.emissive = new THREE.Color(0x39ff14);
        coreMat.emissiveIntensity = 0.04 + Math.sin(t * 1.5) * 0.03;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      particleGeo.dispose();
      particleMat.dispose();
      if (variant !== "stars") {
        coreGeo.dispose();
        coreMat.dispose();
        wireGeo.dispose();
        wireMat.dispose();
        shellGeo.dispose();
        shellMat.dispose();
        shellWireGeo.dispose();
        shellWireMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
      }
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className || "w-full h-full"}
      style={{ cursor: variant === "stars" ? "default" : "none", ...style }}
    />
  );
};

export default Hero3DObject;