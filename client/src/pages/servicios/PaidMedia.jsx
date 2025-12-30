import Hero from "../../layout/Hero.jsx";
import Icons from "../../components/Icons.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo.jsx";

//styles
import "../../assets/styles/estrategia-page.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Estrategia = () => {
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/estrategia-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/estrategia-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/estrategia-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/estrategia-hero-mobile-poster.webp`}
      />

      <section className="full-container ads">
        <div className="full-container section-ads-2 bg-yellow-2 ads-diagonal">
          <div className="container ads-grid-2">
            <div className="grid-item-ads">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/estrategia/planning.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <h2>Planificación Digital Estratégica</h2>
              </div>
              <div className="grid-item-body">
                <p>
                  <strong>Dirección clara, crecimiento medible</strong>. Pasamos
                  del hacer por hacer, a una{" "}
                  <strong>
                    planificación con propósito, prioridades, presupuesto y
                    objetivos
                  </strong>
                  . Definimos un marco de acción, analizamos audiencias, creamos
                  un mix digital eficiente y un plan de medición con indicadores
                  claros, que generen procesos orientados al crecimiento
                  sostenible. Menos dispersión,{" "}
                  <strong>más foco y más data</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="full-container">
          <div className="container ads-grid-2">
            <div className="grid-item-ads">
              <img
                src={`${import.meta.env.BASE_URL}assets/estrategia/ads.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <h2>Ads</h2>
              </div>
              <div className="grid-item-body">
                <p>
                  Planificamos por mercado y audiencia, seleccionando
                  plataformas precisas. Proceso validado 10+ años en estructura,
                  medición y ejecución; seguimiento riguroso, control de gasto y
                  mejora continua. Datos en tiempo real para optimizar
                  inversión, posicionar marca y generar oportunidades de venta.
                </p>
              </div>
            </div>
          </div>

          <div className="full-container ">
            <div className="container ads-grid">
              <div className="grid-item-ads">
                <div className="grid-item-header">
                  <Icons iconName="meta" />
                </div>
                <div className="grid-item-body">
                  <p>
                    Meta Ads orientado a negocio: seleccionamos las plataformas
                    y ubicaciones que rinden para cada audiencia, configuramos
                    medición completa (Pixel + CAPI) e integramos leads al CRM.
                    Ajustes semanales sobre pujas, segmentación y creatividad,
                    con límites de gasto y dashboards 24/7. Objetivo: eficiencia
                    de inversión y ventas consistentes.
                  </p>
                </div>
                <div className="grid-item-footer">
                  <a href="/servicios/paid-media/meta-ads">
                    <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 6)"><path d="m9.5.497 4 4.002-4 4.001"/><path d="m.5 4.5h13"/></g></svg>
                  </a>
                </div>
              </div>
              <div className="grid-item-ads">
                <div className="grid-item-header">
                  <Icons iconName="ads" />
                </div>
                <div className="grid-item-body">
                  <p>
                    Construimos campañas de <strong>Búsqueda</strong> orientadas
                    a resultados (llamadas, formularios, ventas) y optimizamos
                    mediante un proceso de mejora continua comprobado.{" "}
                    <strong>Display</strong> refuerza la marca en sitios top a
                    bajo costo; <strong>YouTube</strong> acompaña cuando tiene
                    sentido. Métricas simples:{" "}
                    <strong>
                      CPL/CPA, tasa de conversión e impresiones ganadas
                    </strong>
                    .
                  </p>
                </div>
                <div className="grid-item-footer">
                  <a href="/servicios/paid-media/google-ads">
                    <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 6)"><path d="m9.5.497 4 4.002-4 4.001"/><path d="m.5 4.5h13"/></g></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="full-container section-ads-2 bg-yellow-2 ads-diagonal">
          <div className="container ads-grid-2">
            <div className="grid-item-ads">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/estrategia/planning.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <h2>Data & Analytics</h2>
                <span className="subtitle">
                  Analítica para crecer con control
                </span>
              </div>
              <div className="grid-item-body">
                <p>
                  La base de la analítica web, es el análisis de las
                  interacciones que realizan los usuarios en Internet, para
                  identificar patrones que puedan determinar estrategias
                  digitales sólidas asegurando la consistencia de la
                  información. Las decisiones correctas se basan en datos
                  correctos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Faqs location="estrategia" />
      </section>

      <Contact form="estrategia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Estrategia;
