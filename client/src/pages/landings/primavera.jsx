import { Link } from "react-router-dom";

import Hero from "../../layout/Hero.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";

import "../../assets/styles/landing-primavera.css";

const Primavera = () => {
  const BASE = import.meta.env.BASE_URL;

  return (
    <>
      <section className="hero-landing full-container">
        <picture>
          {/* Imagen desktop con múltiples tamaños */}
          <source
            media="(min-width: 1024px)"
            srcSet={`
              ${BASE}assets/landing/primavera.webp 1920w,
              ${BASE}assets/landing/primavera-800w.webp 800w,
              ${BASE}assets/landing/primavera-1200w.webp 1200w
            `}
            sizes="100vw"
          />
          {/* Imagen mobile con múltiples tamaños (default) */}
          <img
            src={`${BASE}assets/landing/primavera-mobile.webp`}
            srcSet={`
              ${BASE}assets/landing/primavera-mobile.webp 1200w,
              ${BASE}assets/landing/primavera-mobile-400w.webp 400w,
              ${BASE}assets/landing/primavera-mobile-800w.webp 800w
            `}
            sizes="100vw"
            alt="Hero Landing"
            className="hero-image"
            width={1920}
            height={1080}
            style={{ aspectRatio: '16/9', maxWidth: '100%', height: 'auto' }}
            loading="eager"
            decoding="async"
          />
        </picture>
      </section>

      <div className="full-container bg-yellow-2">
        <div className="full-container title-portfolio-container">
          <div className="container"></div>
          <div className="container">
            <h3>
              Transformamos ideas en plataformas digitales que impulsan negocios
            </h3>
            <p>
              Arquitectura técnica impecable, experiencias de usuario intuitivas
              y resultados medibles que convierten cada proyecto en un activo de
              crecimiento.
            </p>
          </div>
        </div>
        <Portfolio3d location="desarrollo" categoria="3d" />
      </div>

      <Contact location="home" />

      <Faqs location="landing" />
      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Primavera;
