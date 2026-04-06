export default function Footer() {
  return (
    <footer
      className="py-6 px-6"
      style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          {[
            { label: "WORK", href: "#work" },
            { label: "TECH", href: "#tech" },
            { label: "CONTACT", href: "#contact" },
            { label: "GITHUB", href: "https://github.com/moonklabs" },
            { label: "MAIL", href: "mailto:hello@moonklabs.com" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-zinc-500 hover:text-zinc-300 tracking-wide transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <span className="text-xs text-zinc-600 tracking-wide">© 2026 MoonkLabs</span>
      </div>
    </footer>
  );
}
