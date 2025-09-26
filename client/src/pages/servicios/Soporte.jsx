import { Link } from "react-router-dom";

import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Values from "../../layout/Values";
import Portfolio3d from "../../layout/Portfolio3d";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Testimonials from "../../components/Testimonials.jsx";

//styles
import "../../assets/styles/soporte-page.css";

const Soporte = () => {
  return (
    <>
      <Hero location="desarrollo" />
      <PageTitle
        title="Soporte"
        subtitle="continuo"
        highlight="En Trompo soporte es pensado para marcas que buscan crecer sin frenos. Desde la gestión y optimización web (código y WordPress) hasta el desarrollo creativo en multimedia y branding, acompañamos cada etapa con soluciones estratégicas. Un servicio continuo que asegura presencia, coherencia y resultados en tu comunicación digital."
        bgc="#ffffff"
      />

      <section className="full-container soporte">
        <div className="full-container soporte-diagonal-invertida">
          <img
            src={`${import.meta.env.BASE_URL}assets/support/full-img-1.webp`}
            alt=""
          />
        </div>
        <div className="full-container soporte-diagonal bg-yellow-2">
          <div className="container soporte-grid">
            <div className="grid-item-soporte">
              <div className="title-section-container">
                <h2>Soporte Wordpress</h2>
                <span>Wordpress & Code</span>
              </div>
            </div>
            <div className="grid-item-soporte">
              <p>
                Construimos experiencias focalizadas que transforman tráfico en
                leads cualificados, ventas directas o adopción de promociones.
                Método basado en arquitectura conversiva, microcopys
                estratégicos y eliminación sistemática de fricciones para
                maximizar ROI por visita.
              </p>
            </div>
          </div>
        </div>
        <div className="full-container soporte-diagonal-invertida">
          <img
            src={`${import.meta.env.BASE_URL}assets/support/full-img-1.webp`}
            alt=""
          />
        </div>
        <div className="full-container soporte-diagonal bg-yellow-2">
          <div className="container soporte-grid">
            <div className="grid-item-soporte">
              <div className="title-section-container">
                <h2>Soporte personalizado</h2>
                <span>Wordpress & Code</span>
              </div>
            </div>
            <div className="grid-item-soporte">
              <p>
                Construimos experiencias focalizadas que transforman tráfico en
                leads cualificados, ventas directas o adopción de promociones.
                Método basado en arquitectura conversiva, microcopys
                estratégicos y eliminación sistemática de fricciones para
                maximizar ROI por visita.
              </p>
            </div>
          </div>
        </div>
        <div className="full-container soporte-diagonal-invertida">
          <img
            src={`${import.meta.env.BASE_URL}assets/support/full-img-2.webp`}
            alt=""
          />
        </div>
        <div className="full-container soporte-diagonal bg-yellow-2"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="container soporte-grid">
            <div className="grid-item-soporte">
              <div className="title-section-container">
                <h2>Creativo</h2>
                <span>Branding y Multimedia</span>
              </div>
            </div>
            <div className="grid-item-soporte">
              <p>
                Impulsamos tu marca con soluciones visuales y de comunicación
                que conectan. Desde producción multimedia hasta branding
                estratégico, creamos piezas que transmiten identidad, generan
                impacto y fortalecen el posicionamiento de tu negocio en cada
                punto de contacto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="full-container">
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
        <Portfolio3d location="desarrollo" categoria="3d" />
      </div>

      <Contact />

      <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>Más que clientes, aliados estratégicos.</h4>
          <p>Historias que muestran el valor de trabajar en equipo.</p>
        </div>
        <div className="full-container">
          <Testimonials size={4} />
        </div>
      </section>

      <Faqs location="soporte" />

      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Soporte;
