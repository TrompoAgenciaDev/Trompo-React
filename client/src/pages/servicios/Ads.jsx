import Hero from '../../layout/Hero';
import PageTitle from '../../components/services/PageTitle';
import Icons from '../../components/Icons';
import Values from '../../layout/Values';
import PostCard from '../../components/posts/PostCard';
import Portfolio3d from '../../layout/Portfolio3d';
import Faqs from '../../layout/Faqs';
import Contact from '../../layout/Contact';

//styles
import "../../assets/styles/ads-page.css";

const Ads = () => {

  return (
    <>
      <Hero
        location='home'
      />
      <PageTitle
        title="Ads"
        highlight="En Trompo te ofrecemos publicidad digital diseñada para maximizar resultados. Gestionamos campañas en Meta y otras plataformas con un enfoque estratégico, optimización continua y visión integral del negocio. No es solo anunciar, es hacer que cada inversión impulse el crecimiento real de tu marca."
      />
      <section className="full-container ads">        
        <div className="full-container ads-diagonal bg-yellow-2">
          <div className="container ads-grid">
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <Icons iconName="meta"/>
              </div>
              <div className="grid-item-body">
                <p>
                  Meta Ads es un servicio de gestión profesional  de campañas publicitarias en Instagram y Facebook.
                </p>
                <p>
                  Creamos estrategias personalizadas orientadas a resultados, con optimización constante y una visión 360° del negocio.
                </p>
              </div>
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <Icons iconName="ads"/>
              </div>
              <div className="grid-item-body">
                <p>
                  Es mucho más que aparecer en los primeros resultados de búsqueda: es un ecosistema estratégico para generar oportunidades comerciales reales, escalar resultados y optimizar cada peso invertido.
                </p>
                <p>
                  En Trompo, lo trabajamos como parte integral de tu embudo de ventas y experiencia digital.
                </p>
              </div>
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <Icons iconName="tiktok"/>
              </div>
              <div className="grid-item-body">
                <p>
                  TikTok es hoy uno de los espacios más poderosos para captar atención real en poco tiempo.
                </p>
                <p>
                  Nuestro servicio de TikTok Ads está diseñado para marcas que quieren aprovechar el potencial de esta plataforma en formato vertical, ágil y nativo, pero sin descuidar la estrategia ni los objetivos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="full-container section-ads-2">
          <div className="container ads-grid-2">
            <div className="grid-item-ads">
              <img src={`${import.meta.env.BASE_URL}assets/ads/ads-1.png`} alt=""/>
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <h2>Data & Analytics</h2>
              </div>
              <div className="grid-item-body">
                <p>
                  En un entorno digital donde cada clic deja una huella, la analítica web se convierte en la brújula estratégica de cualquier marca que quiera evolucionar con datos, no con suposiciones. 
                </p>
                <p>
                  Nuestro servicio de Data & Analytics va más allá de instalar un pixel o leer un dashboard. Se trata de transformar los datos en decisiones concretas y acciones que escalen resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="full-container bg-yellow-2 ads-values-diagonal">
          <Values />
        </div>
      </section>
      
      <section className="full-container desarrollo-post">
        <div className="container">
          <h2>Guías, casos y análisis para optimizar tu presencia digital.</h2>
          <PostCard maxLimit={3} category="desarrollo web"/>
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

      <div className="full-container">
        <Portfolio3d/>
      </div>

      <Faqs location="metaads"/>
      <Contact location="web"/>

    </>
  );
}

export default Ads;