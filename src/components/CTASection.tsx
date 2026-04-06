"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 px-6"
      style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-black text-black"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
            >
              귀사의 업무에도
              <br />Agent 자동화를 붙여보세요.
            </motion.h2>
          </div>
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-zinc-500 text-base leading-relaxed"
            >
              Sprintable과 Sellerking으로 검증한 방식으로, 엔터프라이즈와 성장 기업의 반복 업무를 AI Agent
              자동화로 전환할 수 있도록 함께 설계합니다.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="mailto:hello@moonklabs.com?subject=%EB%AD%89%ED%81%B4%EB%9E%A9%20Agent%20Automation%20%EB%AC%B8%EC%9D%98&body=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94%2C%20Agent%20%EC%9E%90%EB%8F%99%ED%99%94%20%EB%8F%84%EC%9E%85%20%EC%83%81%EB%8B%B4%EC%9D%84%20%EC%9B%90%ED%95%A9%EB%8B%88%EB%8B%A4.%0A%0A%ED%9A%8C%EC%82%AC%EB%AA%85%3A%20%0A%EC%97%85%EB%AC%B4%20%EC%A1%B0%EC%A7%81%3A%20%0A%EA%B4%80%EC%8B%AC%20%EC%98%81%EC%97%AD%3A%20Sprintable%20%2F%20Sellerking%20%EA%B4%91%EA%B3%A0%20Agent%20%2F%20Sellerking%20%EC%9E%AC%EA%B3%A0%20Agent%20%2F%20%EA%B8%B0%EC%97%85%20%EB%A7%9E%EC%B6%A4%20Agent%20%EC%9E%90%EB%8F%99%ED%99%94%0A%ED%98%84%EC%9E%AC%20%EA%B3%BC%EC%A0%9C%3A%20"
                className="px-8 py-4 text-sm font-medium tracking-wide text-white bg-black hover:bg-zinc-800 transition-colors"
              >
                도입 상담 메일 보내기 →
              </a>
              <a
                href="https://github.com/moonklabs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-sm font-medium tracking-wide text-black border border-black hover:bg-black hover:text-white transition-colors"
              >
                GITHUB
              </a>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xs text-zinc-400 tracking-wide"
            >
              ↳ 보통 1영업일 이내 회신드립니다 · Sprintable / Sellerking / 기업 맞춤 Agent 자동화 상담 가능
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
