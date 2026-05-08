import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/multimedia.css";
import "../../assets/styles/cta-section.css";
import FormIndex from "../../components/forms/FormIndex";
import TestimonialsSlider from "../../components/TestimonialsSlider";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=85",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1920&q=85",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=85",
];

const REEL_ITEMS = [
  {
    type: "video",
    src: "https://cdn.coverr.co/videos/coverr-an-empty-warehouse-with-orange-light-7466/1080p.mp4",
    tag: "Video institucional · Volvo",
    name: "Industrias del Movimiento — manifiesto de marca",
  },
  {
    type: "img",
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=85",
    alt: "Editing",
    tag: "Reel · Ardu Café",
    name: "Lanzamiento",
  },
  {
    type: "img",
    src: "https://images.unsplash.com/photo-1606170033648-5d55a3edf314?w=900&q=85",
    alt: "Motion",
    tag: "Motion · CEDIR",
    name: "Explainer salud",
  },
  {
    type: "img",
    src: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=900&q=85",
    alt: "Reel",
    tag: "Producto · Denso",
    name: "Spot técnico",
  },
  {
    type: "img",
    src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=900&q=85",
    alt: "Stories",
    tag: "Reels · Lozada",
    name: "Serie viajes",
  },
];

const FORMAT_PILLS = [
  "Video institucional", "Manifiesto de marca", "Reels Instagram", "Stories animadas",
  "Shorts YouTube", "TikTok nativo", "Spot publicitario", "Motion 2D",
  "Lottie UI", "Explainer video", "Infografía animada", "Producto fotográfico",
  "Lifestyle", "Foto de equipo", "Producción de packshot", "Video drone",
];

const DELIVERABLES = [
  {
    letter: "A",
    title: "Video institucional",
    desc: "Piezas de presentación corporativa, manifiestos de marca, reels para inversores y materiales para procesos comerciales. Producción con estándar profesional.",
  },
  {
    letter: "B",
    title: "Contenido para redes",
    desc: "Reels, stories, shorts y formatos verticales nativos de cada plataforma. Pensados para feed — no como adaptación de un video más largo.",
  },
  {
    letter: "C",
    title: "Motion graphics",
    desc: "Animación 2D, lottie para UI, motion para spots digitales, infografías animadas y explainer videos. Producción ágil, escalable y modular.",
  },
  {
    letter: "D",
    title: "Fotografía",
    desc: "Producto, lifestyle, equipo y locación. Contenido fotográfico pensado para alimentar todo el ecosistema digital — no solo el sitio web.",
  },
];

const TIMELINE = [
  {
    step: "01",
    title: "Briefing y guión",
    desc: "Antes de filmar definimos: qué problema de negocio resuelve este video, quién es la audiencia, qué tiene que pasar después de verlo. El guión es el plan, no la creatividad.",
    duration: "Semana 1",
  },
  {
    step: "02",
    title: "Pre-producción",
    desc: "Casting, locación, scouting, plan de rodaje, timeline y plan de cobertura. Llegar al rodaje con todo cerrado separa lo profesional de la improvisación.",
    duration: "Semanas 2–3",
  },
  {
    step: "03",
    title: "Producción",
    desc: "Rodaje con equipo técnico, dirección, sonido directo y registro en formato adecuado al destino final. Sin sobre-producción ni atajos — el equilibrio justo.",
    duration: "Semana 4",
  },
  {
    step: "04",
    title: "Post-producción",
    desc: "Edición, color, sonido, motion y entrega en los formatos que necesita cada canal. Una sola producción se traduce a múltiples entregables nativos por plataforma.",
    duration: "Semanas 5–6",
  },
];




const STATS = [
  { big: "1.5K", suffix: "+", label: "Piezas audiovisuales\nproducidas por año" },
  { big: "200", suffix: "+", label: "Proyectos completos\nde video institucional" },
  { big: "48hs", suffix: "", label: "Tiempo promedio de\nedición y entrega" },
  { big: "HD", suffix: "·4K", label: "Formatos nativos\nsegún destino" },
];

