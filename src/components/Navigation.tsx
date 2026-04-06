"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,0,0,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-white font-semibold text-sm tracking-widest">뭉클랩</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#work" className="text-zinc-400 hover:text-white text-xs tracking-widest transition-colors">
              WORK
            </a>
            <a href="#tech" className="text-zinc-400 hover:text-white text-xs tracking-widest transition-colors">
              TECH
            </a>
            <a href="#contact" className="text-zinc-400 hover:text-white text-xs tracking-widest transition-colors">
              ABOUT
            </a>
            <a
              href="https://github.com/moonklabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white text-xs tracking-widest transition-colors"
            >
              GITHUB
            </a>
          </div>
        </div>
        <a
          href="#contact"
          className="text-xs tracking-widest px-4 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-200"
        >
          문의하기 →
        </a>
      </div>
    </nav>
  );
}
