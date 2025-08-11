import { Link } from "react-router-dom";

//styles
import "../assets/styles/home.css";
import { motion } from "motion/react";

//components
import VideoSlider from "../components/sliders/VideoSlider";
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import PubliSlides from "../components/sliders/PubliSlides";
import Testimoniales from "../components/Testimoniales";
import PostCard from "../components/posts/PostCard";
import Hero from "../layout/Hero";
import YellowSection from "../layout/YellowSection";
import Contact from "../layout/Contact";
import PostHero from "../components/PostHero.jsx";

const Home = () => {
  const text = (
    <p>
      Somos una agencia digital que combina{" "}
      <span className="bold">creatividad, estrategia y tecnología</span>
      para diseñar soluciones integrales que generan impacto.
    </p>
  );
  return (
    <main className="full-container">
      <Hero />

      <PostHero text={text} />

      <section className="video-section full-container">
        <div className="full-container">
          <VideoSlider location={"home"} />
        </div>

        <div className="container home-content">
          <motion.p
            className="text-show-effect-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-300px" }}
            variants={{
              hidden: {},
              visible: {},
            }}
          >
            {[
              "Detrás de cada proyecto hay un antes de incertidumbre y un después",
              "con metas superadas. Mostramos el proceso, no solo el brillo final.",
              "Porque en marketing, lo que no se mide es humo.",
            ].map((line, idx) => (
              <motion.span
                key={idx}
                style={{ display: "block" }}
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.3, duration: 1 }}
              >
                {line}
              </motion.span>
            ))}
          </motion.p>
          <Link href="#" className="read-more-link">
            Todos los proyectos
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
                stroke="#1E1E1E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      <YellowSection type="services" />

      <section className="full-container">
        <div className="slider-conainer container">
          <CustomerSlider />
        </div>

        <div className="banner full-container">
          <picture className="full-container mobile-banner">
            <source srcSet="/banner2-home-mobile.webp" type="image/webp" />
            <source srcSet="/banner2-home-mobile.png" type="image/png" />
            <img src="/banner2-home-mobile.png" alt="Banner Home" />
          </picture>
          <picture className="full-container desktop-banner">
            <source srcSet="/banner2-home-desktop.webp" type="image/webp" />
            <source srcSet="/banner2-home-desktop.png" type="image/png" />
            <img src="/banner2-home-desktop.png" alt="Banner Home" />
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

      <section className="full-container">
        <div className="container social-post-container">
          <motion.p
            className="text-show-effect"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-300px" }}
            variants={{
              hidden: {},
              visible: {},
            }}
          >
            {[
              "Creamos contenido relevante, gestionamos",
              "comunidades y potenciamos tu marca en",
              "redes sociales con estrategia, diseño y foco",
              "en resultados.",
            ].map((line, idx) => (
              <motion.span
                key={idx}
                style={{ display: "block" }}
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.3, duration: 1 }}
              >
                {line}
              </motion.span>
            ))}
          </motion.p>
          <PubliSlides />
        </div>
      </section>

      <section className="full-container">
        <PostCard initialLimit={3} maxLimit={3} />
        <div className="container text-show-effect post-notes">
          <span>
            Guías, casos y análisis para optimizar tu presencia digital.
          </span>
          <Link to={"#"} className="read-more-link">
            Ver todas las notas
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
                stroke="#1E1E1E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      <section className="full-container testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>La voz de nuestros clientes.</h4>
          <p>
            Testimonios de profesionales que han visto resultados concretos en
            sus proyectos.
          </p>
        </div>
        <div className="container">
          <Testimoniales />
        </div>
      </section>

      <Contact />
    </main>
  );
};

export default Home;