const FAQ_ITEMS = [
  {
    q: "¿Trabajan con productora propia o tercerizan el rodaje?",
    a: "Producimos in-house para piezas de redes, motion y fotografía. Para producciones más grandes (spots, video institucional con casting, locación múltiple) trabajamos con un equipo técnico de confianza que coordinamos como dirección creativa. La calidad y el criterio editorial los mantenemos nosotros siempre.",
  },
  {
    q: "¿Cuánto cuesta un video institucional?",
    a: "El rango es amplio: desde una producción ágil enfocada para redes hasta un manifiesto de marca con casting, locación, drone y post completa. En la primera reunión lo definimos según el objetivo del video y los canales de uso. Lo que nunca hacemos es cobrar lo mismo por dos producciones distintas.",
  },
  {
    q: "¿Pueden adaptar una pieza a múltiples formatos?",
    a: "Sí — y de hecho es como recomendamos producir hoy. Una sola sesión bien planificada se traduce a video largo, reels verticales, stories, post estáticos y carruseles. Más eficiente y mucho más coherente que producir cada formato por separado.",
  },
  {
    q: "¿Hacen guión y dirección creativa o solo ejecutan?",
    a: "Hacemos guión, dirección creativa, dirección de arte y dirección audiovisual. No ejecutamos guiones ajenos sin antes proponer ajustes — si vamos a poner el nombre, queremos que la pieza funcione.",
  },
  {
    q: "¿Trabajan con motion graphics y animación 2D?",
    a: "Sí. Tenemos equipo de motion in-house. Producimos animación 2D, lottie para interfaces, motion para spots digitales, explainer videos e infografías animadas. Todo bajo el sistema visual de la marca.",
  },
  {
    q: "¿Pueden mantener un calendario de contenido sostenido?",
    a: "Sí. Tenemos clientes que producen 100+ piezas mensuales con nosotros. Trabajamos con un sistema de jornadas de producción mensuales que permite mantener calidad y volumen sin caer en automatización ciega.",
  },
];

