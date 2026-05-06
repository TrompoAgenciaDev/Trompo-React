import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Dock from "../../components/Dock";
import "../../assets/styles/desarrollo-page.css";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=85",
  "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1920&q=85",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=85",
];

const TECH_ITEMS = [
  { name: "Next.js", cat: "Framework" },
  { name: "React", cat: "Library" },
  { name: "Astro", cat: "Static SSG" },
  { name: "WordPress", cat: "CMS" },
  { name: "Sanity", cat: "Headless CMS" },
  { name: "Strapi", cat: "Headless CMS" },
  { name: "WooCommerce", cat: "E-commerce" },
  { name: "Tienda Nube", cat: "E-commerce" },
  { name: "Shopify", cat: "E-commerce" },
  { name: "Tailwind", cat: "CSS Framework" },
  { name: "Vercel", cat: "Hosting Edge" },
  { name: "AWS", cat: "Cloud" },
];

const DELIVERABLES = [
  { letter: "A", title: "Sitios institucionales", desc: "Sitios web profesionales con CMS administrable, estructura SEO desde el día uno, formularios integrados y arquitectura preparada para escalar." },
  { letter: "B", title: "E-commerce", desc: "Tiendas online con catálogo, integración de medios de pago, gestión de stock, envíos y ABM completo. WooCommerce, Tienda Nube o desarrollo custom según necesidad." },
  { letter: "C", title: "Landing pages", desc: "Landings optimizadas para campañas de paid media. A/B testing, eventos, integración con CRM y velocidad de carga por debajo de 2 segundos." },
  { letter: "D", title: "Plataformas a medida", desc: "Aplicaciones web y portales internos: portales de clientes, plataformas de gestión, intranets, sistemas de reservas. Desarrollo a medida con criterio de producto." },
];

