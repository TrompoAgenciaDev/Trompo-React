import Hero from "../../layout/Hero.jsx";
import Values from "../../layout/Values.jsx";
import PostCard from "../../components/posts/PostCard.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Icons from "../../components/Icons.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";

//styles
import "../../assets/styles/social-media.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Interaccion = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/interaccion-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/interaccion-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/home-mobile-poster.webp`}
      />

      
      <ServiceTitle area="Social Media" titulo="Servicios de interacción" />

      <div className="full-container files-carousel-container">
        <div className="full-container">
          
        </div>
      </div>

      <div className="full-container">
        <div className="container">
          <p>
            <span className="yellow">Las redes sociales</span>
            son el espacio donde las marcas conversan, escuchan y construyen comunidad.
          </p>
        </div>
      </div>

      <Faqs location="interaccion" />

      <Contact form="interaccion" />
      
      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Interaccion;