const Multimedia = () => {
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const observerRef = useRef(null);
  const timerRef = useRef(null);
  const total = SLIDER_IMAGES.length;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".mm-page .mm-reveal").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % total), 5000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setSlide(i);
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % total), 5000);
  };

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="mm-page">

      {/* BREADCRUMB */}
      <div className="mm-breadcrumb">
        <Link to="/">Trompo</Link>
        <span className="mm-breadcrumb-sep">/</span>
        <Link to="/servicios">Servicios</Link>
        <span className="mm-breadcrumb-sep">/</span>
        <span className="mm-breadcrumb-current">Multimedia</span>
      </div>

      {/* HERO */}
      <section className="mm-hero">
        <div className="mm-hero-slider">
          {SLIDER_IMAGES.map((url, i) => (
            <div
              key={i}
              className={`mm-slider-image${i === slide ? " active" : ""}`}
              style={{ backgroundImage: `url('${url}')` }}
            />
          ))}
          <div className="mm-slider-overlay" />
        </div>

        <div className="mm-slider-indicators">
          {SLIDER_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`mm-slider-indicator${i === slide ? " active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
          <span className="mm-slider-counter">0{slide + 1} / 0{total}</span>
        </div>

        <div className="mm-hero-eyebrow">
          <span>Servicio · 2026</span>
          <span className="mm-blink">●</span>
          <span>Producción audiovisual & motion</span>
        </div>

        <h1 className="mm-hero-title">
          <span className="mm-title-line"><span>Producción</span></span>
          <span className="mm-title-line"><span>audiovisual</span></span>
          <span className="mm-title-line"><span>con <em>propósito</em></span></span>
          <span className="mm-title-line"><span>de negocio.</span></span>
        </h1>

        <div className="mm-hero-bottom">
          <p className="mm-hero-desc">
            <strong>La producción audiovisual no es contenido decorativo.</strong> Cada pieza producida resuelve una necesidad de comunicación específica: explicar un producto, posicionar una marca, sostener un lanzamiento, capacitar una red comercial. La estética se subordina al objetivo — no al revés.
          </p>
          <div className="mm-hero-stat">
            <div className="mm-hero-stat-num">200+</div>
            <div className="mm-hero-stat-label">Proyectos audiovisuales producidos por año en operación</div>
          </div>
          <div className="mm-hero-stat">
            <div className="mm-hero-stat-num">2x</div>
            <div className="mm-hero-stat-label">Producción in-house o en locación según el proyecto</div>
          </div>
        </div>
      </section>

      <div className="mm-divider" />

      {/* MANIFESTO */}
      <section className="mm-manifesto">
        <div>
          <div className="mm-manifesto-num mm-reveal">
            01<small>Lo que sostenemos</small>
          </div>
        </div>
        <div className="mm-manifesto-content">
          <h2 className="mm-reveal">
            No producimos <span className="mm-strike">videos sueltos.</span><br />
            Producimos <em>activos</em><br />
            al servicio del negocio.
          </h2>
          <p className="mm-manifesto-lead mm-reveal">
            Un video no es una pieza más del calendario editorial. Es una herramienta concreta para resolver una necesidad de comunicación con un objetivo medible. Lo abordamos así desde la pre-producción: con propósito definido, guion que lo respalda y ejecución técnica al servicio del mensaje. Las producciones que existen para lucirse y no para resolver consumen recursos sin generar resultado.
          </p>
        </div>
      </section>

      <div className="mm-divider" />

      {/* REEL GRID */}
      <section className="mm-reel-section">
        <div className="mm-reel-header">
          <div>
            <div className="mm-section-eyebrow mm-reveal">02 · Reel</div>
            <h2 className="mm-reel-h mm-reveal">Algunas piezas<br /><em>recientes.</em></h2>
          </div>
          <p className="mm-reel-meta mm-reveal">
            <strong>1.5K+</strong>
            {" "}piezas audiovisuales producidas en los últimos 24 meses · clickeá para reproducir
          </p>
        </div>

        <div className="mm-reel-grid">
          {REEL_ITEMS.map((item, i) => (
            <div key={i} className="mm-reel-item mm-reveal">
              {item.type === "video" ? (
                <video src={item.src} muted loop playsInline autoPlay />
              ) : (
                <img src={item.src} alt={item.alt} />
              )}
              <div className="mm-reel-play-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <div className="mm-reel-item-overlay">
                <div className="mm-reel-item-tag">{item.tag}</div>
                <div className="mm-reel-item-name">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORMATS */}
      <section className="mm-formats-section">
        <h2 className="mm-formats-h mm-reveal">
          Producimos en <em>todos los formatos</em><br />nativos de cada canal.
        </h2>
        <div className="mm-formats-pills mm-reveal">
          {FORMAT_PILLS.map((pill, i) => (
            <span key={i} className="mm-format-pill">
              <em>{String(i + 1).padStart(2, "0")}</em>
              {pill}
            </span>
          ))}
        </div>
      </section>

      <div className="mm-divider" />

      {/* DELIVERABLES */}
      <section className="mm-deliverables-section">
        <div className="mm-section-eyebrow mm-reveal">03 · Entregables</div>
        <h2 className="mm-deliverables-h mm-reveal">
          Lo que producimos<br />en <em>cada proyecto.</em>
        </h2>
        <div className="mm-deliverables-grid">
          {DELIVERABLES.map((d) => (
            <div key={d.letter} className="mm-deliverable-cell mm-reveal">
              <div className="mm-deliverable-letter">{d.letter}</div>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mm-process">
        <div className="mm-process-inner">
          <div className="mm-section-eyebrow mm-reveal">04 · Cómo trabajamos</div>
          <h2 className="mm-process-h mm-reveal">
            El proceso<br />de <em>cada producción.</em>
          </h2>
          <div className="mm-timeline-list">
            {TIMELINE.map((t) => (
              <div key={t.step} className="mm-timeline-item mm-reveal">
                <div className="mm-timeline-step">{t.step}</div>
                <div className="mm-timeline-content">
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
                <div className="mm-timeline-duration">{t.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSlider
        eyebrow="05 · Testimonios"
        heading="Marcas que confiaron<br /><em>su producción</em> a Trompo."
      />

      {/* STATS */}
      <section className="mm-stats">
        <div className="mm-stats-eyebrow">Trompo en números</div>
        <div className="mm-stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="mm-stat-cell mm-reveal">
              <div className="mm-stat-big">{s.big}<em>{s.suffix}</em></div>
              <div className="mm-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mm-faqs">
        <div className="mm-faqs-header">
          <div>
            <div className="mm-section-eyebrow mm-reveal">06 · Preguntas frecuentes</div>
            <h2 className="mm-faqs-h mm-reveal">
              Las preguntas <em>antes</em><br />de empezar a producir.
            </h2>
          </div>
          <p className="mm-faqs-meta mm-reveal">
            Las dudas más frecuentes sobre nuestro modo de trabajar producción audiovisual. Si tu pregunta no está, escribinos.
          </p>
        </div>
        <div className="mm-faq-list">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className={`mm-faq-item${openFaq === i ? " open" : ""}`}>
              <button className="mm-faq-q" onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                <span className="mm-faq-icon" />
              </button>
              <div className="mm-faq-a">
                <div className="mm-faq-a-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + FORM */}
      <section className="cta-section" id="contacto">
        <div className="cta-bg-mega">Multimedia</div>
        <div className="cta-wrap">
          <div>
            <div className="cta-eyebrow">Conversemos</div>
            <h2 className="cta-h">
              ¿Necesitás <em>contenido audiovisual</em><br />con criterio profesional?
            </h2>
            <p className="reveal">
              Una conversación inicial sobre el proyecto audiovisual. Sin propuesta cerrada de antemano. Recomendación profesional honesta sobre qué tipo de producción se ajusta al objetivo de negocio.
            </p>
          </div>

          <div className="cta-form-card reveal">
            <h3 className="cta-form-h">Completá el siguiente formulario.</h3>
            <p className="cta-form-sub">Definamos tu próximo paso estratégico.</p>

            <FormIndex location="multimedia" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Multimedia;
