import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Values from "../../layout/Values";
import PostCard from "../../components/posts/PostCard";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import Icons from "../../components/Icons";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";

//styles
import "../../assets/styles/interaccion.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Interaccion = () => {
  return (
    <>
      {/* Desktop */}
      <video
        className="hero-video desktop-only"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        poster={`${base}assets/hero/home-poster.webp`}
      >
        <source src={`${base}assets/hero/interaccion.mp4`} type="video/mp4" />
      </video>

      {/* Mobile */}
      <video
        className="hero-video mobile-only"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        poster={`${base}assets/hero/mobile/home-mobile-poster.webp`}
      >
        <source src={`${base}assets/hero/mobile/interaccion-mobile.mp4`} type="video/mp4" />
      </video>

      <PageTitle
        title="Interacción"
        subtitle="que transforma"
        highlight="Relevancia sostenida en <strong>Social Media</strong> —grilla con intención, formatos nativos y conversación real— más <strong>Automation Marketing</strong> que toma la posta con emails y flujos segmentados. Menos ruido, más señal: consistencia de mensajes, continuidad de contacto y una relación que se traduce en oportunidades."
        bgc="#FEE070"
      />
      <section className="full-container interaccion">
        <div className="full-container interaccion-diagonal bg-yellow-2"></div>
        <div className="full-container">
          <div className="container interaccion-grid">
            <div className="grid-item-interaccion">
              <img
                className="interaccion-img"
                src={`${import.meta.env.BASE_URL}assets/interaccion/interaccion-1.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-interaccion">
              <div className="title-section-container">
                <h2>Social Media</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Social Media es el proceso de planificar y crear contenido estratégico, organizado en una matriz que asegura coherencia y relevancia. Creamos un sistemas alineado a la marca, cada tópico se adapta a un diseño con el social brand de la marca, potenciando su identidad y generando conexión real con la audiencia digital.
                </p>
                <div className="icon-section-container">
                  <Icons iconName="instagram2" />
                  <Icons iconName="face2" />
                  <Icons iconName="linkedin2" />
                  <Icons iconName="x2" />
                  <Icons iconName="tiktok2" />
                  <Icons iconName="youtube2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="full-container interaccion-diagonal bg-yellow-2"></div>
        <div className="full-container">
          <div className="container interaccion-grid">
            <div className="grid-item-interaccion">
              <img
                src={`${import.meta.env.BASE_URL}assets/interaccion/interaccion-2.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-interaccion">
              <div className="title-section-container">
                <h2>Automation Marketing</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Construimos un sistema de <strong>conversación continua</strong> con tus audiencias: <strong>flujos automatizados</strong>, newsletters y mensajes por comportamiento que acompañan todo el ciclo (bienvenida, nutrición, activación, postventa y reactivación). Segmentación real, timing correcto e integración con CRM para convertir atención en <strong>leads y ventas</strong> sin depender del algoritmo. El contenido inbound acompaña, la <strong>automatización</strong> hace que suceda.
                </p>
                <div className="icon-section-container">
                  <Icons iconName="mail2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="full-container bg-yellow-2 interaccion-portfolio-container">
        <div className="full-container title-portfolio-container">
          <div className="container"></div>
          <div className="container">
            <h3>
              Transformamos ideas en plataformas digitales que impulsan negocios
            </h3>
            <p>
              Arquitectura técnica impecable, experiencias de usuario intuitivas
              y resultados medibles que convierten cada proyecto en un activo de
              crecimiento.
            </p>
          </div>
        </div>
        <Portfolio3d location="interaccion" categoria="3d" />
      </div>

      <Contact form="interaccion" />

      <Faqs location="interaccion" />

      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Interaccion;