const PORTFOLIO_ITEMS = [
  { img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=85", tag: "Institucional · Salud", name: "CEDIR" },
  { img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=85", tag: "E-commerce · Indumentaria", name: "AF Jeans" },
  { img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=85", tag: "Plataforma · Turismo", name: "Lozada Viajes" },
  { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=85", tag: "Institucional · B2B", name: "Denso Argentina" },
  { img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85", tag: "Landing · Volvo", name: "Volvo Trucks" },
  { img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=85", tag: "E-commerce · Construcción", name: "Mosaicos Blangino" },
];

const TIMELINE = [
  { step: "01", title: "Definición y arquitectura", desc: "Mapeamos objetivos, audiencias, recorridos y conversiones esperadas. Definimos arquitectura de información, sitemap y wireframes antes de tocar el diseño.", duration: "Semanas 1–2" },
  { step: "02", title: "Diseño y prototipo", desc: "Diseño de interfaz alineado al sistema visual de la marca, prototipo navegable y validación con el cliente antes de programar. Iteración rápida en esta etapa ahorra costos en la siguiente.", duration: "Semanas 3–4" },
  { step: "03", title: "Desarrollo y QA", desc: "Programación con stack moderno, code review, testing en múltiples dispositivos y navegadores, optimización de performance hasta cumplir métricas objetivo.", duration: "Semanas 5–8" },
  { step: "04", title: "Deploy y mantenimiento", desc: "Lanzamiento, configuración de analítica, eventos, integraciones con CRM y campañas. Plan de mantenimiento mensual para sostener performance, seguridad y mejoras continuas.", duration: "Semana 9 →" },
];

const TESTIMONIALS = [
  { quote: "Trompo entendió que el sitio tenía que ser una herramienta de venta — no un folleto. El nuevo CEDIR.com nos cambió la forma de captar pacientes y le ahorra al equipo administrativo horas todos los días.", initials: "ML", name: "Mauro Lazzarini", role: "Director Comercial · CEDIR Salud" },
  { quote: "La plataforma que armaron para nosotros se convirtió en parte central de la operación. Lo que antes era manual hoy es self-service para los clientes y el equipo.", initials: "FL", name: "Federico Lozada", role: "Founder · Lozada Viajes" },
];

const STATS = [
  { num: "120", suffix: "+", label: "Sitios y plataformas\ndesarrollados en 10 años" },
  { num: "95", suffix: "", label: "Score promedio\nen Google Lighthouse" },
  { num: "2", suffix: "s", label: "Tiempo de carga\nobjetivo en mobile" },
  { num: "40", suffix: "+", label: "E-commerce activos\ncon mantenimiento mensual" },
];

const SCORE_QUESTIONS = [
  { q: "01 · ¿Tu sitio carga en menos de 3 segundos?", opts: [{ label: "Sí, rápido", val: 20 }, { label: "Más o menos", val: 10 }, { label: "No / no sé", val: 0 }] },
  { q: "02 · ¿Está optimizado para mobile?", opts: [{ label: "Sí, completo", val: 20 }, { label: "Parcialmente", val: 10 }, { label: "No", val: 0 }] },
  { q: "03 · ¿Aparece en los primeros resultados de Google para tus keywords?", opts: [{ label: "Sí, primera página", val: 15 }, { label: "A veces", val: 8 }, { label: "No / no sé", val: 0 }] },
  { q: "04 · ¿Tenés analítica + eventos de conversión configurados?", opts: [{ label: "Sí, todo", val: 15 }, { label: "Solo GA básico", val: 8 }, { label: "No", val: 0 }] },
  { q: "05 · ¿Podés actualizar contenido sin pedirle al desarrollador?", opts: [{ label: "Sí, CMS amigable", val: 15 }, { label: "Algunas cosas", val: 8 }, { label: "No", val: 0 }] },
  { q: "06 · ¿Tu sitio convierte visitantes en leads o ventas?", opts: [{ label: "Sí, sostenidamente", val: 15 }, { label: "Algo, no lo medimos", val: 8 }, { label: "No", val: 0 }] },
];

const FAQ_ITEMS = [
  { q: "¿Cuánto cuesta un sitio web profesional?", a: "Depende del alcance. Un sitio institucional con CMS y 8–12 secciones tiene un piso. Una plataforma a medida con login, ABM y módulos custom puede multiplicar varias veces ese piso. Lo importante: no cobramos lo mismo por cosas distintas. Te damos rango realista en la primera reunión." },
  { q: "¿Por qué Next.js o Astro y no WordPress?", a: "Depende del proyecto. Para sitios que necesitan performance extrema, SEO técnico avanzado y experiencias dinámicas, Next.js o Astro son superiores. Para sitios institucionales con muchas actualizaciones de contenido y un CMS muy amigable para el cliente, WordPress sigue siendo válido. Elegimos según el caso." },
  { q: "¿El sitio queda 100% del cliente o queda atado a Trompo?", a: "100% del cliente. Entregamos código fuente, accesos a hosting, dominio, repositorio y todo lo necesario para que cualquier desarrollador pueda continuarlo. No hacemos lock-in técnico ni comercial." },
  { q: "¿Hacen mantenimiento mensual? ¿Es obligatorio?", a: "Lo recomendamos pero no es obligatorio. El mantenimiento incluye seguridad, performance, mejoras incrementales, SEO, monitoreo y soporte. Sitios sin mantenimiento son sitios que envejecen mal — pero el cliente decide." },
  { q: "¿Pueden integrarse con nuestro CRM, ERP o sistema de gestión?", a: "Sí. Hemos integrado con HubSpot, Salesforce, Pipedrive, Tango Gestión, Bejerman, Holded, sistemas custom internos y APIs propias del cliente. Si tiene API o webhook, lo integramos." },
  { q: "¿Qué pasa si necesitamos cambios después del lanzamiento?", a: "Por eso recomendamos plan de mantenimiento — incluye un pool de horas mensuales para cambios, mejoras y soporte. Para proyectos grandes nuevos, abrimos una nueva fase de desarrollo. Lo que no hacemos es 'cambios urgentes y gratis' a perpetuidad." },
  { q: "¿Trabajan con SEO técnico desde el desarrollo?", a: "Sí, siempre. Estructura semántica, schema.org, sitemap, meta tags dinámicos, performance, Core Web Vitals, internacionalización si aplica. El SEO técnico se construye durante el desarrollo — no después." },
];

const OTHER_SERVICES = [
  { path: "/servicios/disenio", num: "01 / Diseño", title: "Diseño", desc: "Identidad y sistema visual." },
  { path: "/servicios/multimedia", num: "02 / Multimedia", title: "Multimedia", desc: "Audiovisual, motion y producción." },
  { path: "/servicios/paid-media", num: "04 / Paid Media", title: "Paid Media", desc: "Inversión publicitaria con ROI." },
  { path: "/servicios/social-media", num: "05 / Redes Sociales", title: "Redes Sociales", desc: "Contenido y comunidad diaria." },
];

const CIRC = 628.3;

function getVerdict(score) {
  if (score >= 80) return { v: <>Tu sitio está en <em>muy buen estado</em></>, d: "Tenés un sitio sólido. Quedan espacios de mejora menores en performance, SEO o conversión que podemos optimizar." };
  if (score >= 60) return { v: <>Tu sitio funciona pero <em>tiene espacio</em></>, d: "Hay puntos clave para mejorar. Una optimización dirigida puede generar saltos importantes en conversión y posicionamiento." };
  if (score >= 40) return { v: <>Tu sitio <em>necesita intervención</em></>, d: "Hay varios factores críticos sin resolver. Recomendamos auditoría completa antes de invertir más en marketing digital." };
  if (score >= 20) return { v: <>Tu sitio <em>está limitando</em> el negocio</>, d: "Hay deficiencias estructurales importantes. Sin un sitio sólido, el resto del marketing pierde efectividad. Hablemos." };
  return { v: <>Es momento de <em>repensar el sitio</em></>, d: "El estado actual no acompaña al negocio. Te recomendamos auditoría inmediata para diagnosticar prioridades." };
}

export default function Desarrollo() {
  const pageRef = useRef(null);
  const sliderRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [answers, setAnswers] = useState(Array(6).fill(null));

  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a !== null).reduce((acc, v) => acc + v, 0);
  const isComplete = answeredCount === 6;
  const scoreOffset = CIRC - (CIRC * score) / 100;
  const verdict = isComplete ? getVerdict(score) : null;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll(".ds-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const slides = container.querySelectorAll(".ds-slider-image");
    const indicators = container.querySelectorAll(".ds-slider-indicator");
    const counter = container.querySelector(".ds-slider-counter");
    if (!slides.length) return;

    let current = 0;
    const total = slides.length;
    let timer = null;

    function update(i) {
      slides[current].classList.remove("active");
      indicators[current]?.classList.remove("active");
      current = i;
      slides[current].classList.add("active");
      const ind = indicators[current];
      if (ind) {
        ind.classList.add("active");
        ind.style.animation = "none";
        void ind.offsetWidth;
        ind.style.animation = "";
      }
      if (counter) counter.textContent = `0${current + 1} / 0${total}`;
    }

    function start() { timer = setInterval(() => update((current + 1) % total), 5000); }
    start();
    indicators.forEach((ind, i) => ind.addEventListener("click", () => { clearInterval(timer); update(i); start(); }));

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ds-page" ref={pageRef}>

      <div className="ds-breadcrumb">
        <Link to="/">Trompo</Link>
        <span className="ds-breadcrumb-sep">/</span>
        <Link to="/servicios">Servicios</Link>
        <span className="ds-breadcrumb-sep">/</span>
        <span className="ds-breadcrumb-current">Desarrollo Web</span>
      </div>

      <section className="ds-hero">
        <div className="ds-hero-slider" ref={sliderRef}>
          {SLIDER_IMAGES.map((img, i) => (
            <div key={i} className={`ds-slider-image${i === 0 ? " active" : ""}`} style={{ backgroundImage: `url('${img}')` }} />
          ))}
          <div className="ds-slider-indicators">
            {SLIDER_IMAGES.map((_, i) => (
              <div key={i} className={`ds-slider-indicator${i === 0 ? " active" : ""}`} />
            ))}
            <span className="ds-slider-counter">01 / 0{SLIDER_IMAGES.length}</span>
          </div>
        </div>

        <div className="ds-hero-eyebrow">
          <span>Servicio · 2026</span>
          <span className="ds-blink">●</span>
          <span>Desarrollo web &amp; plataformas</span>
        </div>

        <h1 className="ds-hero-title">
          <span className="ds-hero-title-line"><span>Sitios y</span></span>
          <span className="ds-hero-title-line"><span>plataformas</span></span>
          <span className="ds-hero-title-line"><span>que <em>convierten</em></span></span>
          <span className="ds-hero-title-line"><span>y escalan.</span></span>
        </h1>

        <div className="ds-hero-bottom">
          <p className="ds-hero-desc">
            <strong>Tu sitio es el activo digital más rentable del negocio.</strong> Desarrollamos sitios institucionales, e-commerce y plataformas a medida con foco en performance, posicionamiento y conversión real — no en demos visuales que después no se sostienen.
          </p>
          <div className="ds-hero-stat">
            <div className="ds-hero-stat-num">120+</div>
            <div className="ds-hero-stat-label">Sitios entregados con stack moderno y mantenimiento mensual</div>
          </div>
          <div className="ds-hero-stat">
            <div className="ds-hero-stat-num">95</div>
            <div className="ds-hero-stat-label">Score promedio en Google Lighthouse en sitios entregados</div>
          </div>
        </div>
      </section>

      <div className="ds-divider" />

      <section className="ds-manifesto">
        <div>
          <div className="ds-manifesto-num ds-reveal">01<small>Desarrollo Web</small></div>
        </div>
        <div className="ds-manifesto-content">
          <h2 className="ds-reveal">
            El sitio no es un <span className="ds-strike">folleto.</span><br />
            Es la <em>herramienta</em><br />
            de venta más usada.
          </h2>
          <p className="ds-manifesto-lead ds-reveal">
            El sitio es la pieza digital que más visita tu cliente potencial — antes de llamarte, antes de pedir cotización, antes de visitarte. Sin embargo es la pieza que muchas empresas tratan como tarjeta de presentación. Lo abordamos al revés: el sitio es una herramienta de venta y un activo de posicionamiento. Diseñamos pensando en conversión, escribimos pensando en SEO y construimos pensando en performance que se sostiene en el tiempo.
          </p>
        </div>
      </section>

      <div className="ds-divider" />

      <section className="ds-scorecard-section" id="scorecard">
        <div className="ds-scorecard-header">
          <div>
            <div className="ds-section-eyebrow ds-reveal">02 · Auditá tu sitio</div>
            <h2 className="ds-scorecard-h ds-reveal">¿Qué tan bien<br />está tu sitio <em>hoy?</em></h2>
          </div>
          <p className="ds-scorecard-meta ds-reveal">
            <strong>5 min</strong>
            auditoría rápida basada en los 6 factores que más impactan en conversión y posicionamiento
          </p>
        </div>

        <div className="ds-scorecard-tool ds-reveal">
          <div className="ds-scorecard-input">
            <h3 className="ds-scorecard-input-h">Scorecard de auditoría</h3>
            <p className="ds-scorecard-input-sub">Respondé las 6 preguntas y obtené un puntaje sobre 100 con diagnóstico inicial gratuito.</p>
            <div className="ds-scorecard-form">
              {SCORE_QUESTIONS.map((item, idx) => (
                <div key={idx} className="ds-score-q-block">
                  <div className="ds-score-question">{item.q}</div>
                  <div className="ds-score-options">
                    {item.opts.map((opt, oi) => (
                      <button
                        key={oi}
                        className={`ds-score-btn${answers[idx] === opt.val ? " selected" : ""}`}
                        onClick={() => { const next = [...answers]; next[idx] = opt.val; setAnswers(next); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="ds-score-progress">Respuestas: <strong>{answeredCount}</strong> / 6</div>
          </div>

          <div className="ds-scorecard-result">
            <div className="ds-score-circle">
              <svg viewBox="0 0 220 220">
                <circle className="ds-score-circle-bg" cx="110" cy="110" r="100" />
                <circle className="ds-score-circle-fg" cx="110" cy="110" r="100" style={{ strokeDashoffset: scoreOffset }} />
              </svg>
              <div className="ds-score-number">
                <div className="ds-score-number-big">{score}</div>
                <div className="ds-score-number-max">/ 100</div>
              </div>
            </div>
            <div className="ds-score-verdict">
              {isComplete ? verdict.v : <>Empezá la auditoría<br />para ver <em>tu puntaje.</em></>}
            </div>
            <p className="ds-score-detail">
              {isComplete ? verdict.d : "Tomate 5 minutos. Te devuelve un diagnóstico inicial sobre qué intervenir y por dónde arrancar."}
            </p>
            <Link to="/contactanos" className="ds-score-cta">Pedir auditoría completa →</Link>
          </div>
        </div>
      </section>

      <div className="ds-divider" />

      <section className="ds-tech-stack">
        <h2 className="ds-tech-stack-h ds-reveal">Stack moderno.<br />Decisiones <em>técnicas profesionales.</em></h2>
        <div className="ds-tech-grid ds-reveal">
          {TECH_ITEMS.map((item, i) => (
            <div key={i} className="ds-tech-cell">
              <div className="ds-tech-cell-name">{item.name}</div>
              <div className="ds-tech-cell-cat">{item.cat}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="ds-divider" />

      <section className="ds-deliverables-section">
        <div className="ds-section-eyebrow ds-reveal">03 · Entregables</div>
        <h2 className="ds-deliverables-h ds-reveal">Lo que desarrollamos<br />en <em>cada proyecto.</em></h2>
        <div className="ds-deliverables-grid">
          {DELIVERABLES.map((item, i) => (
            <div key={i} className="ds-deliverable-cell ds-reveal">
              <div className="ds-deliverable-letter">{item.letter}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-portfolio">
        <div className="ds-portfolio-header">
          <div>
            <div className="ds-section-eyebrow ds-reveal">04 · Portfolio</div>
            <h2 className="ds-portfolio-h ds-reveal">Sitios y plataformas<br />que ya están <em>en producción.</em></h2>
          </div>
          <div className="ds-portfolio-meta ds-reveal">
            <strong>120+</strong>
            sitios entregados con stack moderno y mantenimiento mensual activo en operación.
          </div>
        </div>
        <div className="ds-portfolio-grid">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <a key={i} href="#" className="ds-portfolio-item ds-reveal">
              <img src={item.img} alt={item.name} loading="lazy" />
              <div className="ds-portfolio-item-overlay">
                <div className="ds-portfolio-item-tag">{item.tag}</div>
                <div className="ds-portfolio-item-name">{item.name}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="ds-process">
        <div className="ds-process-inner">
          <div className="ds-section-eyebrow ds-reveal">05 · Cómo trabajamos</div>
          <h2 className="ds-process-h ds-reveal">El proceso<br />de <em>cada desarrollo.</em></h2>
          <div className="ds-timeline-list">
            {TIMELINE.map((item, i) => (
              <div key={i} className="ds-timeline-item ds-reveal">
                <div className="ds-timeline-step">{item.step}</div>
                <div className="ds-timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className="ds-timeline-duration">{item.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ds-testimonials">
        <div className="ds-testimonials-inner">
          <div className="ds-section-eyebrow ds-reveal">06 · Lo que dicen los clientes</div>
          <h2 className="ds-deliverables-h ds-reveal">Lo que dicen los clientes<br />sobre <em>el proceso.</em></h2>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="ds-testimonial-card ds-reveal">
              <div className="ds-testimonial-quote-mark">"</div>
              <div>
                <p className="ds-testimonial-text">{t.quote}</p>
                <div className="ds-testimonial-meta">
                  <div className="ds-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="ds-testimonial-name">{t.name}</div>
                    <div className="ds-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-stats">
        <div className="ds-stats-eyebrow">Trompo en números</div>
        <div className="ds-stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="ds-stat-cell ds-reveal">
              <div className="ds-stat-big">{s.num}<em>{s.suffix}</em></div>
              <div className="ds-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-faqs">
        <div className="ds-faqs-header">
          <div>
            <div className="ds-section-eyebrow ds-reveal">07 · Preguntas frecuentes</div>
            <h2 className="ds-faqs-h ds-reveal">Preguntas técnicas<br />y de <em>negocio.</em></h2>
          </div>
          <p className="ds-faqs-meta ds-reveal">
            Las preguntas más frecuentes de clientes B2B y B2C que nunca trabajaron con una agencia de desarrollo profesional. Si tu pregunta no está, escribinos.
          </p>
        </div>
        <div className="ds-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`ds-faq-item${openFaq === i ? " open" : ""}`}>
              <button className="ds-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <span className="ds-faq-q-icon" />
              </button>
              <div className="ds-faq-a">
                <div className="ds-faq-a-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-other-services">
        <div className="ds-section-eyebrow ds-reveal">Sistema integrado</div>
        <h2 className="ds-other-services-h ds-reveal">Conocé los otros<br />servicios <em>del sistema.</em></h2>
        <div className="ds-services-grid">
          {OTHER_SERVICES.map((s, i) => (
            <Link key={i} to={s.path} className="ds-service-card">
              <div className="ds-service-card-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <span className="ds-service-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ds-cta-banner" id="contacto">
        <div className="ds-cta-banner-bg">Desarrollo</div>
        <div className="ds-cta-inner">
          <div className="ds-section-eyebrow ds-reveal" style={{ justifyContent: "center" }}>Conversemos</div>
          <h2 className="ds-reveal">¿Tu sitio actual <em>no convierte</em><br />como debería?</h2>
          <p className="ds-reveal">
            Te hacemos una auditoría técnica completa: performance, SEO, conversión y arquitectura. Te decimos qué intervenir y por qué orden — sin propuesta cerrada de entrada.
          </p>
          <div className="ds-cta-buttons-row ds-reveal">
            <Link to="/contactanos" className="ds-btn-primary">Pedir auditoría →</Link>
            <Link to="/nosotros" className="ds-btn-ghost">Ver más casos</Link>
          </div>
        </div>
      </section>

      <Dock
        links={[
          { title: "Auditar mi sitio", anchor: "#scorecard" },
          { title: "Contacto", anchor: "#contacto" },
        ]}
        cta={{ label: "Hablemos →", to: "/contactanos" }}
      />

    </div>
  );
}
