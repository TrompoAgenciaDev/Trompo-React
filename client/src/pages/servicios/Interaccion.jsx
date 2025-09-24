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

const Interaccion = () => {
  return (
    <>
      <Hero location="home" />
      <PageTitle
        title="Interacción"
        highlight="En Trompo las Redes Sociales son el canal clave para conectar marcas con personas en tiempo real. Potenciamos tu presencia digital con estrategias que generan comunidad, posicionan tu mensaje y convierten seguidores en clientes. Un servicio esencial para destacar y crecer en un entorno cada vez más competitivo."
        bgc="#FEE070"
      />
      <section className="full-container interaccion">
        <div className="full-container interaccion-diagonal bg-yellow-2"></div>
        <div className="full-container">
          <div className="container interaccion-grid">
            <div className="grid-item-interaccion">
              <img
                className="interaccion-img"
                src={`${
                  import.meta.env.BASE_URL
                }assets/interaccion/interaccion-1.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-interaccion">
              <div className="title-section-container">
                <h2>Social Media</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Social Media es el proceso de planificar y crear contenido
                  estratégico, organizado en una matriz que asegura coherencia y
                  relevancia. Cada pieza se adapta a un diseño con el social
                  brand de la marca, potenciando su identidad y generando
                  conexión real con la audiencia digital.
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
                src={`${
                  import.meta.env.BASE_URL
                }assets/interaccion/interaccion-2.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-interaccion">
              <div className="title-section-container">
                <h2>Inbound Marketing</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Es la estrategia que atrae clientes de forma orgánica y
                  sostenida. Creamos contenidos de valor que informan, educan y
                  generan confianza en cada etapa del proceso de compra. El
                  objetivo: convertir visitas en oportunidades reales de negocio
                  y relaciones duraderas con tu marca.
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

      <Contact />

      <Faqs location="interaccion" />

      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Interaccion;
