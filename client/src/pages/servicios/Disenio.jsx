import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/disenio-page.css";
import "../../assets/styles/cta-section.css";
import FormIndex from "../../components/forms/FormIndex";
import TestimonialsSlider from "../../components/TestimonialsSlider";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1920&q=85",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1920&q=85",
  "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1920&q=85",
];

const BA_CASES = [
  {
    label: "01 · CEDIR Salud",
    before: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=85",
    after:  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1920&q=85",
    sector:       "Salud · Diagnóstico por imagen",
    intervencion: "Rediseño completo de identidad + sistema digital",
    resultado:    "Reposicionamiento de marca y unificación de 6 unidades clínicas bajo un solo sistema visual.",
  },
  {
    label: "02 · Super Walter",
    before: "https://images.unsplash.com/photo-1604908554007-b1f9c47b88a6?w=1920&q=85",
    after:  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=85",
    sector:       "Maquinaria agrícola · Distribución",
    intervencion: "Refresh de identidad + rediseño web + brandbook",
    resultado:    "Profesionalización de la marca para soportar crecimiento de la red comercial.",
  },
  {
    label: "03 · Ardu Café",
    before: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=85",
    after:  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1920&q=85",
    sector:       "Café · Retail gastronómico",
    intervencion: "Identidad nueva + packaging + carta + uniformes",
    resultado:    "Sistema visual coherente desde el grano al consumidor — cada touchpoint en el mismo lenguaje.",
  },
  {
    label: "04 · Mosaicos Blangino",
    before: "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1920&q=85",
    after:  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=85",
    sector:       "Construcción · Materiales",
    intervencion: "Rediseño de identidad de fábrica con 90 años de historia",
    resultado:    "Modernización sin perder anclaje patrimonial — código visual contemporáneo, esencia conservada.",
  },
];

const DELIVERABLES = [
  {
    letter: "A",
    title: "Identidad de marca",
    desc: "Logo principal y variantes, sistema de marca, manual de uso, paleta cromática extendida y sistema tipográfico jerarquizado para garantizar consistencia.",
  },
  {
    letter: "B",
    title: "Sistema visual",
    desc: "Grilla, criterios de diagramación, biblioteca de iconos, ilustraciones y stock fotográfico curado. Plantillas listas para que el equipo del cliente opere sin perder coherencia.",
  },
  {
    letter: "C",
    title: "Piezas y aplicaciones",
    desc: "Avisos digitales, presentaciones corporativas, papelería, packaging, señalética e indumentaria institucional — todo dentro del mismo sistema.",
  },
  {
    letter: "D",
    title: "Brandbook editorial",
    desc: "Manual de marca con criterios de uso, ejemplos correctos e incorrectos, lineamientos de tono y voz. Documento vivo que escala con la operación.",
  },
];

