import PostHero from "../components/PostHero";
import Hero from "../layout/Hero";
import Members from "../components/Members";
import StoricalClients from "../layout/StoricalClients";
import Contact from "../layout/Contact.jsx";
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../components/SimpleHeroVideo";

// styles
import "../assets/styles/about.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Nosotros = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/home2.mp4`}
        mobileSrc={`${base}assets/hero/mobile/home-mobile2.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

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
            <strong>tecnología, datos, IA, contenido y audiencias</strong> conviven
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

      <section className="full-container about-section bg-yellow-2">
        <div className="container about-content-text">
          <h2>Un equipo que se mueve con vos</h2>
          <p>
            En Trompo creemos que las marcas que crecen nunca se quedan quietas.
            Por eso, nuestro equipo tampoco.
          </p>
        </div>
        <div className="container">
          <Members />
        </div>
      </section>

      <StoricalClients />

      {/* formulario */}
      <Contact />
    </>
  );
};

export default Nosotros;
