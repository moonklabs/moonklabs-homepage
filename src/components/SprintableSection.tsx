"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  "역할별 AI Agent 생성 및 조율",
  "스프린트 계획 · 실행 · 검증 · 문서화 자동화",
  "MCP 기반 도구 연결과 실행 흐름 통합",
  "평가 하네스 · 회귀 방지 · 휴먼 리뷰 가드레일",
  "개발 조직에서 먼저 검증 후 다른 기능 조직으로 확장",
  "엔터프라이즈 환경에 맞는 운영 구조 설계",
];

const codeLines = [
  { type: "comment", text: "// sprintable_workflow.ts" },
  { type: "blank", text: "" },
  { type: "code", text: "const agent = defineAgent({" },
  { type: "code", text: "  model: routeLLM('sonnet'|'opus')," },
  { type: "code", text: "  tools: mcp.catalog(60)," },
  { type: "code", text: "  evals: regressionSuite," },
  { type: "code", text: "});" },
  { type: "blank", text: "" },
  { type: "code", text: "await agent.run(" },
  { type: "string", text: '  "스펙 리뷰 및 PR 생성"' },
  { type: "code", text: ");" },
  { type: "blank", text: "" },
  { type: "output", text: "> 스펙 검증 통과" },
  { type: "output", text: "> PR #482 초안 생성" },
  { type: "output", text: "> 리뷰어 배정 완료" },
];

const typeColors: Record<string, string> = {
  comment: "#6b7280",
  blank: "transparent",
  code: "#e2e8f0",
  string: "#86efac",
  output: "#7c3aed",
};

export default function SprintableSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="tech"
      ref={ref}
      className="py-32 px-6"
      style={{ background: "#0D0D0D", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Code editor */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <div
            className="font-mono text-xs"
            style={{
              background: "#080808",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Editor header */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="ml-2 text-zinc-600 text-[10px] tracking-wide">engineering_agent.ts</span>
            </div>

            {/* Code */}
            <div className="p-5 space-y-0.5">
              {codeLines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-6 text-zinc-700 text-[10px] select-none shrink-0 pt-0.5">{line.type !== "blank" ? i + 1 : ""}</span>
                  <span style={{ color: typeColors[line.type] }} className="leading-relaxed">
                    {line.text || "\u00A0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: description */}
        <div className="order-1 lg:order-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-violet-400 tracking-widest">SPRINTABLE · AGENT WORKFLOW SYSTEM</span>
            </div>
            <h2
              className="text-white font-black"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
            >
              엔지니어링 팀을
              <br />증폭시키는 에이전트
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-zinc-500 text-sm leading-relaxed"
          >
            Sprintable은 역할별 AI Agent를 생성·조율해 스프린트 계획, 실행, 검증, 문서화 같은 개발
            조직의 반복 업무를 구조적으로 자동화하는 시스템입니다. 개발팀 내부 사용 경험을 바탕으로
            마케팅, 운영, PM 등 다른 기능 조직으로 확장할 준비를 하고 있습니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="w-1 h-1 rounded-full bg-violet-500 shrink-0" />
                {feature}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs tracking-widest text-white border border-white/20 px-5 py-3 hover:bg-white hover:text-black transition-all duration-200"
            >
              자세히 이야기하기 →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
