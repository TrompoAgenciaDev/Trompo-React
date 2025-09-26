import PostHero from "../components/PostHero";
import Hero from "../layout/Hero";
import Members from "../components/Members";
import StoricalClients from "../layout/StoricalClients";
import Contact from "../layout/Contact.jsx";

// styles
import "../assets/styles/about.css";

const Nosotros = () => {
  return (
    <>
      <Hero location="about" />
      <section className="post-hero-section full-container">
        <div className="container max-text">
          <p>
            Hace más de una década, Trompo nació con una idea clara: una agencia
            no es un proveedor, es un <strong>aliado estratégico.</strong>
            <br />
            <br />
            Desde el inicio, nos propusimos involucrarnos de verdad. Entender el
            ADN de cada marca, sus valores, su visión, su forma de trabajar.
            Porque solo así se construyen estrategias que importan y relaciones
            que trascienden.
            <br />
            <br />
            Fuimos testigos —y protagonistas— de la transformación digital:
            cuando la pauta online era solo un 5% del mix, cuando el "mobile
            first" todavía no existía. Hoy, con un ecosistema donde{" "}
            <strong>tecnología, datos, contenido y audiencias</strong> conviven
            en tiempo real, seguimos acompañando a nuestros clientes con la
            misma convicción de siempre: <strong>estar cerca.</strong>
            <br />
            <br />
            En Trompo, combinamos{" "}
            <strong>
              Estrategia, Creatividad, Interacción, Desarrollo y Soporte
            </strong>
            , para brindar soluciones integrales que generen impacto real.
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
                  más de 10 años resolviendo problemas reales en mercados locales y
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
                  90% de nuestros clientes renuevan su confianza año tras año.
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

      {/* formulario */}
      <Contact />

      <StoricalClients />
    </>
  );
};

export default Nosotros;
