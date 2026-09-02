"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

type SceneProps = {
  progress: RefObject<number>;
};

export default function Scene({ progress }: SceneProps) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      host.classList.add("no-webgl");
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const isSmall = window.matchMedia("(max-width: 760px)").matches;
    const coreGeometry = new THREE.IcosahedronGeometry(1.35, isSmall ? 3 : 5);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x080808,
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    world.add(core);

    const edgeGeometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.38, 2));
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    world.add(edges);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xbdbdbd, transparent: true, opacity: 0.46 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.012, 8, 192), ringMaterial);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.009, 8, 192), ringMaterial.clone());
    const ringC = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.007, 8, 192), ringMaterial.clone());
    ringA.rotation.set(1.05, 0.1, 0.2);
    ringB.rotation.set(0.35, 1.1, 0.5);
    ringC.rotation.set(1.2, 0.75, 1.4);
    world.add(ringA, ringB, ringC);

    const satellites = new THREE.Group();
    const satelliteGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.9, roughness: 0.28 });
    const satelliteBases: THREE.Vector3[] = [];
    for (let index = 0; index < 12; index += 1) {
      const phi = Math.acos(-1 + (2 * index) / 12);
      const theta = Math.sqrt(12 * Math.PI) * phi;
      const base = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * 2.15,
        Math.sin(theta) * Math.sin(phi) * 2.15,
        Math.cos(phi) * 2.15,
      );
      const cube = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      cube.position.copy(base);
      cube.rotation.set(theta, phi, theta * 0.5);
      satellites.add(cube);
      satelliteBases.push(base);
    }
    world.add(satellites);

    const particleCount = isSmall ? 90 : 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 3.6 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[index * 3 + 2] = radius * Math.cos(phi);
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.42, sizeAttenuation: true });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.PointLight(0xffffff, 85, 20);
    key.position.set(3.5, 4.5, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0x8a8a8a, 70, 18);
    rim.position.set(-4, -2, 1);
    scene.add(rim);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    };
    resize();

    const clock = new THREE.Clock();
    let currentProgress = 0;
    let animation = 0;

    const render = () => {
      const time = clock.getElapsedTime();
      const targetProgress = progress.current ?? 0;
      currentProgress = THREE.MathUtils.lerp(currentProgress, targetProgress, 0.045);
      pointer.lerp(pointerTarget, 0.045);

      const expand = THREE.MathUtils.smoothstep(currentProgress, 0.52, 0.94);
      const pulse = 1 + Math.sin(time * 0.8) * 0.018;

      world.rotation.y = time * 0.09 + currentProgress * Math.PI * 2.25 + pointer.x * 0.18;
      world.rotation.x = -0.08 + currentProgress * 0.72 - pointer.y * 0.14;
      world.rotation.z = currentProgress * 0.34;
      world.scale.setScalar(pulse * (1 - expand * 0.08));
      world.position.x = isSmall ? 0 : Math.sin(currentProgress * Math.PI * 2.5) * 1.05;
      world.position.y = Math.cos(currentProgress * Math.PI * 2) * 0.18;

      core.rotation.y = -time * 0.12;
      coreMaterial.roughness = 0.2 + Math.sin(currentProgress * Math.PI) * 0.18;
      edgeMaterial.opacity = 0.2 + Math.sin(currentProgress * Math.PI) * 0.28;

      ringA.rotation.z = time * 0.13 + currentProgress * 2.2;
      ringB.rotation.x = 0.35 - time * 0.08 + currentProgress * 1.6;
      ringC.rotation.y = time * 0.06 - currentProgress * 1.9;
      ringA.scale.setScalar(1 + Math.sin(currentProgress * Math.PI * 2) * 0.08);
      ringB.scale.setScalar(1 + expand * 0.48);
      ringC.scale.setScalar(1 + expand * 0.82);

      satellites.children.forEach((child, index) => {
        const distance = 1 + expand * 1.15 + Math.sin(time * 0.7 + index) * 0.025;
        child.position.copy(satelliteBases[index]).multiplyScalar(distance);
        child.rotation.x += 0.004;
        child.rotation.y += 0.006;
      });

      particles.rotation.y = time * 0.012 - currentProgress * 0.25;
      particles.rotation.x = pointer.y * 0.08;
      camera.position.z = 7.8 - currentProgress * 0.8;
      camera.position.x = pointer.x * 0.16;
      camera.position.y = -pointer.y * 0.12;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animation = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    animation = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      coreGeometry.dispose();
      coreMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      ringC.geometry.dispose();
      (ringA.material as THREE.Material).dispose();
      (ringB.material as THREE.Material).dispose();
      (ringC.material as THREE.Material).dispose();
      satelliteGeometry.dispose();
      satelliteMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);

  return <div className="scene" ref={mount} aria-hidden="true" />;
}
