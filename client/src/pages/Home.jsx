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
      <div className="full-container portfolio-home-3d">
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

        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </div>

      {/* formulario */}
      <Contact location="home" />

      {/* Redes Sociales */}
      <section className="full-container social-post-container-full">
        <div className="container social-post-container">
          <motion.p
            className="text-show-effect"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-300px" }}
            variants={{ hidden: {}, visible: {} }}
          >
            {[
              "Creamos contenido relevante, gestionamos comunidades y potenciamos tu marca en redes sociales con estrategia, diseño y foco en resultados.",
            ].map((line, lineIdx) =>
              line.split(" ").map((word, wordIdx) => (
                <motion.span
                  key={`${lineIdx}-${wordIdx}`}
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                  initial={{ opacity: 0.1 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    delay: lineIdx * 0.3 + wordIdx * 0.05,
                    duration: 0.6,
                  }}
                >
                  {word}
                </motion.span>
              ))
            )}
          </motion.p>

          <PubliSlides />
        </div>
      </section>

      {/* Carrusel de logos + imagen grande */}
      <section className="full-container">
        <div className="banner full-container">
          <picture className="full-container mobile-banner">
            <source
              srcSet={`${import.meta.env.BASE_URL}sala.webp`}
              type="image/webp"
            />
            <source
              srcSet={`${import.meta.env.BASE_URL}sala-d.png`}
              type="image/png"
            />
            <img
              src={`${import.meta.env.BASE_URL}sala-d.png`}
              alt="Banner Home"
            />
          </picture>
          <picture className="full-container desktop-banner">
            <source
              srcSet={`${import.meta.env.BASE_URL}sala.webp`}
              type="image/webp"
            />
            <source
              srcSet={`${import.meta.env.BASE_URL}sala-d.png`}
              type="image/png"
            />
            <img
              src={`${import.meta.env.BASE_URL}sala-d.png`}
              alt="Banner Home"
            />
          </picture>
        </div>
      </section>

      <section className="full-container">
        <div className="container text-home">
          <h3 className="bold">
            En Trompo, cada estrategia se construye sobre valores fundamentales.
          </h3>
          <p>
            Con 20 años de trayectoria, aprendimos que la confianza se construye
            con acciones concretas. Así garantizamos no solo éxito inmediato,
            sino crecimiento perdurable para su marca.
          </p>
        </div>
      </section>

      <section className="full-container grid-text">
        <div className="grid-text-home">
          <span>Resultados medibles</span>
        </div>
        <div className="grid-text-home">
          <span>Transparencia total</span>
        </div>
        <div className="grid-text-home">
          <span>Compromiso a largo plazo</span>
        </div>
      </section>

      {/* Blog - notas */}
      <section className="full-container post-container-home">
        <PostCard initialLimit={3} maxLimit={3} category={"desarrollo web"} />
      </section>

      <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>La voz de nuestros clientes.</h4>
          <p>
            Testimonios de profesionales que han visto resultados concretos en
            sus proyectos.
          </p>
        </div>
        <div className="container">
          <Testimonials size={2} />
        </div>
      </section>
    </main>
  );
};

export default Home;
