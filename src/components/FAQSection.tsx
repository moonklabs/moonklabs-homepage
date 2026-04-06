import { faqItems, lastUpdated } from "@/app/site-config";

export default function FAQSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="py-32 px-6"
      style={{ background: "#050505", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs text-violet-400 tracking-widest">FAQ · AI SEO READY</span>
          <h2
            id="faq-heading"
            className="text-white font-black"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", letterSpacing: "-0.04em", lineHeight: 0.98 }}
          >
            기업용 AI 에이전트 구축에 대해
            <br />자주 받는 질문
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            아래 답변은 뭉클랩의 핵심 서비스 범위와 운영 방식을 빠르게 이해할 수 있도록 정리한 요약입니다.
          </p>
          <p className="text-xs text-zinc-500 tracking-wide">LAST UPDATED · {lastUpdated}</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group border border-white/10 bg-white/[0.02] open:bg-white/[0.04]"
            >
              <summary className="list-none cursor-pointer px-6 py-5 flex items-start justify-between gap-6">
                <h3 className="text-white text-base font-semibold leading-relaxed">{item.question}</h3>
                <span className="text-zinc-500 group-open:text-violet-400 transition-colors">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-sm text-zinc-400 leading-7 max-w-3xl">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
