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
              함께 만들
              <br />준비가 되셨나요.
            </motion.h2>
          </div>
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-zinc-500 text-base"
            >
              중견·대기업·투자사 파트너를 환영합니다.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="mailto:hello@moonklabs.com?subject=%EB%AD%89%ED%81%B4%EB%9E%A9%20%EB%AC%B8%EC%9D%98&body=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94%2C%20%EB%AD%89%ED%81%B4%EB%9E%A9%EC%97%90%20%EB%AC%B8%EC%9D%98%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4.%0A%0A%EC%86%8C%EC%86%8D%3A%20%0A%EC%9D%B4%EB%A6%84%3A%20%0A%EB%AC%B8%EC%9D%98%20%EC%9C%A0%ED%98%95%3A%20%EB%8C%80%EA%B8%B0%EC%97%85%2F%EC%A4%91%EA%B2%AC%2F%ED%88%AC%EC%9E%90%EC%82%AC%2F%EA%B8%B0%ED%83%80%0A%EB%82%B4%EC%9A%A9%3A%20"
                className="px-8 py-4 text-sm font-medium tracking-wide text-white bg-black hover:bg-zinc-800 transition-colors"
              >
                문의 메일 보내기 →
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
              ↳ 보통 1영업일 이내 회신드립니다 · hello@moonklabs.com
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
