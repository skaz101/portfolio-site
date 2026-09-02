"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

type Skill = {
  id: string;
  number: string;
  title: string;
  short: string;
  detail: string;
  stack: string;
  image?: string;
  imageAlt?: string;
  imageMode?: "cover" | "contain";
  imageLabel?: string;
};

const skills: Skill[] = [
  {
    id: "software",
    number: "01",
    title: "Software",
    short: "The part where an idea becomes usable.",
    detail: "I mostly work in Python and JavaScript, with Java for robotics and other projects. I care more about making the thing work well than using a specific language.",
    stack: "Python / JavaScript / Java / React / Next.js",
    image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&fit=crop&w=1600&q=85",
    imageAlt: "Computer code reflected through a pair of eyeglasses",
  },
  {
    id: "robotics",
    number: "02",
    title: "Robotics",
    short: "Code connected to actual hardware.",
    detail: "I write software for FRC robots. That means working with motors, sensors, cameras, controllers, and the rest of the team to get one machine working right.",
    stack: "WPILib / REVLib / Limelight / Git",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/First_Robotics_Competition_%28835838%29.jpg/1280px-First_Robotics_Competition_%28835838%29.jpg",
    imageAlt: "Robots competing on a real FIRST Robotics Competition field",
  },
  {
    id: "homelab",
    number: "03",
    title: "Homelab",
    short: "My own place to test and run things.",
    detail: "I run a Proxmox homelab with virtual machines and services I set up and maintain myself. It is where I test ideas before I trust them anywhere else.",
    stack: "Proxmox / Docker / Nginx / Cloudflare",
    image: "https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&fit=crop&w=1600&q=85",
    imageAlt: "Ethernet cables connected to equipment in a real server rack",
  },
  {
    id: "networking",
    number: "04",
    title: "Networking",
    short: "Switches, DNS, VPNs, and the cables between them.",
    detail: "I work with routers, switches, DNS, VPNs, and remote access across my home network. I like setting it up, testing it, and fixing it when something stops talking.",
    stack: "Tailscale / Pi-hole / Unbound / Cloudflared",
    image: "https://images.pexels.com/photos/2881224/pexels-photo-2881224.jpeg?auto=compress&fit=crop&w=1600&q=85",
    imageAlt: "Blue Ethernet cables plugged into a real network switch",
  },
  {
    id: "linux",
    number: "05",
    title: "Linux",
    short: "My daily system, not just a side project.",
    detail: "My main desktop runs CachyOS. I also use Debian on servers and Windows when I need it. Most of my work ends up in a terminal at some point.",
    stack: "CachyOS / Arch / Debian / Bash",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
    imageAlt: "Tux, the Linux penguin mascot",
    imageMode: "contain",
    imageLabel: "TUX / LARRY EWING + THE GIMP",
  },
  {
    id: "web",
    number: "06",
    title: "Web",
    short: "From the first page to the live domain.",
    detail: "I build and host full websites, not just mockups. That includes the frontend, backend, domains, DNS, and getting the finished site online.",
    stack: "HTML / CSS / React / Supabase / Cloudflare",
    image: "https://images.pexels.com/photos/2764993/pexels-photo-2764993.jpeg?auto=compress&fit=crop&w=1600&q=85",
    imageAlt: "Web development code open on a computer monitor",
  },
  {
    id: "it",
    number: "07",
    title: "IT",
    short: "Set it up. Keep it working. Fix what breaks.",
    detail: "I do hands-on IT work with computers, accounts, domains, networks, printers, and business software. A lot of it is finding the real cause instead of guessing.",
    stack: "Windows / Microsoft 365 / Cloudflare / Support",
    image: "https://images.pexels.com/photos/5050305/pexels-photo-5050305.jpeg?auto=compress&fit=crop&w=1600&q=85",
    imageAlt: "Real rack-mounted server and networking hardware",
  },
  {
    id: "security",
    number: "08",
    title: "Security",
    short: "Learning how systems fail and how to lock them down.",
    detail: "I am learning cybersecurity through hands-on labs and testing tools. I am most interested in finding weak points, understanding them, and fixing them properly.",
    stack: "Kali Linux / Nmap / TryHackMe",
    image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&fit=crop&w=1600&q=85",
    imageAlt: "Cybersecurity tools and code displayed on a computer monitor",
  },
];

export default function Home() {
  const [active, setActive] = useState<Skill | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [active]);

  const moveLight = (event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--py", `${event.clientY - bounds.top}px`);
  };

  return (
    <main className="site-shell">
      <header className="site-header">
        <a href="#top" className="wordmark">SERGE</a>
        <p>Software / Robotics / Systems</p>
        <a href="https://github.com/skaz101" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <section className="skill-grid" id="top" aria-label="About Serge and his skills">
        <div className="intro-block">
          <div className="dot-field" aria-hidden="true" />
          <div className="intro-topline">
            <span>ABOUT</span>
            <span>LA / 2026</span>
          </div>
          <div className="intro-copy">
            <h1>Serge</h1>
            <p>I build software, work on FRC robots, run a homelab, and handle the systems around all of it.</p>
          </div>
          <span className="pick-label">Pick a block</span>
        </div>

        {skills.map((skill, index) => (
          <button
            className={`skill-tile ${skill.image ? "has-image" : ""}`}
            key={skill.id}
            type="button"
            onClick={() => setActive(skill)}
            onMouseMove={moveLight}
            aria-haspopup="dialog"
            style={{ "--delay": `${index * 55 + 100}ms` } as CSSProperties}
          >
            {skill.image && (
              <span className={`tile-media ${skill.imageMode === "contain" ? "contain" : ""}`} aria-hidden="true">
                <img src={skill.image} alt="" loading="lazy" />
              </span>
            )}
            <span className="tile-light" aria-hidden="true" />
            <span className="tile-top">
              <span>{skill.number}</span>
              <span>OPEN +</span>
            </span>
            <span className="tile-copy">
              <strong>{skill.title}</strong>
              <span>{skill.short}</span>
            </span>
          </button>
        ))}
      </section>

      <footer className="site-footer">
        <span>Serge / Personal site</span>
        <span>Click any block to open it</span>
        <a href="https://github.com/skaz101" target="_blank" rel="noreferrer">github.com/skaz101 ↗</a>
      </footer>

      {active && (
        <div className="detail-layer" role="presentation" onMouseDown={() => setActive(null)}>
          <section
            className={`detail-window ${active.image ? "with-image" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="detail-bar">
              <span>SERGE / {active.number}</span>
              <button ref={closeRef} type="button" onClick={() => setActive(null)} aria-label="Close details">CLOSE ×</button>
            </div>
            {active.image && (
              <div className={`detail-media ${active.imageMode === "contain" ? "contain" : ""}`}>
                <img src={active.image} alt={active.imageAlt ?? ""} />
                <span>{active.imageLabel ?? "REAL PHOTO"}</span>
              </div>
            )}
            <div className="detail-copy">
              <span className="detail-number">{active.number} / 08</span>
              <h2 id="detail-title">{active.title}</h2>
              <p>{active.detail}</p>
              <div className="detail-stack">
                <span>WHAT I USE</span>
                <p>{active.stack}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
