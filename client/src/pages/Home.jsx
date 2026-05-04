// Usar en: pages/Home.jsx
// CSS: home.css

import Hero from '../layout/Hero';
import KineticBand from '../layout/KineticBand';
import TrompoIntro from '../layout/Trompo3D.jsx';
import IntroSection from '../layout/IntroSection';
import UnitsSection from '../layout/UnitsSection';
import VerticalsSection from '../layout/VerticalsSection';
import TeamStrip from '../layout/TeamStrip';
import CarteraSection from '../layout/CarteraSection';
import QuoteSection from '../layout/QuoteSection';
import StatsBand from '../layout/StatsBand';
import CtaSection from '../layout/CtaSection';
import Dock from '../components/Dock'

export default function Home() {
  return (
    <>
      <Hero />
      <TrompoIntro />
      <IntroSection />
      <UnitsSection />
      <VerticalsSection />
      <TeamStrip />
      <CarteraSection />
      <QuoteSection />
      <StatsBand />
      <CtaSection />
      <Dock
        links={[
          { anchor: "#sistema", title: "Sistema" },
          { anchor: "#cartera", title: "Cartera" },
        ]}
        cta={{ label: "Hablemos →", to: "/contactanos" }}
      />
    </>
  );
}