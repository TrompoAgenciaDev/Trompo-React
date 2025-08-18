import { Link } from "react-router-dom";

import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle.jsx";
import Values from "../../layout/Values";
import PostCard from "../../components/posts/PostCard.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Portfolio3d from "../../layout/Portfolio3d";
import Faqs from '../../layout/Faqs';
import Contact from "../../layout/Contact";

import "../../assets/styles/desarrollo-web.css";

const Desarrollo = () => {
  return (
    <>
      <Hero location="desarrollo" />
      <PageTitle
        title="Desarrollo Web"
        highlight="En Trompo convertimos objetivos de negocio en arquitecturas digitales precisas. Combinamos UX estratégica, desarrollo técnico escalable y diseño orientado a conversión para construir soluciones web que funcionan."
      />

      <section className="full-container">
        <div className="full-container diagonal-first">
        </div>
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Web Institucional</h2>
              <p>
                Desarrollamos sitios web institucionales que superan lo básico:
                plataformas estratégicas donde convergen narrativa de marca
                clara, elementos de credibilidad demostrable (casos de estudio,
                certificaciones) y presentación efectiva de valor.
              </p>
            </div>
            <div className="grid-item-service">
              <img src="/assets/desarrollo/institucional.png" alt="" />
            </div>
          </div>
        </div>
        <div className="full-container diagonal">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Landing Page</h2>
              <p>
                Construimos experiencias focalizadas que transforman tráfico en
                leads cualificados, ventas directas o adopción de promociones.
                Método basado en arquitectura conversiva, microcopys
                estratégicos y eliminación sistemática de fricciones para
                maximizar ROI por visita.
              </p>
            </div>
            <div className="grid-item-service">
              <img src="/assets/desarrollo/landing.png" alt="" />
            </div>
          </div>
        </div>
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>E-commerce</h2>
              <p>
                Una tienda online moderna, rápida y funcional, que combina diseño atractivo con conversión optimizada y backend eficiente.
              </p>
            </div>
            <div className="grid-item-service">
              <img src="/assets/desarrollo/ecommerce.png" alt="" />
            </div>
          </div>
        </div>
        <div className="full-container diagonal">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Formación online</h2>
              <p>
                Construimos experiencias focalizadas que transforman tráfico en
                leads cualificados, ventas directas o adopción de promociones.
                Método basado en arquitectura conversiva, microcopys
                estratégicos y eliminación sistemática de fricciones para
                maximizar ROI por visita.
              </p>
            </div>
            <div className="grid-item-service">
              <img src="/assets/desarrollo/formacion.png" alt="" />
            </div>
          </div>
        </div>
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Catálogo</h2>
              <p>
                Desarrollamos sitios web institucionales que superan lo básico:
                plataformas estratégicas donde convergen narrativa de marca
                clara, elementos de credibilidad demostrable (casos de estudio,
                certificaciones) y presentación efectiva de valor.
              </p>
            </div>
            <div className="grid-item-service">
              <img src="/assets/desarrollo/catalogo.png" alt="" />
            </div>
          </div>
        </div>
        <div className="full-container diagonal">
          <Values />
        </div>
      </section>
      
      {/* <section className="full-container desarrollo-post">
        <div className="container">
          <h2>Guías, casos y análisis para optimizar tu presencia digital. </h2>
          <PostCard maxLimit={3} category="desarrollo web" />
        </div>
        <div className="container">
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
        </div>
      </section> */}

      <div className="full-container">
        <Portfolio3d/>
      </div>

      <div className="full-container">
        <div className="container">
          <CustomerSlider />
        </div>
      </div>

      <Faqs/>
      <Contact location="web"/>
    </>
  );
};

export default Desarrollo;
