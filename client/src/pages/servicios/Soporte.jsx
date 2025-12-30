import { Link } from "react-router-dom";

import Hero from "../../layout/Hero";
import Values from "../../layout/Values";
import Portfolio3d from "../../layout/Portfolio3d";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Testimonials from "../../components/Testimonials.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";

//styles
import "../../assets/styles/soporte-page.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Soporte = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/soporte-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/soporte-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <section className="full-container soporte">
        <div className="full-container soporte-diagonal-invertida">
          <img
            src={`${base}assets/support/soporte-img-2.webp`}
            alt=""
          />
        </div>
        <div className="full-container soporte-diagonal bg-yellow-2">
          <div className="container soporte-grid">
            <div className="grid-item-soporte">
              <div className="title-section-container">
                <h2>Soporte Wordpress</h2>
              </div>
            </div>
            <div className="grid-item-soporte">
              <p>
                Wordpress en movimiento es nuestro sistema de gestión evolutiva
                para sitios WordPress. Un servicio pensado para empresas que
                necesitan mantener su web actualizada, funcional y alineada al
                negocio, sin depender de imprevistos técnicos ni cuellos de
                botella.
              </p>
            </div>
          </div>
        </div>
        <div className="full-container soporte-diagonal-invertida">
          <img
            src={`${base}assets/support/soporte-img.webp`}
            alt=""
          />
        </div>
        <div className="full-container soporte-diagonal bg-yellow-2">
          <div className="container soporte-grid">
            <div className="grid-item-soporte">
              <div className="title-section-container">
                <h2>Soporte Personalizado</h2>
              </div>
            </div>
            <div className="grid-item-soporte">
              <p>
                Soporte personalizado para desarrollos a medida. Mantenemos tu
                plataforma estable y segura, resolvemos incidencias, sumamos
                funcionalidades, integramos sistemas (APIs, ERP/CRM) y ajustamos
                servidores para que todo rinda como debe. Si falla, lo
                arreglamos; si puede ir mejor, lo optimizamos.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-2 full-container soporte-diagonal-invertida">
          <img
            src={`${base}assets/support/full-img-2.webp`}
            alt=""
          />
        </div>
        <div className="full-container soporte-diagonal bg-yellow-2">
          <div className="container soporte-grid">
            <div className="grid-item-soporte">
              <div className="title-section-container">
                <h2>Soporte Creativo</h2>
              </div>
            </div>
            <div className="grid-item-soporte">
              <p>
                Soporte Creativo es la operación continua que ordena y escala tus piezas: social media, web, adaptaciones, motion y presentaciones, siempre alineadas al negocio. Entregas ágiles, plantillas escalables y control de calidad para sostener coherencia y velocidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Faqs location="soporte" />

      <Contact form="soporte"/>

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Soporte;
