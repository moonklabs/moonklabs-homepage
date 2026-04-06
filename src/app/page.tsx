import { contactEmail, faqItems, productHighlights, serviceList, siteDescription, siteName, siteUrl } from "@/app/site-config";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Marquee from "@/components/Marquee";
import JangsawangSection from "@/components/JangsawangSection";
import SprintableSection from "@/components/SprintableSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteName,
  url: siteUrl,
  email: contactEmail,
  description: siteDescription,
  areaServed: "KR",
  serviceType: [...serviceList],
  knowsAbout: [
    "AI Agent automation",
    "Enterprise workflow automation",
    "Sprintable",
    "Sellerking ad agent",
    "Sellerking inventory agent",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Moonklabs Agent Products",
    itemListElement: productHighlights.map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: product.name,
        description: product.summary,
      },
    })),
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <a href="#main" className="sr-only focus:not-sr-only fixed top-2 left-2 z-[100] bg-white text-black px-3 py-1 text-xs">
        본문 바로가기
      </a>
      <main id="main" className="bg-black min-h-screen">
        <Navigation />
        <Hero />
        <Marquee />
        <JangsawangSection />
        <SprintableSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
