"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  "멀티 LLM 라우팅 · 비용 최적화",
  "MCP 툴 60+ 내장",
  "스펙 드리븐 PR 자동 리뷰",
  "평가 하네스 · 회귀 방지",
  "실시간 관측성 파이프라인",
  "온프레미스 배포 옵션",
];

const codeLines = [
  { type: "comment", text: "// engineering_agent.ts" },
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

            <div className="p-5 space-y-0.5">
              {codeLines.map((line, i) => (
                <div key={`${line.type}-${i}`} className="flex">
                  <span className="w-6 text-zinc-700 text-[10px] select-none shrink-0 pt-0.5">
                    {line.type !== "blank" ? i + 1 : ""}
                  </span>
                  <span style={{ color: typeColors[line.type] }} className="leading-relaxed">
                    {line.text || "\u00A0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-violet-400 tracking-widest">CASE STUDY 02 · INTERNAL AI PLATFORM</span>
            </div>
            <h2
              className="text-white font-black"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
            >
              엔지니어링 팀을 위한
              <br />LLM·MCP 내부 업무 자동화
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-zinc-400 text-sm leading-relaxed"
          >
            MCP 기반 에이전트가 GitHub, 이슈 트래커, 문서 시스템을 직접 조작하며 스펙 설계,
            PR 리뷰, 스탠드업 같은 반복 업무를 자동화합니다. 뭉클랩은 AI가 실제 개발 흐름 안에서
            안전하게 동작하도록 평가 체계와 운영 가드레일까지 함께 설계합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="w-1 h-1 rounded-full bg-violet-500 shrink-0" />
                {feature}
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26, duration: 0.5 }}
            className="text-sm text-zinc-500 leading-relaxed"
          >
            온프레미스 배포, 권한 제어, 회귀 테스트, 관측성 파이프라인처럼 엔터프라이즈 환경에서
            중요한 조건을 함께 다루는 것이 핵심입니다.
          </motion.p>

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
