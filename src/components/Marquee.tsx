export default function Marquee() {
  const items = [
    "LLM Systems",
    "Agentic Orchestration",
    "RAG Pipelines",
    "MCP Tooling",
    "Next.js",
    "TypeScript",
    "Rust",
    "Python",
    "Vector Search",
    "Observability",
    "Eval Harness",
    "Fine-tuning",
  ];

  const repeated = [...items, ...items];

  return (
    <div
      className="py-4 overflow-hidden"
      style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="marquee-inner">
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="text-black text-sm font-medium tracking-wide whitespace-nowrap px-6">
              {item}
            </span>
            <span className="text-zinc-300 text-sm">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
