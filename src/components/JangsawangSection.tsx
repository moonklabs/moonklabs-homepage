"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const outcomes = [
  "광고 Agent는 광고 비효율 신호와 대응 포인트를 빠르게 파악하도록 돕습니다.",
  "재고 Agent는 품절·과재고·회전율 저하 리스크를 미리 감지하도록 설계했습니다.",
  "이커머스 운영에서 검증한 Agent 설계 경험을 엔터프라이즈 업무 자동화에 확장합니다.",
];

export default function JangsawangSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="work"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#000", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 select-none pointer-events-none font-black leading-none"
        style={{
          fontSize: "18rem",
          color: "rgba(255,255,255,0.03)",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
        }}
      >
        WORK
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <span className="text-xs text-violet-400 tracking-widest">SELLERKING · COMMERCE OPERATIONS AGENTS</span>
              <h2 className="mt-3 text-white font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
                이커머스 운영에서
                <br />Agent 자동화를 검증했습니다
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-zinc-400 text-sm leading-relaxed max-w-xl"
            >
              Sellerking은 광고와 재고 운영처럼 숫자를 놓치면 바로 손실로 이어지는 업무를 위해 만든 Agent
              제품군입니다. 뭉클랩은 이커머스 현장에서 Agent가 실제 운영 신호를 어떻게 읽고 어떤 타이밍에
              사람에게 판단을 넘겨야 하는지 직접 설계해왔습니다.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="space-y-3"
            >
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-500 leading-relaxed max-w-xl">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-3 text-xs tracking-widest text-zinc-500"
            >
              <span>AD AGENT</span>
              <span>·</span>
              <span>INVENTORY AGENT</span>
              <span>·</span>
              <span>COMMERCE OPS</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.5 }}>
              <a href="#contact" className="inline-flex items-center gap-2 text-xs tracking-widest text-white border border-white/20 px-5 py-3 hover:bg-white hover:text-black transition-all duration-200">
                Sellerking 도입 문의 →
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="w-full" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-white text-xs font-medium tracking-wide">SELLERKING OPS BOARD</span>
                <span className="ml-auto text-[10px] text-zinc-600 tracking-widest">LIVE</span>
              </div>
              <div className="p-5 space-y-4 text-xs font-mono">
                <div className="space-y-2">
                  <div className="text-zinc-500 text-[10px] tracking-widest">2026.04 · PRODUCT STATUS</div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">광고 Agent</span>
                    <span className="text-green-400">OPEN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">재고 Agent</span>
                    <span className="text-violet-400">NEXT WEEK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">운영 자동화 패턴</span>
                    <span className="text-zinc-300">validated</span>
                  </div>
                </div>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="p-3 space-y-1" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="text-violet-400 text-[10px] tracking-widest font-sans">◆ OPERATOR SIGNAL</div>
                  <p className="text-zinc-300 leading-relaxed">광고 비효율 신호 감지 완료. 예산 재배분 우선순위 제안 준비.</p>
                  <p className="text-zinc-500">next: inventory risk rollout</p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-zinc-600 text-[10px] tracking-widest">WHY IT MATTERS</div>
                  {["놓치기 쉬운 운영 숫자 조기 감지", "사람이 바로 판단할 수 있는 액션 중심 신호", "엔터프라이즈 Agent 자동화로 확장 가능한 설계"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-zinc-500">
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
