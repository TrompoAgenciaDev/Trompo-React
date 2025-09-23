import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import CreatividadSlider from "../../components/sliders/CreatividadSlider";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";

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
            <div className="full-container bg-yellow-2">
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

      <div className="full-container creatividad-video-section">
        <div className="container">
          <CreatividadSlider/>
        </div>
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
      <Faqs location="creatividad" />

      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Creatividad;
