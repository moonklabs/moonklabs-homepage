import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import JangsawangSection from "@/components/JangsawangSection";
import SprintableSection from "@/components/SprintableSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only fixed top-2 left-2 z-[100] bg-white text-black px-3 py-1 text-xs">본문 바로가기</a>
      <main id="main" className="bg-black min-h-screen">
        <Navigation />
        <Hero />
        <Marquee />
        <JangsawangSection />
        <SprintableSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
