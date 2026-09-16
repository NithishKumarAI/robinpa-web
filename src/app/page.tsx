import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PersistentRobinStage } from "@/components/visual/persistent-stage/PersistentRobinStage";
import { HeroSection } from "@/components/sections/HeroSection";
import { MeetRobinSection } from "@/components/sections/MeetRobinSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { VoiceSection } from "@/components/sections/VoiceSection";
import { MemorySection } from "@/components/sections/MemorySection";
import { LocalFirstSection } from "@/components/sections/LocalFirstSection";
import { DownloadSection } from "@/components/sections/DownloadSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-violet/25 relative">
      <PersistentRobinStage />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none relative z-20">
        <HeroSection />
        <MeetRobinSection />
        <CapabilitiesSection />
        <SafetySection />
        <VoiceSection />
        <MemorySection />
        <LocalFirstSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
