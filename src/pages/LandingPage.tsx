import { motion } from 'framer-motion';
import { HeroSection } from '@features/marketplace/HeroSection';
import { FeaturedBakeries } from '@features/marketplace/FeaturedBakeries';
import { PopularCakes } from '@features/marketplace/PopularCakes';
import { HowItWorks } from '@features/marketplace/HowItWorks';
import { Testimonials } from '@features/marketplace/Testimonials';

export default function LandingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HeroSection />
      <FeaturedBakeries />
      <PopularCakes />
      <HowItWorks />
      <Testimonials />
    </motion.div>
  );
}
