import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import ResponseNetwork from "../components/landing/ResponseNetwork";
import Features from "../components/landing/Features";
import Stats from "../components/landing/Stats";
import About from "../components/landing/About";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#35506D] via-[#314B67] to-[#223449] text-white">

      <Navbar />

      <Hero />

      <HowItWorks />

      <ResponseNetwork />

      <Features />

      <Stats />

      <About />

      <CTA />

      <Footer />

    </div>
  );
}