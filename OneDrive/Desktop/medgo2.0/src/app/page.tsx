import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Courses from '@/components/Courses';
import Pricing from '@/components/Pricing';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';
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
        <HowItWorks />
        <Courses />
        <Pricing />
        <AboutUs />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
