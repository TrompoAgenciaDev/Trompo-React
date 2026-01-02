import { useState } from "react";
import { motion } from "framer-motion";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";

//styles
import "../../assets/styles/paid-media.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const PaidMediaItem = ({ title, subtitle, description, footerText, svgStroke = "currentColor" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="grid-item-paid-media"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="header-paid-container">
        <h2 className="paid-title">{title}</h2>
        <span className="paid-subtitle">{subtitle}</span>
      </div>
      <div className="footer-paid-container">
        <p>{description}</p>
        <div className="footer-paid-buttons">
          <span className="paid-subtitle">{footerText}</span>
          <div className="icon-container-paid">
            {/* Fondo amarillo que se expande desde el centro */}
            <motion.div
              className="icon-background-animated"
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{
                clipPath: isHovered ? "circle(100% at 50% 50%)" : "circle(0% at 50% 50%)"
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut"
              }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="170" height="151" viewBox="0 0 170 151" fill="none" style={{ position: "relative", zIndex: 1 }}>
              <path 
                d="M128.404 77.1065L39.7873 77.1065M39.7873 77.1065L84.0958 115.66M39.7873 77.1065L84.0958 38.5533" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Estrategia = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/estrategia-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/estrategia-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/estrategia-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/estrategia-hero-mobile-poster.webp`}
      />
      
      <ServiceTitle area="social media" titulo="Servicios de Paid Media" />


      <div className="full-container black-bg">
        <div className="container">
          <div className="grid-paid-media-container">
            <PaidMediaItem
              title="Google Ads"
              subtitle="Campañas de Alto Intento"
              description="Capturamos demanda real en el momento exacto de búsqueda. Diseñamos, optimizamos y escalamos campañas en Search, Display y Performance Max con foco en leads calificados, ventas y retorno medible."
              footerText="→ Ideal para captar usuarios "
              svgStroke="currentColor"
            />
            <PaidMediaItem
              title="Meta Ads"
              subtitle="Campañas de Alto Intento"
              description={<>Construimos audiencias, generamos demanda y convertimos atención en resultados.<br/> Creamos campañas en Instagram y Facebook combinando creatividad, segmentación y optimización continua para escalar ventas y reconocimiento de marca.</>}
              footerText="→ Ideal para crecer, testear y acelerar resultados."
              svgStroke="#FED332"
            />
          </div>
        </div>
      </div>


      <Contact form="estrategia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Estrategia;
