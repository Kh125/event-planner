'use client';

import { 
  Header, 
  HeroSection, 
  FeaturesSection, 
  StatsSection, 
  TestimonialsSection, 
  CTASection, 
  Footer 
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
