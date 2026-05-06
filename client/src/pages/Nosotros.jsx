import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "../assets/styles/about.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Nosotros = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".nosotros-wrap .reveal").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="nosotros-wrap">

      {/* HERO */}
      <section className="page-hero">
        <div>
          <div className="page-hero-eyebrow reveal">01 · Nosotros</div>
          <h1 className="reveal">Una agencia<br />que gira<br /><em>en serio.</em></h1>
        </div>
        <div className="page-hero-right">
          <p className="page-hero-desc reveal">
            <strong>Trompo nació en 2015 en Córdoba.</strong> Lo que arrancó como un proyecto de dos personas con ganas de hacer las cosas bien se convirtió en un equipo de más de 13 personas operando en cinco disciplinas — todas bajo el mismo techo, todas empujando en la misma dirección.
          </p>
          <div className="page-hero-stats reveal">
            <div>
              <div className="hero-stat-n">10<em>+</em></div>
              <div className="hero-stat-lbl">Años de operación<br />en Córdoba</div>
            </div>
            <div>
              <div className="hero-stat-n">13<em>+</em></div>
              <div className="hero-stat-lbl">Personas en el equipo<br />full time</div>
            </div>
            <div>
              <div className="hero-stat-n">80<em>+</em></div>
              <div className="hero-stat-lbl">Marcas argentinas<br />trabajadas</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* MANIFIESTO */}
      <section className="manifesto">
        <div>
          <div className="manifesto-num reveal">01<small>Cómo pensamos</small></div>
        </div>
        <div className="manifesto-content">
          <h2 className="reveal">No ejecutamos <span className="strike">pedidos.</span><br />Construimos <em>resultados.</em></h2>
          <div className="manifesto-body">
            <p className="manifesto-p reveal">En Trompo entendemos que el marketing no es un gasto ni un adorno. Es la palanca más directa para mover el negocio. Por eso no vendemos servicios por separado ni paquetes prediseñados: <strong>diagnosticamos primero, proponemos después.</strong></p>
            <p className="manifesto-p reveal">Llevamos diez años trabajando con marcas argentinas de todos los tamaños y sectores. Ese recorrido nos dio algo que no se compra: <strong>criterio acumulado, patrones reconocibles y una visión sistémica del marketing digital.</strong></p>
            <p className="manifesto-p reveal">Nos importa mucho más que el marketing funcione como sistema integrado que tener cada área perfectamente ordenada en silos. El diseño informa la campaña. La campaña alimenta el sitio. El sitio convierte y genera datos. Los datos mejoran el diseño. <strong>Todo conectado.</strong></p>
            <p className="manifesto-p reveal">Lo que nos diferencia no es el catálogo de servicios. Es el modo de trabajar: <strong>con foco en el negocio del cliente, con honestidad sobre lo que funciona y con equipos que se hablan entre sí.</strong> Eso es Trompo.</p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* FOUNDER */}
      <section className="founder" id="esteban">
        <div className="founder-inner">
          <div className="founder-photo-wrap reveal">
            <img className="founder-photo" src={`${base}assets/img/esteban.jpeg`} alt="Esteban Raparo, Founder Trompo" />
            <div className="founder-photo-tag">Esteban Raparo · Córdoba, AR</div>
          </div>
          <div>
            <div className="founder-eyebrow reveal">Founder &amp; CEO</div>
            <h2 className="founder-name reveal">Esteban<br />Raparo</h2>
            <p className="founder-role reveal">Founder · CEO · Estrategia Digital</p>
            <blockquote className="reveal">
              "Trabajamos para que cada peso invertido en marketing empuje en la misma dirección — la del negocio."
            </blockquote>
            <p className="founder-bio reveal">
              <strong>Más de 15 años en marketing digital.</strong> Esteban comenzó en el sector antes de que existieran las mayorías de las plataformas que hoy todos usan. Eso le dio una perspectiva poco común: entiende el oficio desde la ejecución táctica más granular hasta la visión estratégica de largo plazo.
            </p>
            <p className="founder-bio reveal" style={{ marginTop: "16px" }}>
              Certificado por Google desde los inicios del programa en Argentina, ha liderado campañas y proyectos digitales para más de 80 marcas en sectores tan distintos como agro, salud, turismo, indumentaria y tecnología. Hoy dirige Trompo desde Córdoba con un equipo de 13+ personas.
            </p>
            <div className="founder-certs reveal">
              <span className="cert-badge gold">Google Partner</span>
              <span className="cert-badge gold">Google Ads Certified</span>
              <span className="cert-badge">15+ años</span>
              <span className="cert-badge">80+ marcas</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="valores">
        <div className="section-eyebrow reveal">02 · Lo que nos mueve</div>
        <h2 className="valores-h reveal">Los principios que<br/>guían <em>cada decisión.</em></h2>
        <div className="valores-grid">
          <div className="valor reveal" data-cursor-hover="true">
            <div className="valor-num">A / Criterio</div>
            <h3>Diagnóstico antes de propuesta</h3>
            <p>Nunca arrancamos sin entender. Marca, negocio, contexto competitivo y audiencia bajo una misma lectura estratégica. La propuesta viene después — siempre.</p>
          </div>
          <div className="valor reveal" data-cursor-hover="true">
            <div className="valor-num">B / Claridad</div>
            <h3>Roadmap, no táctica suelta</h3>
            <p>Definimos rumbo antes de ejecutar. Prioridades claras, acciones ordenadas y foco en impacto real de negocio. Sin dispersión, sin listas de cosas por hacer sin hilo conductor.</p>
          </div>
          <div className="valor reveal" data-cursor-hover="true">
            <div className="valor-num">C / Funcionalidad</div>
            <h3>Producción que activa</h3>
            <p>Todo lo que creamos tiene una función. El diseño convierte. El contenido activa. El sitio posiciona. Nada decorativo, todo orientado a mover la aguja del cliente.</p>
          </div>
          <div className="valor reveal" data-cursor-hover="true">
            <div className="valor-num">D / Continuidad</div>
            <h3>Optimización real, no reporting</h3>
            <p>Los datos existen para mejorar, no para justificar. Medimos lo que importa, tomamos decisiones y ajustamos en tiempo real. El reporte es la consecuencia, no el producto.</p>
          </div>
          <div className="valor reveal" data-cursor-hover="true">
            <div className="valor-num">E / Integridad</div>
            <h3>Honestidad ante todo</h3>
            <p>Si algo no va a funcionar, lo decimos. Si el presupuesto no alcanza para el objetivo propuesto, lo aclaramos antes de arrancar. Preferimos perder una propuesta que prometer lo que no podemos cumplir.</p>
          </div>
          <div className="valor reveal" data-cursor-hover="true">
            <div className="valor-num">F / Sistema</div>
            <h3>Integración, no silos</h3>
            <p>El diseño, el paid media, el contenido y el desarrollo se hablan entre sí. Ese es nuestro diferencial más tangible: cinco unidades que trabajan como una. Coordinadas, informadas, alineadas.</p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* EQUIPO */}
      <section className="equipo" id="equipo">
        <div className="equipo-inner">
          <div className="equipo-header">
            <div>
              <div className="section-eyebrow reveal">03 · El equipo</div>
              <h2 className="equipo-h reveal">Detrás de cada marca,<br />hay <em>personas</em> que la mueven.</h2>
            </div>
            <div className="equipo-meta reveal">
              <strong>13+</strong>
              personas trabajando<br />en oficina · Córdoba<br />Lun a Vie · 09-18 hs
            </div>
          </div>
          <div className="equipo-grid">
            <div className="equipo-card reveal">
              <img src={`${base}assets/img/home/estrategia.jpeg`} alt="Estrategia" />
              <div className="equipo-card-label">Estrategia · Reunión semanal</div>
            </div>
            <div className="equipo-card reveal">
              <img src={`${base}assets/img/home/disenio.jpeg`} alt="Diseño" />
              <div className="equipo-card-label">Diseño · Iteración cliente</div>
            </div>
            <div className="equipo-card reveal">
              <img src={`${base}assets/img/home/produccion.jpeg`} alt="Producción" />
              <div className="equipo-card-label">Producción · Sprint en curso</div>
            </div>
            <div className="equipo-card reveal">
              <img src={`${base}assets/img/home/paid-media.jpeg`} alt="Paid Media" />
              <div className="equipo-card-label">Paid Media · Optimización</div>
            </div>
            <div className="equipo-card reveal">
              <img src={`${base}assets/img/home/desarrollo.jpeg`} alt="Desarrollo" />
              <div className="equipo-card-label">Desarrollo · Code review</div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline">
        <div className="section-eyebrow reveal">04 · Trayectoria</div>
        <h2 className="timeline-h reveal">Diez años<br />construyendo <em>criterio.</em></h2>
        <div className="timeline-list">
          <div className="timeline-item reveal">
            <div className="timeline-year">2015</div>
            <div className="timeline-content">
              <h3>Nace Trompo</h3>
              <p>Fundación de la agencia en Córdoba. Dos personas, una oficina y la convicción de que el marketing tenía que funcionar como un sistema integrado, no como servicios sueltos.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="timeline-year">2016</div>
            <div className="timeline-content">
              <h3>Primer Google Partner Certification</h3>
              <p>Certificación oficial de Google Ads desde el inicio del programa en Argentina. Formalización del área de Paid Media como vertical especializada dentro de la agencia.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="timeline-year">2018</div>
            <div className="timeline-content">
              <h3>25 marcas activas · Ampliamos el equipo</h3>
              <p>Crecimiento sostenido que llevó a la incorporación de las áreas de Diseño y Multimedia como unidades propias. Primer año con 5+ personas trabajando en oficina.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="timeline-year">2020</div>
            <div className="timeline-content">
              <h3>Desarrollo Web · Quinta unidad integrada</h3>
              <p>Incorporación de la unidad de Desarrollo Web. Por primera vez, el sistema completo — diseño, contenido, ads, redes y desarrollo — funciona bajo el mismo techo y con el mismo criterio estratégico.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="timeline-year">2022</div>
            <div className="timeline-content">
              <h3>50+ marcas · Expansión a Buenos Aires</h3>
              <p>Consolidación de la cartera por encima de las 50 marcas activas. Primeros clientes estratégicos fuera de Córdoba, con proyectos de alcance nacional en sectores de transporte, salud y finanzas.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="timeline-year">2025</div>
            <div className="timeline-content">
              <h3>10 años · Sistema v.2025 · 80+ marcas</h3>
              <p>Década de operación continua desde Córdoba. Rebranding institucional, lanzamiento del nuevo sitio y consolidación del equipo en 13+ personas. Trompo entra a su segunda década con más criterio, más cartera y el mismo modo de trabajar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-banner-bg">Trompo</div>
        <div className="cta-banner-inner">
          <div className="section-eyebrow reveal" style={{ justifyContent: "center", display: "flex", gap: "10px", marginBottom: "24px" }}>
            <span>05 · Siguiente paso</span>
          </div>
          <h2 className="reveal">¿Tu marca necesita<br /><em>un sistema que gire?</em></h2>
          <p className="reveal">Una conversación corta para entender cómo está hoy tu marketing y mostrarte cómo trabajamos. Sin propuesta cerrada, sin presión.</p>
          <div className="reveal">
            <Link to="/contactanos" className="btn-primary">Hablemos →</Link>
            <Link to="/" className="btn-ghost">Ver el sistema</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Nosotros;