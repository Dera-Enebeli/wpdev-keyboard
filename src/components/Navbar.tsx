"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Home", threshold: 0 },
  { id: "foundation", label: "Foundation", threshold: 0.15 },
  { id: "frame", label: "Frame", threshold: 0.45 },
  { id: "complete", label: "Complete", threshold: 0.80 },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const p = maxScroll > 0 ? scrollY / maxScroll : 0;
          setProgress(p);
          setScrolled(scrollY > 20);

          let current = "overview";
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            if (p >= SECTIONS[i].threshold) {
              current = SECTIONS[i].id;
              break;
            }
          }
          setActiveSection(current);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (threshold: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: threshold * maxScroll, behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-shadow duration-500"
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        backgroundColor: scrolled ? "rgba(0, 0, 0, 0.92)" : "rgba(0, 0, 0, 0.85)",
        boxShadow: scrolled ? "0 1px 0 rgba(232, 181, 21, 0.15)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-8 md:px-16 h-14">
        <span className="text-sm font-semibold tracking-[0.08em] text-[#e8b515] uppercase select-none">
          Precision Keyboard
        </span>

        <div className="hidden md:flex items-center gap-10">
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.threshold)}
                className={`relative text-sm font-medium tracking-[0.08em] uppercase transition-all duration-300 ${
                  isActive ? "text-[#e8b515]" : "text-[#8e8e93] hover:text-[#e8b515]"
                }`}
              >
                {s.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#e8b515] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-center justify-center gap-[6px]">
              <span className={`block w-[18px] h-[2px] bg-[#e8b515] rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`block w-[18px] h-[2px] bg-[#e8b515] rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-[18px] h-[2px] bg-[#e8b515] rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          backgroundColor: "rgba(0, 0, 0, 0.95)",
        }}
      >
        <div className="border-t border-[#333] px-8 py-4 flex flex-col gap-3">
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { scrollTo(s.threshold); setMenuOpen(false); }}
                className={`text-sm font-medium tracking-[0.08em] uppercase text-left transition-all duration-200 px-4 py-2.5 rounded-lg ${
                  isActive
                    ? "text-[#e8b515] bg-[#e8b515]/10"
                    : "text-[#8e8e93] hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative h-px bg-[#2d2d2f]">
        <div
          className="absolute inset-y-0 left-0 bg-[#e8b515] transition-all duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </nav>
  );
}
