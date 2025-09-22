import PostHero from "../components/PostHero";
import Hero from "../layout/Hero";
import Values from "../layout/Values";
import Members from "../components/Members";
import StoricalClients from "../layout/StoricalClients";

// styles
import "../assets/styles/about.css";

const Nosotros = () => {
  return (
    <>
      <Hero location="about" />
      <section className="post-hero-section full-container">
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

      <section className="bg-yellow full-container">
        <div className="container about-content">
          <h4>Lo que nos define</h4>
          <div className="grid-about">
            <div className="grid-about-item">
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
              <div className="grid-item-content">
                <span className="header-item-content">
                  Experiencia con raíces
                </span>
                <p className="footer-item-content">
                  20 años resolviendo problemas reales en mercados locales y
                  nacionales.
                </p>
              </div>
            </div>
            <div className="grid-about-item">
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
              <div className="grid-item-content">
                <span className="header-item-content">
                  Compromiso verificable
                </span>
                <p className="footer-item-content">
                  92% de nuestros clientes renuevan su confianza año tras año.
                </p>
              </div>
            </div>
            <div className="grid-about-item">
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
              <div className="grid-item-content">
                <span className="header-item-content">
                  Equipo multidisciplinario
                </span>
                <p className="footer-item-content">
                  Unimos estrategas, diseñadores y técnicos que trabajan en
                  conjunto.
                </p>
              </div>
            </div>
            <div className="grid-about-item">
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
              <div className="grid-item-content">
                <span className="header-item-content">
                  Transparencia operativa
                </span>
                <p className="footer-item-content">
                  Hablamos claro sobre lo que podemos lograr (y lo que no).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-container about-section">
        <div className="container about-content-text">
          <h2>Un equipo que se mueve con vos</h2>
          <p>
            En Trompo creemos que las marcas que crecen nunca se quedan quietas.
            Por eso, nuestro equipo tampoco. Somos profesionales del marketing,
            la creatividad, la tecnología y la estrategia, con una misma
            convicción: trabajar codo a codo con cada cliente, como parte de su
            equipo.
          </p>
        </div>
        <div className="container">
          <Members />
        </div>
      </section>

      <section className="full-container">
        <Values />
      </section>

      <StoricalClients />
    </>
  );
};

export default Nosotros;
