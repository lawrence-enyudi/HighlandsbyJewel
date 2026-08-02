import { useEffect } from "react";
import { SiteProvider, useSite } from "./context/SiteContext";
import { EditorProvider, useEditor } from "./context/EditorContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import DistrictsSection from "./components/DistrictsSection";
import DigitalMapSection from "./components/DigitalMapSection";
import Properties from "./components/Properties";
import AmenitiesSection from "./components/AmenitiesSection";
import SiteTrippingSection from "./components/SiteTrippingSection";
import AboutJewel from "./components/AboutJewel";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import SiteTrippingModal from "./components/SiteTrippingModal";
import AdminPortal from "./components/Admin/AdminPortal";
import FloatingActions from "./components/FloatingActions";
import EditorBar from "./components/editor/EditorBar";

function EditorSessionSync() {
  const { adminRole } = useSite();
  const { enterEditMode, exitEditMode } = useEditor();

  // If session is "editor", reopen the live page editor automatically
  useEffect(() => {
    if (adminRole === "editor") {
      enterEditMode();
    } else {
      exitEditMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminRole]);

  return null;
}

export default function App() {
  return (
    <SiteProvider>
      <EditorProvider>
        <EditorSessionSync />
        <div className="relative min-h-screen bg-[#faf8f5] text-highlands-900 antialiased selection:bg-gold-400 selection:text-highlands-950">
          <a
            href="#properties"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold-500 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-highlands-950 shadow-md"
          >
            Skip to available properties
          </a>

          <Navbar />

          <main>
            <Hero />
            <SocialProof />
            <DistrictsSection />
            <DigitalMapSection />
            <Properties />
            <AmenitiesSection />
            <SiteTrippingSection />
            <AboutJewel />
            <Features />
            <Benefits />
            <Testimonials />
            <Pricing />
            <Faq />
            <CTA />
          </main>

          <Footer />

          <SiteTrippingModal />
          <AdminPortal />
          <FloatingActions />

          {/* Live Page Editor floating toolbar (only visible in edit mode) */}
          <EditorBar />
        </div>
      </EditorProvider>
    </SiteProvider>
  );
}
