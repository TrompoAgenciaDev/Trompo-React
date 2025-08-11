import PostHero from "../components/PostHero";
import Hero from "../layout/Hero";
import Members from "../components/Members";

// styles
import "../assets/styles/about.css";

const About = () => {
  const text = (
    <p className="text-posthero">
      En Trompo <span className="bold">no creemos en soluciones mágicas. </span>
      Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real.
      Desde Córdoba Capital, ayudamos a empresas a convertir desafíos digitales
      en ventajas competitivas.
    </p>
  );
  return (
    <>
      <Hero location="about" />
      <PostHero text={text} />

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
          <p>
            Nuestra mayor satisfacción no son los premios, sino ver crecer
            negocios que confiaron en nosotros: desde pymes cordobesas hasta
            marcas acionales que hoy lideran sus mercados.
          </p>
          <p>
            Si buscas un proveedor que desaparezca al entregar un proyecto, no
            somos tu opción.
          </p>
          <p>Si valoras un socio que camine a tu lado, hablemos.</p>
        </div>
        <div className="container">
          <Members />
        </div>
      </section>
      {/* 
      <section className="full-container bg-yellow">
        <div className="grid-content">
          <div className="grid-item">
            <h2>¿Por qué contratar una agencia especializada?</h2>
            <p>
              En Argentina es común ver proyectos web realizados con bajos
              presupuestos y sin planificación técnica, lo que genera sitios mal
              desarrollados, poco escalables y difíciles de mantener.
            </p>
            <p>
              En Trompo ofrecemos una alternativa profesional, con beneficios
              reales:
            </p>
          </div>
          <div className="grid-item">
            <div className="container">
              
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default About;
