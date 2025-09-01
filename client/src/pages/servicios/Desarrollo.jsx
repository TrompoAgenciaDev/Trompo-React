import { Link } from "react-router-dom";

import Hero from "../../layout/Hero.jsx";
import PageTitle from "../../components/services/PageTitle.jsx";
import Values from "../../layout/Values.jsx";
import PostCard from "../../components/posts/PostCard.jsx";
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
        title="Desarrollo"
        subtitle=""
        highlight="En Trompo convertimos objetivos de negocio en arquitecturas digitales precisas. Combinamos UX estratégica, desarrollo técnico escalable y diseño orientado a conversión para construir soluciones web que funcionan."
        bgc="#FEE070"
      />

      <section className="full-container">
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
              <p>
                Construimos experiencias focalizadas que transforman tráfico en
                leads cualificados, ventas directas o adopción de promociones.
                Método basado en arquitectura conversiva, microcopys
                estratégicos y eliminación sistemática de fricciones para
                maximizar ROI por visita.
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
              <p>
                Una tienda online moderna, rápida y funcional, que combina
                diseño atractivo con conversión optimizada y backend eficiente.
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
              <p>
                Construimos experiencias focalizadas que transforman tráfico en
                leads cualificados, ventas directas o adopción de promociones.
                Método basado en arquitectura conversiva, microcopys
                estratégicos y eliminación sistemática de fricciones para
                maximizar ROI por visita.
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
              <p>
                Desarrollamos sitios web institucionales que superan lo básico:
                plataformas estratégicas donde convergen narrativa de marca
                clara, elementos de credibilidad demostrable (casos de estudio,
                certificaciones) y presentación efectiva de valor.
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

      <div className="full-container">
        <div className="full-container title-portfolio-container">
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
        <Portfolio3d location="desarrollo" categoria="3d" />
      </div>

      <Contact location="desarrollo" />

      <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>La voz de nuestros clientes.</h4>
          <p>
            Testimonios de profesionales que han visto resultados concretos en
            sus proyectos.
          </p>
        </div>
        <div className="full-container">
          <Testimonials size={4} />
        </div>
      </section>

      <Faqs location="desarrollo" />

      <section className="full-container desarrollo-post">
        <div className="container">
          <h2 className="post-title-section">Novedades </h2>
          <PostCard maxLimit={3} category="desarrollo web" />
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
        <CustomerSlider />
      </div>
    </>
  );
};

export default Desarrollo;
