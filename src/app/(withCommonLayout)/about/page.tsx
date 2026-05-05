import AboutBanner from '@/components/module/about/AboutBanner';
import OurStory from '@/components/module/about/OurStory';
import CorePiler from '@/components/module/about/CorePiler';
import TimeLine from '@/components/module/about/TimeLine';
import BecomeOwner from '@/components/module/about/BecomeOwner';
import FinalCta from '@/components/module/about/FinalCta';


export default function AboutPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      {/* HERO SECTION - Unique "Glassmorphism Overlay" Design */}
      <AboutBanner />
      {/* OUR STORY - Matching Home Grid Pattern */}
      <OurStory />
      {/* CORE PILLARS - Expanded Info Grid */}
      <CorePiler />
      {/* THE TIMELINE - New Information */}
      <TimeLine />
      {/* BECOME AN OWNER - Matching WorkProcess Style */}
      <BecomeOwner />
      {/* FINAL CTA - Matching Partnership Style */}
      <FinalCta />
    </div>
  );
}

