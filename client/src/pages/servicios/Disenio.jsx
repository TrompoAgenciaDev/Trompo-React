import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Dock from "../../components/Dock";
import "../../assets/styles/disenio-page.css";

/* ── Data ─────────────────────────────────────────────── */

const SLIDER_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1400&q=80",
    alt: "Diseño gráfico profesional",
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=80",
    alt: "Branding creativo",
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1400&q=80",
    alt: "Identidad visual",
  },
];

const BA_CASES = [
  {
    label: "CEDIR Salud",
    before: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    after: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
    desc: "Rediseño de identidad visual para transmitir confianza y modernidad.",
    result: "+340% en reconocimiento de marca",
  },
  {
    label: "Super Walter",
    before: "https://images.unsplash.com/photo-1604908554007-b1f9c47b88a6?w=1200&q=80",
    after: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
    desc: "Nueva imagen de marca para la cadena de supermercados.",
    result: "Reconocimiento duplicado en 6 meses",
  },
  {
    label: "Ardu Café",
    before: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    after: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80",
    desc: "Branding artesanal que captura la esencia del café de especialidad.",
    result: "Aumento del 60% en ticket promedio",
  },
  {
    label: "Mosaicos Blangino",
    before: "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&q=80",
    after: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    desc: "Tradición artesanal con estética contemporánea.",
    result: "Expansión a 3 nuevos mercados",
  },
];

const DELIVERABLES = [
  {
    letter: "Id",
    title: "Identidad de Marca",
    desc: "Logotipo, paleta cromática, tipografías, voz y manual de uso completo.",
  },
  {
    letter: "Ed",
    title: "Diseño Editorial",
    desc: "Catálogos, brochures, revistas y piezas impresas de alta calidad.",
  },
  {
    letter: "Di",
    title: "Piezas Digitales",
    desc: "Posts, stories, banners, newsletters y assets para todas las plataformas.",
  },
  {
    letter: "Pk",
    title: "Packaging",
    desc: "Diseño de etiquetas, cajas y envases que destacan en el punto de venta.",
  },
];

const PORTFOLIO_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80",
    tag: "Branding",
    name: "CEDIR Salud",
  },
  {
    src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    tag: "Editorial",
    name: "Super Walter",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tag: "Packaging",
    name: "Ardu Café",
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    tag: "Identidad",
    name: "Mosaicos Blangino",
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
    tag: "Social Media",
    name: "Campañas 2024",
  },
  {
    src: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
    tag: "UX/UI",
    name: "Apps & Web",
  },
];

const TIMELINE = [
  {
    num: "01",
    title: "Descubrimiento",
    desc: "Investigamos tu marca, competidores y audiencia para definir el territorio visual.",
    duration: "1–2 días",
  },
  {
    num: "02",
    title: "Concepto",
    desc: "Desarrollamos moodboards y alternativas conceptuales para validar la dirección.",
    duration: "3–5 días",
  },
  {
    num: "03",
    title: "Diseño",
    desc: "Refinamos la propuesta elegida en todos los formatos y aplicaciones necesarias.",
    duration: "1–2 semanas",
  },
  {
    num: "04",
    title: "Entrega",
    desc: "Manual de marca, archivos editables y soporte para la implementación.",
    duration: "1–2 días",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Trompo transformó nuestra imagen por completo. El nuevo branding nos abrió puertas que antes ni imaginábamos.",
    author: "Lucía Fernández",
    role: "Directora, CEDIR Salud",
    initial: "L",
  },
  {
    quote:
      "En tres semanas teníamos una identidad visual que realmente nos representaba. El proceso fue increíblemente claro.",
    author: "Martín Quiroga",
    role: "Fundador, Ardu Café",
    initial: "M",
  },
];

const STATS = [
  { value: "200+", label: "Marcas\ndiseñadas" },
  { value: "98%", label: "Clientes\nsatisfechos" },
  { value: "12", label: "Premios\nregionales" },
  { value: "8", label: "Años de\ntrayectoria" },
];

