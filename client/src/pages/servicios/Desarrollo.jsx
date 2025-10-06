import { Link } from "react-router-dom";

import Hero from "../../layout/Hero.jsx";
import PageTitle from "../../components/services/PageTitle.jsx";
import Values from "../../layout/Values.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import Testimonials from "../../components/Testimonials.jsx";

import "../../assets/styles/servicios-page.css";

const Desarrollo = () => {
  return (
    <>
      <Hero location="desarrollo" />
      <PageTitle
        title="Desarrollo <strong>web</strong>"
        subtitle=""
        highlight="<strong>En Trompo</strong> transformamos objetivos de negocio en  <strong>plataformas digitales con propósito.</strong> Unimos estrategia UX</strong>, diseño enfocado en conversión e infraestructura escalable para que tu web no sea solo presencia online, sino un  <strong>activo estratégico que impulsa resultados medibles.</strong>"
        bgc="#FEE070"
      />     

      <section className="full-container">
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Web Institucional</h2>
              <div className="service-container-text">
                <p>
                  Diseñamos sitios que trascienden lo informativo:{" "}
                  <strong>
                    espacios digitales que transmiten confianza, autoridad y
                    valor diferencial
                  </strong>
                  . Integramos narrativa de marca clara, credenciales tangibles
                  (casos de éxito, certificaciones) y una estética profesional
                  que refuerza tu posicionamiento frente a clientes y
                  competidores
                </p>
                <a className="more-info-button" href="#contact">
                  Más info
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="46"
                    viewBox="0 0 48 46"
                    fill="none"
                  >
                    <path
                      d="M1.77734 23.0702L46.0268 23.0702M46.0268 23.0702L23.9021 1.36914M46.0268 23.0702L23.902 44.7713"
                      stroke="#1D1D1B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid-item-service">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/desarrollo/institucional.webp`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="full-container diagonal">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Landing Page</h2>
              <div className="service-container-text">
                <p>
                  Creamos páginas de destino con un único objetivo:{" "}
                  <strong>convertir visitantes en oportunidades reales</strong>.
                  Cada elemento está pensado para guiar la acción: arquitectura
                  conversiva, microcopys persuasivos y un diseño sin fricciones
                  que multiplica el ROI de cada clic invertido.
                </p>
                <a className="more-info-button" href="#contact">
                  Más info
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="46"
                    viewBox="0 0 48 46"
                    fill="none"
                  >
                    <path
                      d="M1.77734 23.0702L46.0268 23.0702M46.0268 23.0702L23.9021 1.36914M46.0268 23.0702L23.902 44.7713"
                      stroke="#1D1D1B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid-item-service">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/desarrollo/landing.webp`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>E-commerce</h2>
              <div className="service-container-text">
                <p>
                  Desarrollamos tiendas online que combinan{" "}
                  <strong>
                    diseño atractivo, performance ágil y procesos de compra
                    optimizados
                  </strong>
                  . Desde la primera impresión hasta el checkout, tu marca
                  ofrece una experiencia fluida, confiable y diseñada para{" "}
                  <strong>vender más y fidelizar clientes</strong>.
                </p>
                <a className="more-info-button" href="#contact">
                  Más info
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="46"
                    viewBox="0 0 48 46"
                    fill="none"
                  >
                    <path
                      d="M1.77734 23.0702L46.0268 23.0702M46.0268 23.0702L23.9021 1.36914M46.0268 23.0702L23.902 44.7713"
                      stroke="#1D1D1B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid-item-service">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/desarrollo/ecommerce.webp`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="full-container diagonal">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Formación online</h2>
              <div className="service-container-text">
                <p>
                  Creamos plataformas e-learning que unen{" "}
                  <strong>
                    pedagogía digital, experiencia de usuario y escalabilidad
                    tecnológica
                  </strong>
                  . Desde cursos autogestionados hasta programas con
                  integraciones avanzadas, ofrecemos soluciones que facilitan el
                  aprendizaje y{" "}
                  <strong>convierten conocimiento en valor de negocio</strong>.
                </p>
                <a className="more-info-button" href="#contact">
                  Más info
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="46"
                    viewBox="0 0 48 46"
                    fill="none"
                  >
                    <path
                      d="M1.77734 23.0702L46.0268 23.0702M46.0268 23.0702L23.9021 1.36914M46.0268 23.0702L23.902 44.7713"
                      stroke="#1D1D1B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid-item-service">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/desarrollo/formacion.webp`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="full-container diagonal-invertida">
          <div className="container grid-content">
            <div className="grid-item-service">
              <h2>Catálogo</h2>
              <div className="service-container-text">
                <p>
                  Diseñamos catálogos digitales dinámicos que combinan{" "}
                  <strong>
                    diseño visual impactante, navegabilidad intuitiva y
                    presentación estratégica de productos
                  </strong>
                  . Una herramienta que potencia ventas, facilita consultas y
                  refuerza la credibilidad de tu marca frente a clientes y
                  distribuidores.
                </p>
                <a className="more-info-button" href="#contact">
                  Más info
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="46"
                    viewBox="0 0 48 46"
                    fill="none"
                  >
                    <path
                      d="M1.77734 23.0702L46.0268 23.0702M46.0268 23.0702L23.9021 1.36914M46.0268 23.0702L23.902 44.7713"
                      stroke="#1D1D1B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid-item-service">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/desarrollo/catalogo.webp`}
                alt=""
              />
            </div>
          </div>
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

      <Contact form="desarrollo"/>

      {/* <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>Más que clientes, aliados estratégicos.</h4>
          <p>Historias que muestran el valor de trabajar en equipo.</p>
        </div>
        <div className="full-container">
          <Testimonials size={4} />
        </div>
      </section> */}

      <Faqs location="desarrollo" />
      
      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Desarrollo;