const PORTFOLIO_ITEMS = [
  { src: "https://images.unsplash.com/photo-1620207418302-439b387441b0?w=900&q=85", tag: "Salud · Diagnóstico", name: "CEDIR" },
  { src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900&q=85", tag: "Maquinaria agrícola",  name: "Super Walter" },
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=900&q=85",   tag: "Café · Retail",       name: "Ardu Café" },
  { src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900&q=85", tag: "Construcción",        name: "Mosaicos Blangino" },
  { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=85", tag: "Estética médica",     name: "Korper" },
  { src: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=900&q=85", tag: "Turismo",             name: "Lozada Viajes" },
];

const TIMELINE = [
  { num: "01", title: "Inmersión",         desc: "Workshop con el equipo del cliente para entender negocio, audiencia, posición competitiva y tono deseado. Sin este paso, el diseño es solo decoración.",                          duration: "Semana 1" },
  { num: "02", title: "Conceptualización", desc: "Definimos el territorio de marca: qué se busca transmitir, qué referentes funcionan, qué territorio se evita. Antes de bocetar, alineamos dirección.",                       duration: "Semanas 2–3" },
  { num: "03", title: "Diseño",            desc: "Iteramos propuestas en rondas acotadas — máximo dos. Trabajamos con criterio profesional, no con votaciones internas. Lo que se presenta, se defiende.",                   duration: "Semanas 4–6" },
  { num: "04", title: "Implementación",    desc: "Bajamos la marca a todas las aplicaciones: digital, print, físico. Entregamos archivos abiertos, tipografías licenciadas y manual completo.",                              duration: "Semanas 7–8" },
];




const STATS = [
  { big: "60",  suffix: "+",  label: "Marcas con identidad\ndesarrollada en 10 años" },
  { big: "14",  suffix: "",   label: "Rediseños completos\nen los últimos 24 meses" },
  { big: "360", suffix: "°",  label: "Sistema aplicable a\ndigital, print y físico" },
  { big: "G",   suffix: "·P", label: "Google Partner\nCertified desde el inicio" },
];

const FAQ_ITEMS = [
  { q: "¿Cuánto dura un proyecto de identidad de marca completo?",        a: "Entre 6 y 8 semanas para un sistema completo desde cero. Un rediseño parcial o refresh puede resolverse en 3–4 semanas. Lo definimos en el primer encuentro según alcance, urgencia y nivel de iteración esperado por parte del cliente." },
  { q: "¿Trabajan con votaciones internas o democratización del diseño?", a: "No. Presentamos máximo dos rutas conceptuales con criterio fundamentado y defendemos lo que proponemos. Las votaciones de equipo amplio suelen llevar al promedio — y el promedio nunca diferencia. Sí trabajamos con quien toma la decisión final, alineando temprano para no frustrar el proceso." },
  { q: "¿Qué incluye el manual de marca que entregan?",                   a: "Logo y variantes, área de respeto, paleta cromática primaria y secundaria, sistema tipográfico jerarquizado, lenguaje fotográfico, sistema de iconos, criterios de aplicación correcta e incorrecta, plantillas para redes sociales, presentaciones y papelería. Documento PDF + archivos abiertos editables." },
  { q: "¿Pueden trabajar con la marca actual sin rediseñarla?",           a: "Sí. Muchas veces la marca está bien y lo que falta es el sistema visual que la rodea: tipografía, paleta, plantillas, lenguaje fotográfico. Auditamos el estado actual y definimos qué intervenir. No todo proyecto requiere logo nuevo." },
  { q: "¿Entregan los archivos editables o solo finales?",                a: "Entregamos todo: archivos abiertos en Adobe Illustrator y Figma, tipografías licenciadas a nombre del cliente, plantillas editables y formatos PNG/JPG/SVG/PDF para uso operativo. La marca queda 100% del cliente." },
  { q: "¿Cuál es el rango de inversión típico para un proyecto?",         a: "Depende del alcance: una identidad completa con manual y aplicaciones primarias arranca desde un piso definido, y proyectos con desarrollo web, packaging y aplicaciones físicas pueden multiplicar varias veces ese piso. En la primera reunión te damos un rango realista — sin compromiso." },
];

export default function Disenio() {
  const sliderRef  = useRef(null);
  const [baTab, setBaTab] = useState(0);
  const dragging   = useRef(false);
  const stageRef   = useRef(null);
  const dividerRef = useRef(null);
  const handleRef  = useRef(null);
  const afterRef   = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const slides  = sliderRef.current?.querySelectorAll(".dn-slider-image");
    const inds    = sliderRef.current?.querySelectorAll(".dn-slider-indicator");
    const counter = document.getElementById("dn-slider-counter");
    if (!slides?.length) return;
    let current = 0;
    function goTo(idx) {
      slides[current].classList.remove("active");
      inds?.[current]?.classList.remove("active");
      current = idx;
      slides[current].classList.add("active");
      if (inds?.[current]) {
        inds[current].classList.remove("active");
        void inds[current].offsetWidth;
        inds[current].classList.add("active");
      }
      if (counter) counter.textContent = `0${current + 1} / 0${slides.length}`;
    }
    slides[0].classList.add("active");
    inds?.[0]?.classList.add("active");
    const timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  function updatePos(clientX) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    if (dividerRef.current) dividerRef.current.style.left = `${pct}%`;
    if (handleRef.current)  handleRef.current.style.left  = `${pct}%`;
    if (afterRef.current)   afterRef.current.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
  }

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) updatePos(e.touches ? e.touches[0].clientX : e.clientX); };
    const onUp   = ()  => { dragging.current = false; };
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

  useEffect(() => {
    if (dividerRef.current) dividerRef.current.style.left = "50%";
    if (handleRef.current)  handleRef.current.style.left  = "50%";
    if (afterRef.current)   afterRef.current.style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
  }, [baTab]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".dn-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="dn-page">

      <nav className="dn-breadcrumb">
        <Link to="/">Trompo</Link>
        <span className="dn-breadcrumb-sep">/</span>
        <Link to="/servicios">Servicios</Link>
        <span className="dn-breadcrumb-sep">/</span>
        <span className="dn-breadcrumb-current">Diseño</span>
      </nav>

      {/* HERO */}
      <section className="dn-hero">
        <div className="dn-hero-slider" ref={sliderRef}>
          {SLIDER_IMAGES.map((src, i) => (
            <div key={i} className="dn-slider-image" style={{ backgroundImage: `url(${src})` }} />
          ))}
          <div className="dn-slider-indicators">
            {SLIDER_IMAGES.map((_, i) => (
              <span key={i} className="dn-slider-indicator" />
            ))}
            <span className="dn-slider-counter" id="dn-slider-counter">01 / 03</span>
          </div>
        </div>

        <div className="dn-hero-eyebrow">
          <span>Servicio · 2026</span>
          <span className="dn-blink">●</span>
          <span>Diseño & Identidad de marca</span>
        </div>

        <h1 className="dn-hero-title">
          <span className="dn-hero-title-line"><span>Diseño que</span></span>
          <span className="dn-hero-title-line"><span>ordena y</span></span>
          <span className="dn-hero-title-line"><span><em>profesionaliza</em></span></span>
          <span className="dn-hero-title-line"><span>la marca.</span></span>
        </h1>

        <div className="dn-hero-bottom">
          <p className="dn-hero-desc">
            <strong>La identidad es el primer activo de credibilidad de toda marca.</strong> Sistemas visuales completos, manuales rigurosos y aplicaciones consistentes desarrollados con metodología profesional — no con improvisación creativa.
          </p>
          <div className="dn-hero-stat">
            <div className="dn-hero-stat-num">60+</div>
            <div className="dn-hero-stat-label">Marcas con identidad construida o renovada por Trompo</div>
          </div>
          <div className="dn-hero-stat">
            <div className="dn-hero-stat-num">360°</div>
            <div className="dn-hero-stat-label">Sistema visual aplicable a digital, print y entornos físicos</div>
          </div>
        </div>
      </section>

      <div className="dn-divider" />

      {/* MANIFESTO */}
      <section className="dn-manifesto">
        <div>
          <div className="dn-manifesto-num dn-reveal">
            01<small>Lo que sostenemos</small>
          </div>
        </div>
        <div className="dn-manifesto-content">
          <h2 className="dn-reveal">
            El diseño no es <span className="dn-strike">decoración.</span><br />
            Es <em>infraestructura</em><br />
            de marca.
          </h2>
          <p className="dn-manifesto-lead dn-reveal">
            Cada elemento visual de una marca es una pequeña promesa de credibilidad. Cuando esos elementos están desordenados, la promesa se vuelve incoherente — aunque el producto o servicio sea impecable. Por eso entendemos al diseño como sistema, no como sucesión de piezas decorativas. Logo, paleta, tipografía, lenguaje fotográfico y plantillas operan juntos para sostener un mismo criterio en cualquier canal.
          </p>
        </div>
      </section>

      <div className="dn-divider" />

      {/* BEFORE / AFTER */}
      <section className="dn-before-after-section">
        <div className="dn-ba-header">
          <div>
            <p className="dn-section-eyebrow dn-reveal">02 · Rediseños</p>
            <h2 className="dn-ba-h dn-reveal">Antes y después.<br />El sistema <em>en acción.</em></h2>
          </div>
          <p className="dn-ba-meta dn-reveal">
            <strong>14</strong>rediseños completos en los últimos 24 meses · arrastrá la barra para comparar
          </p>
        </div>

        <div className="dn-ba-tabs dn-reveal">
          {BA_CASES.map((c, i) => (
            <button key={i} className={`dn-ba-tab${baTab === i ? " active" : ""}`} onClick={() => setBaTab(i)}>
              {c.label}
            </button>
          ))}
        </div>

        <div
          className="dn-ba-stage dn-reveal"
          ref={stageRef}
          onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
          onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
        >
          <div className="dn-ba-pane" style={{ backgroundImage: `url(${BA_CASES[baTab].before})` }} />
          <div className="dn-ba-pane dn-ba-pane-after" ref={afterRef} style={{ backgroundImage: `url(${BA_CASES[baTab].after})` }} />
          <span className="dn-ba-label dn-ba-label-before">Antes</span>
          <span className="dn-ba-label dn-ba-label-after">Después</span>
          <div className="dn-ba-divider" ref={dividerRef} />
          <div className="dn-ba-handle" ref={handleRef}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 3 12 9 6" transform="translate(12,0)" />
            </svg>
          </div>
        </div>

        <div className="dn-ba-info">
          <div className="dn-ba-info-cell"><h4>Sector</h4><p>{BA_CASES[baTab].sector}</p></div>
          <div className="dn-ba-info-cell"><h4>Intervención</h4><p>{BA_CASES[baTab].intervencion}</p></div>
          <div className="dn-ba-info-cell"><h4>Resultado</h4><p>{BA_CASES[baTab].resultado}</p></div>
        </div>
      </section>

      <div className="dn-divider" />

      {/* DELIVERABLES */}
      <section className="dn-deliverables-section">
        <p className="dn-section-eyebrow dn-reveal">03 · Entregables</p>
        <h2 className="dn-deliverables-h dn-reveal">Lo que entregamos<br />en <em>cada proyecto.</em></h2>
        <div className="dn-deliverables-grid">
          {DELIVERABLES.map((d, i) => (
            <div key={i} className="dn-deliverable-cell dn-reveal">
              <div className="dn-deliverable-letter">{d.letter}</div>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="dn-portfolio">
        <div className="dn-portfolio-header">
          <div>
            <p className="dn-section-eyebrow dn-reveal">04 · Portfolio</p>
            <h2 className="dn-portfolio-h dn-reveal">Identidades que ya<br />están <em>en operación.</em></h2>
          </div>
          <div className="dn-portfolio-meta dn-reveal">
            <strong>60+</strong>
            marcas con identidad o sistema visual desarrollado por Trompo en los últimos 10 años de operación.
          </div>
        </div>
        <div className="dn-portfolio-grid">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <a key={i} href="#" className="dn-portfolio-item dn-reveal">
              <img src={item.src} alt={item.name} loading="lazy" />
              <div className="dn-portfolio-item-overlay">
                <div className="dn-portfolio-item-tag">{item.tag}</div>
                <div className="dn-portfolio-item-name">{item.name}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="dn-process">
        <div className="dn-process-inner">
          <p className="dn-section-eyebrow dn-reveal">05 · Cómo trabajamos</p>
          <h2 className="dn-process-h dn-reveal">El proceso<br />de <em>cada proyecto.</em></h2>
          <div className="dn-timeline-list">
            {TIMELINE.map((step, i) => (
              <div key={i} className="dn-timeline-item dn-reveal">
                <div className="dn-timeline-step">{step.num}</div>
                <div className="dn-timeline-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <div className="dn-timeline-duration">{step.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSlider
        eyebrow="06 · Testimonios"
        heading="Lo que dicen las marcas<br />que <em>trabajaron con nosotros.</em>"
      />

      {/* STATS */}
      <section className="dn-stats">
        <div className="dn-stats-eyebrow">Trompo en números</div>
        <div className="dn-stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="dn-stat-cell dn-reveal">
              <div className="dn-stat-big">{s.big}<em>{s.suffix}</em></div>
              <div className="dn-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="dn-faqs">
        <div className="dn-faqs-header">
          <div>
            <p className="dn-section-eyebrow dn-reveal">07 · Preguntas frecuentes</p>
            <h2 className="dn-faqs-h dn-reveal">Preguntas <em>frecuentes</em><br />de clientes nuevos.</h2>
          </div>
          <p className="dn-faqs-meta dn-reveal">Las respuestas que más nos preguntan al inicio de un proyecto de identidad o rediseño. Si tu pregunta no está acá, escribinos.</p>
        </div>
        <div className="dn-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`dn-faq-item${openFaq === i ? " open" : ""}`}>
              <button className="dn-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
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

      {/* CTA + FORM */}
      <section className="cta-section" id="contacto">
        <div className="cta-bg-mega">Diseño</div>
        <div className="cta-wrap">
          <div>
            <div className="cta-eyebrow">Conversemos</div>
            <h2 className="cta-h">
              ¿Necesitás <em>diseño</em><br />para tu marca?
            </h2>
            <p className="reveal">
              Una conversación inicial para revisar el estado actual del sistema visual y definir hipótesis de intervención. Sin propuesta cerrada de antemano. Diagnóstico profesional con recomendación priorizada por impacto.
            </p>
          </div>

          <div className="cta-form-card reveal">
            <h3 className="cta-form-h">Completá el siguiente formulario.</h3>
            <p className="cta-form-sub">Definamos tu próximo paso estratégico.</p>

            <FormIndex location="disenio" />
          </div>
        </div>
      </section>

    </div>
  );
}