const SCORE_QUESTIONS = [
  {
    q: "¿Tu logo se ve bien en blanco y negro?",
    opts: ["Sí, siempre", "Más o menos", "No, se pierde todo"],
  },
  {
    q: "¿Tenés un manual de marca definido?",
    opts: ["Sí, completo", "Algo básico", "No tengo nada"],
  },
  {
    q: "¿Tus piezas de comunicación son consistentes?",
    opts: ["Siempre", "A veces", "Rara vez"],
  },
  {
    q: "¿Podés describir tu paleta de colores de memoria?",
    opts: ["Perfectamente", "Solo algunos", "No tengo paleta fija"],
  },
  {
    q: "¿Tus clientes reconocen tu marca sin el nombre?",
    opts: ["La mayoría", "Algunos", "Necesitan el nombre"],
  },
  {
    q: "¿Cuándo fue la última vez que actualizaste tu identidad?",
    opts: ["Menos de 2 años", "Entre 2 y 5 años", "Más de 5 años o nunca"],
  },
];

const FAQ_ITEMS = [
  {
    q: "¿Cuánto tarda un proyecto de branding completo?",
    a: "Un proyecto de identidad visual completo lleva entre 3 y 6 semanas, dependiendo de la complejidad y los ciclos de revisión. Proyectos más acotados como rediseño de logo pueden estar listos en 1–2 semanas.",
  },
  {
    q: "¿Qué formatos entregás al final del proyecto?",
    a: "Entregamos todos los archivos fuente (AI, PSD, Figma), versiones exportadas en PNG, SVG, PDF, más el manual de marca en PDF interactivo con todas las especificaciones.",
  },
  {
    q: "¿Trabajamos juntos durante el proceso o solo al final?",
    a: "El proceso es colaborativo desde el día uno. Tenemos instancias de revisión en cada etapa: concepto, primer borrador y versión final. Tu feedback es parte del diseño.",
  },
  {
    q: "¿Puedo pedir cambios después de la entrega final?",
    a: "Incluimos dos rondas de revisión en cada etapa. Cambios adicionales o nuevas aplicaciones post-entrega se presupuestan por separado.",
  },
  {
    q: "¿Diseñan solo para empresas grandes?",
    a: "No. Trabajamos con emprendedores, pymes y marcas consolidadas. Tenemos propuestas adaptadas a cada escala sin sacrificar calidad.",
  },
  {
    q: "¿También hacen diseño para redes sociales?",
    a: "Sí. Creamos templates de posts, stories, highlights covers y banners optimizados para cada plataforma, con coherencia total con tu identidad.",
  },
  {
    q: "¿Cómo empezamos?",
    a: "Escribinos a través del formulario de contacto o por WhatsApp. Agendamos una llamada de 30 minutos sin cargo para entender tu proyecto y presentarte una propuesta.",
  },
];

const OTHER_SERVICES = [
  { title: "Desarrollo Web", href: "/servicios/desarrollo", icon: "⟨/⟩", desc: "Sitios y apps a medida" },
  { title: "Multimedia", href: "/servicios/multimedia", icon: "▶", desc: "Video, foto y animación" },
  { title: "Paid Media", href: "/servicios/paid-media", icon: "◎", desc: "Publicidad que convierte" },
  { title: "Social Media", href: "/servicios/social-media", icon: "⊕", desc: "Comunidades que crecen" },
];

/* ── Score helpers ─────────────────────────────────────── */
const CIRCUMFERENCE = 2 * Math.PI * 54; // ≈ 339.29

function computeScore(answers) {
  const filled = answers.filter((a) => a !== null);
  if (!filled.length) return { score: 0, offset: CIRCUMFERENCE, verdict: null };
  const total = filled.reduce((sum, i) => sum + (2 - i) * 33.33, 0) / filled.length;
  const score = Math.round(total);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  let verdict = "Identidad sólida";
  if (score < 40) verdict = "Necesitás una identidad";
  else if (score < 70) verdict = "Hay mucho por mejorar";
  return { score, offset, verdict };
}

