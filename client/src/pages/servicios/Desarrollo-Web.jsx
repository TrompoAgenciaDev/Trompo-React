import Hero from "../../layout/Hero.jsx";
import PageTitle from "../../components/services/PageTitle.jsx";
import Values from "../../layout/Values.jsx";
import PostCard from "../../components/posts/PostCard.jsx";

import '../../assets/styles/desarrollo-web.css';

const Desarrollo = () => {
  return (
    <>
      <Hero location="desarrollo"/>
      <PageTitle 
        title="Desarrollo Web"
        highlight="En Trompo convertimos objetivos de negocio en arquitecturas digitales precisas. Combinamos UX estratégica, desarrollo técnico escalable y diseño orientado a conversión para construir soluciones web que funcionan."/>
      <section className="full-container">
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Web Institucional</h2>
              <p>
                Desarrollamos sitios web institucionales que superan lo básico: plataformas estratégicas donde convergen narrativa de marca clara, elementos de credibilidad demostrable (casos de estudio, certificaciones) y presentación efectiva de valor. 
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
                Construimos experiencias focalizadas que transforman tráfico en leads cualificados, ventas directas o adopción de promociones. Método basado en arquitectura conversiva, microcopys estratégicos y eliminación sistemática de fricciones para maximizar ROI por visita.
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
                Construimos experiencias focalizadas que transforman tráfico en leads cualificados, ventas directas o adopción de promociones. Método basado en arquitectura conversiva, microcopys estratégicos y eliminación sistemática de fricciones para maximizar ROI por visita.
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
                Desarrollamos sitios web institucionales que superan lo básico: plataformas estratégicas donde convergen narrativa de marca clara, elementos de credibilidad demostrable (casos de estudio, certificaciones) y presentación efectiva de valor. 
              </p>
            </div>
            <div className="grid-item-service">
              <img src="/assets/desarrollo/catalogo.png" alt="" />
            </div>
          </div>
        </div>
        <div className="full-container diagonal">
          <Values/>
        </div>
      </section>
      <section className="full-container">
        <div className="container">
          <h2>Guías, casos y análisis para optimizar tu presencia digital. </h2>
          <PostCard initialLimit={3} maxLimit={3} category={"desarrollo web"} />
        </div>
      </section>
    </>
  );
};

export default Desarrollo;