import { Link } from "react-router-dom";

import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Values from "../../layout/Values";
import PostCard from "../../components/posts/PostCard";
import Portfolio3d from "../../layout/Portfolio3d";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";

//styles
import "../../assets/styles/soporte-page.css";

const Soporte = () => {
  return (
    <>
      <Hero location="desarrollo" />
      <PageTitle
        title="Soporte"
        subtitle="Web y creativo"
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
                <h2>Web</h2>
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
        <div
          className="full-container soporte-diagonal bg-yellow-2"
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
        <div className="full-container soporte-title-portfolio-container bg-yellow-2">
          <div className="container"></div>
          <div className="container">
            <h3>Proyectos con impacto</h3>
            <p>
              Transformamos ideas en plataformas digitales de alto rendimiento.
              Arquitectura técnica impecable, experiencia de usuario intuitiva y
              resultados medibles en cada proyecto.
            </p>
          </div>
        </div>
        <Portfolio3d categoria="3d"/>
      </div>

      <Contact location="soporte" />

      <Faqs location="soporte" />

      <section className="full-container desarrollo-post">
        <div className="container">
          <h2>Guías, casos y análisis para optimizar tu presencia digital.</h2>
          <PostCard maxLimit={3} category="soporte" />
        </div>
        {/* <div className="container">
          <Link to={"#"} className="read-more-link">
            Ver todas las notas
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
          </Link>
        </div> */}
      </section>
    </>
  );
};

export default Soporte;
