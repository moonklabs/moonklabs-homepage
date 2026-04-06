import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moonklabs.com"),
  title: {
    default: "뭉클랩 — AI 네이티브 엔지니어링 스튜디오",
    template: "%s — 뭉클랩",
  },
  description:
    "에이전트 시대의 프로덕트를 설계하고 구축합니다. LLM·에이전틱 시스템·내부 툴링 전문 엔지니어링 스튜디오. 중견·대기업·투자사 문의 환영.",
  keywords: [
    "AI Agent",
    "LLM",
    "Agentic Systems",
    "MCP",
    "RAG",
    "Enterprise AI",
    "엔지니어링 스튜디오",
    "뭉클랩",
    "Moonklabs",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://moonklabs.com",
    siteName: "뭉클랩",
    title: "뭉클랩 — AI 네이티브 엔지니어링 스튜디오",
    description:
      "에이전트 시대의 프로덕트를 설계하고 구축합니다. 엔터프라이즈·투자 문의 환영.",
  },
  twitter: {
    card: "summary_large_image",
    title: "뭉클랩 — AI 네이티브 엔지니어링 스튜디오",
    description:
      "에이전트 시대의 프로덕트를 설계하고 구축합니다.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://moonklabs.com" },
};

export const viewport = {
  themeColor: "#000000",
  colorScheme: "dark" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
