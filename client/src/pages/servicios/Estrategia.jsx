import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Icons from "../../components/Icons";
import Portfolio3d from "../../layout/Portfolio3d";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";

//styles
import "../../assets/styles/estrategia-page.css";

const Estrategia = () => {
  return (
    <>
      <Hero location="home" />
      <PageTitle
        title="Estrategia"
        subtitle="inteligente"
        highlight="De la visión al impacto. <strong>Planificación Estratégica</strong> que alinea negocio, audiencias y objetivos de negocio; <strong>Plataformas Ads</strong> que combinan performance y posicionamiento optimizando presupuesto; <strong>Data & Analítica Digital</strong> que convierte datos en decisiones. Un sistema disciplinado para invertir mejor y vender más, hoy y a escala."
      />

      <section className="full-container ads">
        <div className="full-container ads-diagonal bg-yellow-2">
          <div className="container ads-grid">
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <Icons iconName="meta" />
              </div>
              <div className="grid-item-body">
                <p>
                  Meta Ads es un servicio de gestión profesional de campañas
                  publicitarias en Instagram y Facebook.
                </p>
                <p>
                  Creamos estrategias personalizadas orientadas a resultados,
                  con optimización constante y una visión 360° del negocio.
                </p>
              </div>
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <Icons iconName="ads" />
              </div>
              <div className="grid-item-body">
                <p>
                  Es mucho más que aparecer en los primeros resultados de
                  búsqueda: es un ecosistema estratégico para generar
                  oportunidades comerciales reales, escalar resultados y
                  optimizar cada peso invertido.
                </p>
                <p>
                  En Trompo, lo trabajamos como parte integral de tu embudo de
                  ventas y experiencia digital.
                </p>
              </div>
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <Icons iconName="tiktok" />
              </div>
              <div className="grid-item-body">
                <p>
                  TikTok es hoy uno de los espacios más poderosos para captar
                  atención real en poco tiempo.
                </p>
                <p>
                  Nuestro servicio de TikTok Ads está diseñado para marcas que
                  quieren aprovechar el potencial de esta plataforma en formato
                  vertical, ágil y nativo, pero sin descuidar la estrategia ni
                  los objetivos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="full-container section-ads-2">
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
              </div>
              <div className="grid-item-body">
                <p>
                  En un entorno digital donde cada clic deja una huella, la
                  analítica web se convierte en la brújula estratégica de
                  cualquier marca que quiera evolucionar con datos, no con
                  suposiciones.
                </p>
                <p>
                  Nuestro servicio de Data & Analytics va más allá de instalar
                  un pixel o leer un dashboard. Se trata de transformar los
                  datos en decisiones concretas y acciones que escalen
                  resultados.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="full-container bg-yellow-2 ads-values-diagonal">
          <div className="container ads-grid-2">
            <div className="grid-item-ads">
              <img
                src={`${import.meta.env.BASE_URL}assets/estrategia/ads.webp`}
                alt=""
              />
            </div>
            <div className="grid-item-ads">
              <div className="grid-item-header">
                <h2>Data & Analytics</h2>
              </div>
              <div className="grid-item-body">
                <p>
                  En un entorno digital donde cada clic deja una huella, la
                  analítica web se convierte en la brújula estratégica de
                  cualquier marca que quiera evolucionar con datos, no con
                  suposiciones.
                </p>
                <p>
                  Nuestro servicio de Data & Analytics va más allá de instalar
                  un pixel o leer un dashboard. Se trata de transformar los
                  datos en decisiones concretas y acciones que escalen
                  resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="full-container">
        <div className="full-container ads-title-portfolio-container">
          <div className="container"></div>
          <div className="container">
            <h3>Proyectos con impacto</h3>
            <p>
              Combinamos planificación estratégica, analytics avanzado y
              ejecución en plataformas para maximizar conversiones y reducir
              CAC.
            </p>
          </div>
        </div>
        <Portfolio3d location="estrategia"/>
      </div>

      <Contact/>

      <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>Más que clientes, aliados estratégicos.</h4>
          <p>Historias que muestran el valor de trabajar en equipo.</p>
        </div>
        <div className="full-container">
          <Testimonials size={4} />
        </div>
      </section>

      <Faqs location="estrategia" />



      <div className="full-container">
        <CustomerSlider />
      </div>
    </>
  );
};

export default Estrategia;
