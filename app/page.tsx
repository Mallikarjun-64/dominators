import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import DemoScanner from "@/components/DemoScanner";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import SecurityIndicators from "@/components/SecurityIndicators";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-16 md:py-20 space-y-20 md:space-y-32">
        <DemoScanner />
        <Features />
        <HowItWorks />
        <SecurityIndicators />
        <Stats />
        <CTA />
      </div>
      <Footer />
    </div>
  );
}
