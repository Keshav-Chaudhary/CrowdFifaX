import { HeroSection } from "@/components/marketing/landing/HeroSection";
import { SocialProofSection } from "@/components/marketing/landing/SocialProofSection";
import { StadiumMapSection } from "@/components/marketing/landing/StadiumMapSection";
import { FanJourneySection } from "@/components/marketing/landing/FanJourneySection";
import { CTASection } from "@/components/marketing/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <StadiumMapSection />
      <FanJourneySection />
      <CTASection />
    </>
  );
}
