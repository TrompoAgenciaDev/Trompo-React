import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";

//styles
import "../../assets/styles/creatividad.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Multimedia = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/multimedia-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/multimedia-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/multimedia-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/multimedia-hero-mobile-poster.webp`}
      />

      <PageTitle
        title="Multimedia"
        subtitle="que impacta"
        highlight="Contenido visual y audiovisual que captura y comunica. Producción de videos, animaciones, gráficos en movimiento y contenido multimedia que potencia tu marca en todos los canales digitales."
        bgc="#FEE070"
      />
      <section className="full-container identidad">
        <div className="full-container identidad-diagonal bg-yellow-2">
          <div className="container identidad-grid">
            <div className="grid-item-identidad">
              <div className="title-section-container">
                <h2>Producción multimedia</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Contenido que <strong>mueve gente</strong>. De reels y stories a banners y presentaciones, producimos materiales que <strong>dicen lo importante sin vueltas</strong> y mantienen la <strong>misma línea de marca</strong> en todas las plataformas. Resultado: <strong>más alcance, más interacción y más oportunidades</strong>.
                </p>
              </div>
            </div>
            <div className="grid-item-identidad">
              <img
                src={`${import.meta.env.BASE_URL}assets/multimedia/multimedia.webp`}
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="full-container identidad-diagonal"></div>
      </section>

      <Faqs location="multimedia" />

      <Contact form="multimedia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Multimedia;

