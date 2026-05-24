import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import Pricing from '@/components/Pricing';
import OfferValidation from '@/components/OfferValidation';
import Consequences from '@/components/Consequences';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <Background />
      <ScrollReveal />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <AboutUs />
        <Problem />
        <Solution />
        <Pricing />
        <OfferValidation />
        <Consequences />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
