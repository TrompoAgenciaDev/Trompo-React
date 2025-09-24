import Hero from '../../layout/Hero';
import PageTitle from '../../components/services/PageTitle';
import Values from '../../layout/Values';
import PostCard from '../../components/posts/PostCard';
import Faqs from '../../layout/Faqs';
import Contact from '../../layout/Contact';
import Portfolio3d from '../../layout/Portfolio3d';
import Icons from '../../components/Icons';


//styles
import "../../assets/styles/interaccion.css";

const Interaccion = () => {

  return (
    <>
      <Hero
        location='home'
      />      
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
              <img className='interaccion-img' src={`${import.meta.env.BASE_URL}assets/interaccion/interaccion-1.webp`} alt=""/>
            </div>
            <div className="grid-item-interaccion">
              <div className="title-section-container">
                <h2>Social Media</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Social Media es el proceso de planificar y crear contenido estratégico, organizado en una matriz que asegura coherencia y relevancia. Cada pieza se adapta a un diseño con el social brand de la marca, potenciando su identidad y generando conexión real con la audiencia digital.
                </p>
                <div className="icon-section-container">
                  <Icons iconName="instagram2"/>
                  <Icons iconName="face2"/>
                  <Icons iconName="linkedin2"/>
                  <Icons iconName="x2"/>
                  <Icons iconName="tiktok2"/>
                  <Icons iconName="youtube2"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="full-container interaccion-diagonal bg-yellow-2"></div>
        <div className="full-container">
          <div className="container interaccion-grid">
            <div className="grid-item-interaccion">
              <img src={`${import.meta.env.BASE_URL}assets/interaccion/interaccion-2.webp`} alt=""/>
            </div>
            <div className="grid-item-interaccion">
              <div className="title-section-container">
                <h2>Inbound Marketing</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Es la estrategia que atrae clientes de forma orgánica y sostenida. Creamos contenidos de valor que informan, educan y generan confianza en cada etapa del proceso de compra. El objetivo: convertir visitas en oportunidades reales de negocio y relaciones duraderas con tu marca.
                </p>
                <div className="icon-section-container">
                  <Icons iconName="mail2"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="full-container">
        <div className="full-container interaccion-title-portfolio-container bg-yellow-2">
          <div className="container"></div>
          <div className="container">
            <h3>Proyectos con impacto</h3>
            <p>Transformamos ideas en plataformas digitales de alto rendimiento. Arquitectura técnica impecable, experiencia de usuario intuitiva y resultados medibles en cada proyecto.</p>
          </div>
        </div>
        <Portfolio3d location='interaccion'/>
      </div>
      
      <Contact location="interaccion"/>

      <Faqs location="interaccion"/>
      
      <section className="full-container desarrollo-post">
        <div className="container">
          <h2>Guías, casos y análisis para optimizar tu presencia digital.</h2>
          <PostCard maxLimit={3} category="interaccion"/>
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
}

export default Interaccion;