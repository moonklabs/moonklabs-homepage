"use client";

import { motion } from "framer-motion";
import { serviceList } from "@/app/site-config";

const lineVariant = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-20 pb-16 px-6 border-b border-white/10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "55%",
            width: "640px",
            height: "640px",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-10%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
        <div className="lg:col-span-3 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs tracking-widest text-zinc-400 px-3 py-1.5"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
              AI NATIVE ENGINEERING STUDIO · 2026
            </span>
          </motion.div>

          <h1 className="hero-title text-white overflow-hidden">
            {["기업을 위한", "AI 에이전트 · LLM", "엔지니어링 시스템을", "설계·구축합니다"].map(
              (line, i) => (
                <div key={line} className="overflow-hidden">
                  <motion.span
                    custom={i}
                    variants={lineVariant}
                    initial="hidden"
                    animate="visible"
                    className="block"
                  >
                    {line}
                  </motion.span>
                </div>
              ),
            )}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-4 max-w-3xl"
          >
            <p className="text-zinc-200 text-lg leading-relaxed">
              뭉클랩은 <strong>중견기업·대기업·투자사</strong>를 위한 AI 네이티브 엔지니어링
              스튜디오입니다. <strong>기업용 AI 에이전트, LLM 시스템, MCP 기반 내부 툴링</strong>을
              설계·구축·운영합니다.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              데모용 챗봇보다 실제 운영 환경에 연결되는 시스템을 우선합니다. 데이터 파이프라인,
              평가 하네스, 권한 제어, 관측성까지 포함해 배포 가능한 형태로 설계합니다.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.5 }}
            className="grid gap-2 text-sm text-zinc-400"
          >
            {serviceList.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="px-6 py-3 text-sm font-medium tracking-wide text-black bg-white hover:bg-zinc-100 transition-colors"
              >
                문의하기
              </a>
              <a
                href="#faq-heading"
                className="px-6 py-3 text-sm font-medium tracking-wide text-white border border-white/20 hover:border-white/50 transition-colors"
              >
                FAQ 보기
              </a>
              <a
                href="https://github.com/moonklabs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-sm font-medium tracking-wide text-white border border-white/20 hover:border-white/50 transition-colors flex items-center gap-2"
              >
                <span>★</span> GITHUB
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-none w-full max-w-sm ml-auto"
            style={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-white text-xs font-medium tracking-wide">MOONKLABS AGENT</span>
              <div className="ml-auto flex gap-1">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
              </div>
            </div>

            <div className="p-4 space-y-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="text-zinc-500 text-[10px] tracking-widest">2026.04.06 · AGENT RUN</div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Pipeline status</span>
                  <span className="text-green-400 font-semibold">+ 12 runs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Latency p95</span>
                  <span className="text-zinc-300">148ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Incidents</span>
                  <span className="text-zinc-400">0</span>
                </div>
              </div>

              <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

              <div
                className="p-3 space-y-1"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                <div className="text-violet-400 text-[10px] tracking-widest font-sans">◆ AGENT DIAGNOSIS</div>
                <p className="text-zinc-300 leading-relaxed">
                  데이터 파이프라인 정상. 추가 조치 불필요.
                </p>
                <p className="text-zinc-500">다음 실행: 05:00 KST</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-zinc-600 text-[10px] tracking-widest">실행 대기</div>
                {["벡터 인덱스 재구축", "주간 리포트 합성", "MCP 툴 상태 점검"].map((item) => (
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
    </section>
  );
}
