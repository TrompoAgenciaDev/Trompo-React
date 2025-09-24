import { Link } from "react-router-dom";
//styles
import "../assets/styles/home.css";
import { motion } from "motion/react";

//components
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import PubliSlides from "../components/sliders/PubliSlides";
import Testimonials from "../components/Testimonials";
import PostCard from "../components/posts/PostCard";
import Hero from "../layout/Hero";
import Services from "../layout/Services";
import Contact from "../layout/Contact";
import PostHero from "../components/PostHero";
import Portfolio3d from "../layout/Portfolio3d";

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
      <Hero />

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
      <div className="full-container bg-yellow-2">
        <div className="full-container title-portfolio-container">
          <div className="container"></div>
          <div className="container">
            <h3 className="portfolio3d-title">Proyectos con impacto</h3>
            <p>
              Cada proyecto en nuestro portfolio muestra cómo transformamos
              ideas en experiencias tangibles. A través de colaboraciones
              estratégicas, desarrollamos soluciones que conectan con las
              audiencias y generan valor perdurable para cada negocio.
            </p>
          </div>
        </div>
        <Portfolio3d location="desarrollo" categoria="3d" />
      </div>

      {/* formulario */}
      <Contact form="home"/>

      <section className="full-container">      

        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </main>
  );
};

export default Home;
