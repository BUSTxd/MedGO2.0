import { preload } from 'react-dom';
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
  // El fondo del hero es CSS (`hero.module.css`): sin esto el navegador no lo
  // descubre hasta tener la hoja de estilos. Solo aquí: en el layout raíz se
  // bajaba en todas las páginas, también en el dashboard, donde no se usa.
  preload('/assets/hero-bg.avif', { as: 'image', fetchPriority: 'high' });
  return (
    <>
      <Background />
      <ScrollReveal />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Problem />
        <Solution />
        <OfferValidation />
        <Consequences />
        <Pricing />
        <AboutUs />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
