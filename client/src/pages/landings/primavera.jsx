import { Link } from "react-router-dom";

import Hero from "../../layout/Hero.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import Testimonials from "../../components/Testimonials.jsx";

import "../../assets/styles/landing-primavera.css";

const Primavera = () => {
  const BASE = import.meta.env.BASE_URL;

  return (
    <>
      <section className="hero-landing full-container">
        <picture>
          {/* Imagen desktop */}
          <source
            media="(min-width: 1024px)"
            srcSet={`${BASE}assets/landing/primavera.webp`}
          />
          {/* Imagen mobile (default) */}
          <img
            src={`${BASE}assets/landing/primavera-mobile.webp`}
            alt="Hero Landing"
            className="hero-image"
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

      <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>Más que clientes, aliados estratégicos.</h4>
          <p>Historias que muestran el valor de trabajar en equipo.</p>
        </div>
        <div className="full-container">
          <Testimonials size={4} />
        </div>
      </section>

      <Faqs location="landing" />
      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Primavera;