/* ── Component ─────────────────────────────────────────── */
export default function Disenio() {
  /* Hero slider */
  const sliderRef = useRef(null);

  /* Before/After */
  const [baTab, setBaTab] = useState(0);
  const dragging = useRef(false);
  const stageRef = useRef(null);
  const dividerRef = useRef(null);
  const handleRef = useRef(null);
  const afterRef = useRef(null);

  /* Scorecard */
  const [answers, setAnswers] = useState(Array(SCORE_QUESTIONS.length).fill(null));

  /* FAQ */
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Hero slider effect ─────────────────────────────── */
  useEffect(() => {
    const slides = sliderRef.current?.querySelectorAll(".dn-slider-image");
    const inds = sliderRef.current?.querySelectorAll(".dn-slider-indicator");
    if (!slides?.length) return;

    let current = 0;

    function goTo(idx) {
      slides[current].classList.remove("active");
      inds[current]?.classList.remove("active");
      current = idx;
      slides[current].classList.add("active");
      if (inds[current]) {
        inds[current].classList.remove("active");
        void inds[current].offsetWidth;
        inds[current].classList.add("active");
      }
    }

    slides[0].classList.add("active");
    inds[0]?.classList.add("active");

    const timer = setInterval(() => goTo((current + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  /* ── BA drag ────────────────────────────────────────── */
  function updatePos(clientX) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    if (dividerRef.current) dividerRef.current.style.left = `${pct}%`;
    if (handleRef.current) handleRef.current.style.left = `${pct}%`;
    if (afterRef.current)
      afterRef.current.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return;
      updatePos(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  /* Reset BA divider on tab change */
  useEffect(() => {
    if (dividerRef.current) dividerRef.current.style.left = "50%";
    if (handleRef.current) handleRef.current.style.left = "50%";
    if (afterRef.current)
      afterRef.current.style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
  }, [baTab]);

  /* ── Scroll reveal ──────────────────────────────────── */
  useEffect(() => {
    const els = document.querySelectorAll(".dn-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Score ──────────────────────────────────────────── */
  const { score, offset, verdict } = computeScore(answers);
  const answered = answers.filter((a) => a !== null).length;

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="dn-page">
      <Dock
        links={[
          { title: "Casos", anchor: "#portfolio" },
          { title: "Proceso", anchor: "#proceso" },
        ]}
        cta={{ label: "Hablemos →", to: "/contactanos" }}
      />

      {/* Breadcrumb */}
      <nav className="dn-breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/servicios">Servicios</Link>
        <span>/</span>
        <span>Diseño</span>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="dn-hero">
        <div className="dn-hero-slider" ref={sliderRef}>
          {SLIDER_IMAGES.map((img, i) => (
            <div
              key={i}
              className="dn-slider-image"
              style={{ backgroundImage: `url(${img.src})` }}
              aria-label={img.alt}
            />
          ))}
          <div className="dn-slider-indicators">
            {SLIDER_IMAGES.map((_, i) => (
              <span key={i} className="dn-slider-indicator" />
            ))}
            <span className="dn-slider-counter">
              01/{String(SLIDER_IMAGES.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <p className="dn-hero-eyebrow">Diseño Gráfico &amp; Branding</p>
        <h1 className="dn-hero-title">
          Identidades que
          <br />
          <em>se recuerdan</em>
        </h1>
        <div className="dn-hero-bottom">
          <p className="dn-hero-desc">
            Creamos sistemas visuales que comunican quiénes son{" "}
            <strong>antes de decir una sola palabra.</strong> Cada decisión de diseño es estrategia.
          </p>
          <div className="dn-hero-stat">
            <p className="dn-hero-stat-num">200+</p>
            <p className="dn-hero-stat-label">{"Marcas\ndiseñadas"}</p>
          </div>
          <div className="dn-hero-stat">
            <p className="dn-hero-stat-num">8</p>
            <p className="dn-hero-stat-label">{"Años de\ntrayectoria"}</p>
          </div>
        </div>
      </section>

      {/* ── Manifesto ─────────────────────────────────── */}
      <section className="dn-manifesto dn-reveal">
        <div className="dn-manifesto-num">
          § 01 — Filosofía
          <small>Nuestro manifiesto</small>
        </div>
        <div className="dn-manifesto-content">
          <h2>
            El diseño no es decoración.
            <br />
            <em>Es la primera conversación</em>
            <br />
            que tu marca tiene con el mundo.
          </h2>
          <p className="dn-manifesto-lead">
            Cada color, cada trazo, cada tipografía es una decisión estratégica. Diseñamos marcas
            que generan reconocimiento, confianza y conexión emocional con quienes más importan.
          </p>
        </div>
      </section>

      {/* ── Before / After ────────────────────────────── */}
      <section className="dn-before-after-section dn-reveal">
        <div className="dn-ba-header">
          <h2 className="dn-ba-h">
            Antes y <em>después</em>
          </h2>
          <div className="dn-ba-meta">
            <strong>4</strong>
            transformaciones reales de marca
          </div>
        </div>

        <div className="dn-ba-tabs">
          {BA_CASES.map((c, i) => (
            <button
              key={i}
              className={`dn-ba-tab${baTab === i ? " active" : ""}`}
              onClick={() => setBaTab(i)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          className="dn-ba-stage"
          ref={stageRef}
          onMouseDown={(e) => {
            dragging.current = true;
            updatePos(e.clientX);
          }}
          onTouchStart={(e) => {
            dragging.current = true;
            updatePos(e.touches[0].clientX);
          }}
        >
          {/* Before pane (always visible underneath) */}
          <div
            className="dn-ba-pane"
            style={{ backgroundImage: `url(${BA_CASES[baTab].before})` }}
          />
          {/* After pane (clipped to right side) */}
          <div
            className="dn-ba-pane dn-ba-pane-after"
            ref={afterRef}
            style={{ backgroundImage: `url(${BA_CASES[baTab].after})` }}
          />
          <span className="dn-ba-label dn-ba-label-before">Antes</span>
          <span className="dn-ba-label dn-ba-label-after">Después</span>
          <div className="dn-ba-divider" ref={dividerRef} />
          <div className="dn-ba-handle" ref={handleRef}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 12l-4-4m0 0l4-4M4 8h16M16 12l4 4m0 0l-4 4m4-4H4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="dn-ba-info">
          <div className="dn-ba-info-cell">
            <h4>Empresa</h4>
            <p>{BA_CASES[baTab].label}</p>
          </div>
          <div className="dn-ba-info-cell">
            <h4>Intervención</h4>
            <p>{BA_CASES[baTab].desc}</p>
          </div>
          <div className="dn-ba-info-cell">
            <h4>Resultado</h4>
            <p>{BA_CASES[baTab].result}</p>
          </div>
        </div>
      </section>

      {/* ── Deliverables ──────────────────────────────── */}
      <section className="dn-deliverables-section dn-reveal">
        <p className="dn-section-eyebrow">Qué creamos</p>
        <h2 className="dn-deliverables-h">
          Nuestros <em>entregables</em>
        </h2>
        <div className="dn-deliverables-grid">
          {DELIVERABLES.map((d, i) => (
            <div key={i} className="dn-deliverable-cell">
              <span className="dn-deliverable-letter">{d.letter}</span>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Portfolio ─────────────────────────────────── */}
      <section className="dn-portfolio dn-reveal" id="portfolio">
        <div className="dn-portfolio-header">
          <h2 className="dn-portfolio-h">
            Casos <em>seleccionados</em>
          </h2>
          <div className="dn-portfolio-meta">
            <strong>20+</strong>
            proyectos de diseño en los últimos 12 meses
          </div>
        </div>
        <div className="dn-portfolio-grid">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <div key={i} className="dn-portfolio-item">
              <img src={item.src} alt={item.name} className="dn-portfolio-img" loading="lazy" />
              <div className="dn-portfolio-item-overlay">
                <span className="dn-portfolio-item-tag">{item.tag}</span>
                <span className="dn-portfolio-item-name">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scorecard ─────────────────────────────────── */}
      <section className="dn-scorecard dn-reveal" id="scorecard">
        <div className="dn-scorecard-inner">
          <div className="dn-scorecard-header">
            <p className="dn-section-eyebrow">Diagnóstico rápido</p>
            <h2 className="dn-scorecard-h">¿Qué tan fuerte es tu marca?</h2>
          </div>
          <div className="dn-scorecard-body">
            <div className="dn-score-questions">
              {SCORE_QUESTIONS.map((item, qi) => (
                <div key={qi} className="dn-score-question">
                  <p className="dn-score-q">{item.q}</p>
                  <div className="dn-score-opts">
                    {item.opts.map((opt, oi) => (
                      <button
                        key={oi}
                        className={`dn-score-opt${answers[qi] === oi ? " selected" : ""}`}
                        onClick={() => {
                          const next = [...answers];
                          next[qi] = oi;
                          setAnswers(next);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="dn-score-result">
              <div className="dn-score-dial">
                <svg className="dn-score-circle" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" className="dn-score-track" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    className="dn-score-fill"
                    style={{ strokeDashoffset: offset }}
                  />
                </svg>
                <div className="dn-score-center">
                  <span className="dn-score-value">{answered ? `${score}%` : "—"}</span>
                  <span className="dn-score-sub">{answered ? `${answered}/${SCORE_QUESTIONS.length}` : "Respondé"}</span>
                </div>
              </div>
              <p className="dn-score-verdict">{verdict ?? "Respondé las preguntas"}</p>
              {verdict && (
                <Link to="/contactanos" className="dn-btn-primary">
                  Hablemos de tu marca →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────── */}
      <section className="dn-process dn-reveal" id="proceso">
        <div className="dn-process-inner">
          <p className="dn-section-eyebrow">Cómo trabajamos</p>
          <h2 className="dn-process-h">
            Nuestro <em>proceso</em>
          </h2>
          <div className="dn-timeline-list">
            {TIMELINE.map((step, i) => (
              <div key={i} className="dn-timeline-item">
                <span className="dn-timeline-step">{step.num}</span>
                <div className="dn-timeline-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <span className="dn-timeline-duration">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="dn-testimonials dn-reveal">
        <div className="dn-testimonials-inner">
          <p className="dn-section-eyebrow">Lo que dicen</p>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="dn-testimonial-card">
              <div className="dn-testimonial-quote-mark">"</div>
              <div>
                <p className="dn-testimonial-text">{t.quote}</p>
                <div className="dn-testimonial-meta">
                  <div className="dn-testimonial-avatar">{t.initial}</div>
                  <div>
                    <p className="dn-testimonial-name">{t.author}</p>
                    <p className="dn-testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="dn-stats dn-reveal">
        <p className="dn-stats-eyebrow">En números</p>
        <div className="dn-stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="dn-stat-cell">
              <p className="dn-stat-big">{s.value}</p>
              <p className="dn-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────── */}
      <section className="dn-faqs dn-reveal">
        <div className="dn-faqs-header">
          <h2 className="dn-faqs-h">
            Lo que más nos <em>preguntan</em>
          </h2>
          <p className="dn-faqs-meta">
            Respondemos las dudas más frecuentes sobre nuestro proceso y servicio de diseño.
          </p>
        </div>
        <div className="dn-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`dn-faq-item${openFaq === i ? " open" : ""}`}>
              <button
                className="dn-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <span className="dn-faq-q-icon" />
              </button>
              <div className="dn-faq-a">
                <div className="dn-faq-a-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Other Services ────────────────────────────── */}
      <section className="dn-other-services dn-reveal">
        <h2 className="dn-other-services-h">
          También <em>hacemos</em>
        </h2>
        <div className="dn-services-grid">
          {OTHER_SERVICES.map((s, i) => (
            <Link key={i} to={s.href} className="dn-service-card">
              <p className="dn-service-card-num">{s.icon}</p>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <span className="dn-service-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="dn-cta-banner dn-reveal" id="contacto">
        <div className="dn-cta-banner-bg">DISEÑO</div>
        <div className="dn-cta-inner">
          <h2>
            Tu marca merece
            <br />
            <em>diseño que funciona</em>
          </h2>
          <p>Contanos tu proyecto y te preparamos una propuesta en menos de 48 horas.</p>
          <div className="dn-cta-buttons-row">
            <Link to="/contactanos" className="dn-btn-primary">
              Quiero mi propuesta →
            </Link>
            <Link to="/servicios" className="dn-btn-ghost">
              Ver más servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
