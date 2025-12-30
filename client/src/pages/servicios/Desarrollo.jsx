import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import Hero from "../../layout/Hero.jsx";
import Values from "../../layout/Values.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import Testimonials from "../../components/Testimonials.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";

import "../../assets/styles/servicios-page.css";
import "../../assets/styles/desarrollo.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const InfiniteSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  // 6 copias para crear un loop infinito más fluido
  const items = Array(6).fill(text);

  return (
    <motion.div 
      className="infinite-slider"
      animate={{
        x: shouldReduceMotion ? 0 : ['0%', '-50%']
      }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear"
        }
      }}
    >
      {items.map((item, index) => (
        <h1 key={index} className="infinite-slider-item">{item}</h1>
      ))}
      {items.map((item, index) => (
        <h1 key={`duplicate-${index}`} className="infinite-slider-item">{item}</h1>
      ))}
    </motion.div>
  );
};

const Desarrollo = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/desarrollo-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/desarrollo-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/desarrollo-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/desarrollo-hero-mobile-poster.webp`}
      />

      <div className="full-container black-bg">
        <div className="full-container title-portfolio-container">
          <div className="container"></div>
          <div className="container">
            <h3>
              Transformamos ideas en plataformas digitales que impulsan negocios
            </h3>
          </div>
        </div>
        <Portfolio3d location="desarrollo" categoria="3d" />
      </div>

      <div className="full-container strategy-container">
        <div className="full-container infinite-slider-container">
          <InfiniteSlider text="Qué hacemos" />
        </div>

        <div className="full-container grid-strategy">
          <div className="full-container strategy-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-strategy">
                <span className="number-title">01</span>
                <span>Infraestructura Digital</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  Desarrollamos sitios web, aplicaciones y plataformas sólidas, seguras y escalables, pensadas para sostener el crecimiento del negocio y adaptarse a futuras necesidades.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container strategy-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-strategy">
                <span className="number-title">02</span>
                <span>Experiencia de Usuario (UX/UI)</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  Diseñamos interfaces intuitivas y funcionales que conectan diseño y usabilidad, optimizando cada interacción para que el recorrido del usuario sea claro, fluido y efectivo.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container strategy-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-strategy">
                <span className="number-title">03</span>
                <span> Diseño, Tecnología y Conversión</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  Integramos estrategia, diseño y desarrollo para crear productos digitales que no solo se ven bien, sino que funcionan con precisión y convierten visitantes en clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Contact form="desarrollo"/>

      <Faqs location="desarrollo" />
      
      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Desarrollo;
