import Hero from "../layout/Hero";

//styles
import "../assets/styles/home.css";
import { motion } from "motion/react";

const Home = () => {
  return (
    <main className="full-container">
      <Hero />

      <section className="section full-container">
        <div className="container home-content">
          <p>
            Somos una agencia digital que combina{" "}
            <span className="bold">creatividad, estrategia Y tecnología</span>
            para diseñar soluciones integrales que generan impacto.
          </p>
        </div>
      </section>

      <section className="video-section full-container">
        <div className="full-container">
          <div className="video-container"></div>
          <div className="video-container"></div>
          <div className="video-container"></div>
          <div className="video-container"></div>
        </div>

        <div className="container home-content">
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
          <a href="/casos" className="">
            Todos los proyectos
            <svg
              height="21"
              viewBox="0 0 21 21"
              width="21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(4 6)"
              >
                <path d="m9.5.497 4 4.002-4 4.001" />
                <path d="m.5 4.5h13" />
              </g>
            </svg>
          </a>
        </div>
      </section>

      <section className="bg-yellow full-container">
        <div className="banner full-container">
          <picture className="full-container mobile-banner">
            <source srcSet="/banner1-home-mobile.webp" type="image/webp" />
            <source srcSet="/banner1-home-mobile.png" type="image/png" />
            <img src="/banner-home.png" alt="Banner Home" />
          </picture>
          <picture className="full-container desktop-banner">
            <source srcSet="/banner1-home-desktop.webp" type="image/webp" />
            <source srcSet="/banner1-home-desktop.png" type="image/png" />
            <img src="/banner1-home-desktop.png" alt="Banner Home" />
          </picture>
        </div>

        <div className="container">
          <p className="show-effect">
            Con un Equipo interdisciplinario y años de experiencia, nos
            especializamos en entender las necesidades de cada cliente y
            convertirlas en <span className="bold">oportunidades</span> que
            impulsen hsu crecimiento.
          </p>
        </div>

        <div className="container">
          <div className="grid-services">
            <div className="grid-row">
              <div className="header-grid">
                <span>
                  <span className="title-grid"> identidad</span>
                  <span className="hover-show">
                    {" "}
                    <span className="title-grid"> que conecta</span>
                    <p>
                      Branding, diseño y multimedia para marcas con propósito.
                    </p>
                  </span>
                </span>
              </div>
            </div>
            <div className="grid-row">
              <div className="header-grid">
                <span>
                  <span className="title-grid"> desarrollo web</span>
                  <span className="hover-show">
                    {" "}
                    <span className="title-grid"> que evoluciona</span>
                    <p>Sitios que no se detienen, se adaptan y crecen</p>
                  </span>
                </span>
              </div>
            </div>
            <div className="grid-row">
              <div className="header-grid">
                <span>
                  <span className="title-grid">ads</span>
                  <span className="hover-show">
                    <span className="title-grid"> inteligentes</span>
                    <p>Publicidad con dirección, optimización y resultados.</p>
                  </span>
                </span>
              </div>
            </div>
            <div className="grid-row">
              <div className="header-grid">
                <span>
                  <span className="title-grid">redes sociales</span>
                  <span className="hover-show">
                    <span className="title-grid"> que transforman</span>
                    <p>
                      Estrategias que conectan. Contenidos que provocan
                      respuesta.
                    </p>
                  </span>
                </span>
              </div>
            </div>
            <div className="grid-row">
              <div className="header-grid">
                <span>
                  <span className="title-grid">soporte</span>
                  <span className="hover-show">
                    <span className="title-grid"> continuo</span>
                    <p>
                      Soporte técnico y creativo para que tu marca no se
                      detenga.
                    </p>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-container">
        <div className="slider-conainer container">


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
        <div className="container">
          <motion.p
            className="text-show-effect"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-200px" }}
            variants={{
              hidden: {},
              visible: {},
            }}
          >
            {"Creamos contenido relevante, gestionamos comunidades y potenciamos tu marca en redes sociales con estrategia, diseño y foco en resultados."
              .split("")
              .map((char, idx) => (
                <motion.span
                  key={idx}
                  style={{ display: "inline-block" }}
                  initial={{ opacity: 0.2 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.01, duration: 0.7 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
          </motion.p>
        </div>
      </section>

    </main>
  );
};

export default Home;