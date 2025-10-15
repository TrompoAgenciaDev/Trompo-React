import PostHero from "../components/PostHero";
import Hero from "../layout/Hero";
import Members from "../components/Members";
import StoricalClients from "../layout/StoricalClients";
import Contact from "../layout/Contact.jsx";
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";

// styles
import "../assets/styles/about.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Nosotros = () => {
  return (
    <>
      {/* Desktop */}
      <video
        src={`${base}assets/hero/home.mp4`}
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
      </video>

      {/* Mobile */}
      <video
        src={`${base}assets/hero/mobile/home-mobile.mp4`}
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
      </video>

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

      <StoricalClients />

      {/* formulario */}
      <Contact />
      
      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Nosotros;
