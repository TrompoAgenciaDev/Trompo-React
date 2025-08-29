import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Values from "../../layout/Values";
import PostCard from "../../components/posts/PostCard";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import CreatividadSlider from "../../components/sliders/CreatividadSlider";

//styles
import "../../assets/styles/creatividad.css";

const Creatividad = () => {
  return (
    <>
      <Hero location="home" />
      <PageTitle
        title="Creatividad"
        highlight="En Trompo te ofrecemos publicidad digital diseñada para maximizar resultados. Gestionamos campañas en Meta y otras plataformas con un enfoque estratégico, optimización continua y visión integral del negocio. No es solo anunciar, es hacer que cada inversión impulse el crecimiento real de tu marca."
        bgc="#FEE070"
      />
      <section className="full-container identidad">
        <div className="full-container identidad-diagonal bg-yellow-2">
          <div className="container identidad-grid">
            <div className="grid-item-identidad">
              <div className="title-section-container">
                <h2>Branding</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Este servicio está orientado al desarrollo integral de la
                  identidad de marca. Desde la creación de isologotipos hasta el
                  diseño de material editorial y publicitario, busca construir
                  una identidad visual coherente, profesional y alineada a los
                  valores y objetivos estratégicos de la empresa.
                </p>
                <p>
                  <strong>
                    Es ideal para marcas que inician o necesitan reposicionarse
                    con solidez en un mercado cada vez más competitivo.
                  </strong>
                </p>
              </div>
            </div>
            <div className="grid-item-identidad">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/identidad/identidad.webp`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="full-container identidad-diagonal bg-yellow-2">
          <div className="container identidad-grid">
            <div className="grid-item-identidad">
              <div className="title-section-container">
                <h2>Multimedia</h2>
              </div>
              <div className="parr-section-container">
                <p>
                  Este servicio está pensado para marcas y agencias que
                  necesitan producir contenidos visuales impactantes, dinámicos
                  y alineados a campañas específicas.
                </p>
                <p>
                  Desde animaciones hasta diseño de piezas para plataformas
                  digitales, el foco está puesto en la creatividad, la
                  optimización y la coherencia con los lineamientos de marca
                  existentes.
                </p>
              </div>
            </div>
            <div className="grid-item-identidad">
              <video
                className="identidad-video"
                src={`${
                  import.meta.env.BASE_URL
                }assets/identidad/volvo-identidad.mp4`}
                muted
                autoPlay
              ></video>
            </div>
          </div>
        </div>

        <div className="full-container bg-yellow-2 identidad-diagonal">
          
        </div>
      </section>

      <div className="full-container creatividad-video-section">
        <div className="container">
          <CreatividadSlider/>
        </div>
      </div>

      <Contact location="creatividad" />
      <Faqs location="creatividad" />

      <section className="full-container desarrollo-post">
        <div className="container">
          <h2>Guías, casos y análisis para optimizar tu presencia digital.</h2>
          <PostCard maxLimit={3} category="creatividad" />
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

export default Creatividad;
