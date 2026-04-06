"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
      {/* Background ghost text */}
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
          {/* Left label */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs text-violet-400 tracking-widest">CASE STUDY 01 · COMMERCE</span>
              <h2
                className="mt-3 text-white font-black"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
              >
                커머스 운영을
                <br />자동화하는 에이전트
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-zinc-500 text-sm leading-relaxed max-w-sm"
            >
              멀티 채널 정산, 광고 최적화, 이상 거래 탐지를 하나의 에이전트 시스템으로 묶었습니다.
              데이터 파이프라인부터 LLM 오케스트레이션까지 엔드-투-엔드로 설계·구축했습니다.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs tracking-widest text-white border border-white/20 px-5 py-3 hover:bg-white hover:text-black transition-all duration-200"
              >
                자세히 이야기하기 →
              </a>
            </motion.div>
          </div>

          {/* Right: agent mock */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div
              className="w-full"
              style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-white text-xs font-medium tracking-wide">COMMERCE AGENT</span>
                <span className="ml-auto text-[10px] text-zinc-600 tracking-widest">LIVE</span>
              </div>
              <div className="p-5 space-y-4 text-xs font-mono">
                <div className="space-y-2">
                  <div className="text-zinc-500 text-[10px] tracking-widest">PIPELINE · 24H</div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">정산 데이터 동기화</span>
                    <span className="text-green-400">SYNCED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">이상 거래 스코어링</span>
                    <span className="text-zinc-300">9,412 rows</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">광고 최적화 루프</span>
                    <span className="text-violet-400">running</span>
                  </div>
                </div>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div
                  className="p-3 space-y-1"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  <div className="text-violet-400 text-[10px] tracking-widest font-sans">◆ AGENT PLAN</div>
                  <p className="text-zinc-300 leading-relaxed">캠페인 B 예산 재분배 제안 준비 완료.</p>
                  <p className="text-zinc-500">승인 대기 · 휴먼 리뷰 1건</p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-zinc-600 text-[10px] tracking-widest">NEXT ACTIONS</div>
                  {["정산 리포트 합성", "CS 인입 자동 분류", "SKU 품절 경보"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-500">
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
