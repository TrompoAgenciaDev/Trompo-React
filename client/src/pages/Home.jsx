import { Link } from "react-router-dom";
//styles
import "../assets/styles/home.css";
import { motion } from "motion/react";
import "@as/hero.css";

//components
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import PubliSlides from "../components/sliders/PubliSlides";
import Testimonials from "../components/Testimonials";
import PostCard from "../components/posts/PostCard";
// import Hero from "../layout/Hero";
import Services from "../layout/Services";
import Contact from "../layout/Contact";
import PostHero from "../components/PostHero";
import Portfolio3d from "../layout/Portfolio3d";
import CreatividadSlider from "../components/sliders/CreatividadSlider.jsx";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Home = () => {
  const text = (
    <p>
      Somos una agencia digital que combina{" "}
      <span className="bold">creatividad, estrategia y tecnología</span> para
      diseñar soluciones integrales que generan impacto.
    </p>
  );

  return (
    <main className="full-container">
      {/* Desktop */}
      <video
        className="hero-video desktop-only"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        poster={`${base}assets/hero/home.webp`}
      >
        <source src={`${base}assets/hero/home.mp4`} type="video/mp4" />
      </video>

      {/* Mobile */}
      <video
        className="hero-video mobile-only"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        poster={`${base}assets/hero/mobile/home.webp`}
      >
        <source src={`${base}assets/hero/mobile/home-mobile.mp4`} type="video/mp4" />
      </video>

      <section className="post-hero-section full-container">
        <PostHero text={text} />
      </section>

      <section className="post-hero-section full-container">
        <div className="bg-yellow separator full-container"></div>
        <div className="container max-text">
          <p>
            <strong>
              En Trompo entendemos que una marca no se mantiene estática:
              evoluciona.
            </strong>{" "}
            Por eso combinamos estrategia, creatividad e innovación tecnológica
            para diseñar soluciones digitales que impulsan el crecimiento,
            fortalecen la identidad y generan resultados medibles. Nos
            involucramos en cada etapa del proceso, acompañando a nuestros
            clientes con una visión integral que conecta a las marcas con sus
            audiencias de manera auténtica, relevante y sostenida en el tiempo
          </p>
        </div>
      </section>

      {/* Servicios que se ofrecen */}
      <Services />

      {/* Portfolio - clientes grandes */}
      <div className="full-container creatividad-video-section">
        <div className="container">
          <h1 className="services-title">
            Nuestros <span className="secondary-font">proyectos</span>
          </h1>
        </div>
        <div className="container">
          <CreatividadSlider />
        </div>
      </div>

      {/* formulario */}
      <Contact form="home" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </main>
  );
};

export default Home;
