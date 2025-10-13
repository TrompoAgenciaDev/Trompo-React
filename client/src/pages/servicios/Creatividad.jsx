import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import CreatividadSlider from "../../components/sliders/CreatividadSlider";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";

//styles
import "../../assets/styles/creatividad.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Creatividad = () => {
  return (
    <>
      <video
        className="hero-video desktop-only"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        poster={`${base}assets/hero/creatividad-hero-poster.webp`}
      >
        <source src={`${base}assets/hero/creatividad-hero.mp4`} type="video/mp4" />
      </video>

      <video
        className="hero-video mobile-only"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        poster={`${base}assets/hero/mobile/creatividad-hero-mobile-poster.webp`}
      >
        <source src={`${base}assets/hero/mobile/creatividad-hero-mobile.mp4`} type="video/mp4" />
      </video>

      <PageTitle
        title="Creatividad"
        subtitle="que conecta"
        highlight="La creatividad aplicada al marketing <strong>cuenta tu historia y mueve métricas</strong>. Llevamos tu propósito a <strong>sistemas y piezas multiformat</strong> que destacan, ordenan la marca y te diferencian <strong>dónde está tu audiencia</strong>. Consistencia visual, <strong>velocidad de producción</strong> y foco en performance. <strong>Procesos</strong> para escalar la identidad y cultura de tu marca. "
        bgc="#FEE070"
      />
      <section className="full-container identidad">
        <div className="full-container identidad-diagonal bg-yellow-2">
          <div className="container identidad-grid">
            <div className="grid-item-identidad">
              <div className="title-section-container">
                <h2>Branding digital</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Diseñamos o renovamos la identidad de tu marca de punta a punta. Del <strong>posicionamiento y la narrativa</strong> al <strong>sistema visual y verbal</strong>: logo y variantes, paleta, tipografías, iconografía, tono y principios de movimiento. Lo dejamos <strong>operativo</strong> en web, redes y campañas con <strong>manuales y lineamientos de marca</strong>. Resultado: una marca <strong>coherente, profesional y reconocible</strong> que <strong>ordena, diferencia y escala.</strong> Ideal para <strong>lanzamientos</strong> o <strong>reposicionamientos</strong> en mercados competitivos.
                </p>
              </div>
            </div>
            <div className="grid-item-identidad">
              <img
                src={`${import.meta.env.BASE_URL}assets/identidad/identidad.webp`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="full-container identidad-diagonal bg-yellow-2">
          <div className="container identidad-grid">
            <div className="grid-item-identidad">
              <div className="title-section-container">
                <h2>Multimedia</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Contenido que <strong>mueve gente</strong>. De reels y stories a banners y presentaciones, producimos materiales que <strong>dicen lo importante sin vueltas</strong> y mantienen la <strong>misma línea de marca</strong> en todas las plataformas. Resultado: <strong>más alcance, más interacción y más oportunidades</strong>.
                </p>
              </div>
            </div>
            <div className="grid-item-identidad">
              <video
                className="identidad-video"
                src={`${import.meta.env.BASE_URL}assets/identidad/volvo-identidad.mp4`}
                muted
                autoPlay
                poster={`${base}assets/identidad/volvo-identidad-poster.webp`}
              ></video>
            </div>
          </div>
        </div>

        <div className="full-container identidad-diagonal"></div>
      </section>

      <div className="full-container creatividad-video-section">
        <div className="container">
          <CreatividadSlider />
        </div>
      </div>

      <Contact form="creatividad" />

      <Faqs location="creatividad" />

      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Creatividad;
