import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/social-media.css";
import "../../assets/styles/cta-section.css";
import FormIndex from "../../components/forms/FormIndex";
import TestimonialsSlider from "../../components/TestimonialsSlider";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920&q=85",
  "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1920&q=85",
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1920&q=85",
];

const BRIEF_OUTPUTS = {
  default: <>Completá el brief para ver tu <em>estrategia inicial</em> sugerida.</>,
  B2C: {
    awareness: <>Tu marca B2C necesita <em>contenido aspiracional</em> en Instagram y TikTok. Narrativa visual con consistencia semanal.</>,
    leads: <>Para generar leads en B2C, combinamos <em>contenido de valor</em> con calls-to-action segmentados por plataforma.</>,
    ventas: <>Estrategia DTC: <em>contenido de producto</em> con social proof en Instagram y TikTok, integrado con funnel de venta.</>,
    comunidad: <>Construir comunidad B2C requiere <em>voz auténtica</em>, respuesta activa y contenido que genere conversación real.</>,
  },
  B2B: {
    awareness: <>Para B2B, LinkedIn es el canal principal. <em>Thought leadership</em> y casos de negocio como eje editorial.</>,
    leads: <>LinkedIn + contenido técnico especializado: <em>artículos, casos y datos</em> que atraen prospectos con intent real.</>,
    ventas: <>Contenido B2B orientado a conversión: <em>casos de éxito, demos y comparativas</em> que acortan el ciclo de venta.</>,
    comunidad: <>Comunidad B2B: <em>grupos de práctica, debates técnicos</em> y narrativa de equipo que construyen autoridad sectorial.</>,
  },
  DTC: {
    awareness: <>DTC en redes: <em>contenido de lifestyle y producto</em> en Instagram y TikTok con consistencia visual alta.</>,
    leads: <>Para DTC, captura leads con <em>contenido de valor + landing pages</em> integradas al calendario social.</>,
    ventas: <>Estrategia DTC de venta directa: <em>reels de producto, UGC y social proof</em> en Instagram y TikTok.</>,
    comunidad: <>Comunidad DTC: <em>usuarios reales, unboxings y testimonios</em> como columna vertebral del contenido.</>,
  },
  Servicios: {
    awareness: <>Para servicios profesionales, LinkedIn + Instagram: <em>casos, metodología y equipo</em> como diferenciadores.</>,
    leads: <>Generación de leads en servicios: <em>contenido educativo y diagnóstico</em> que demuestra expertise y atrae prospectos.</>,
    ventas: <>Servicios: <em>testimonios, procesos y resultados concretos</em> como contenido que convierte antes de la reunión.</>,
    comunidad: <>Comunidad de servicios: <em>networking, recursos y eventos</em> que posicionan la marca como referente del sector.</>,
  },
};

const getBriefOutput = (answers) => {
  const { biz, obj } = answers;
  if (!biz || !obj) return BRIEF_OUTPUTS.default;
  const bizMap = BRIEF_OUTPUTS[biz];
  if (!bizMap) return BRIEF_OUTPUTS.default;
  return bizMap[obj] || BRIEF_OUTPUTS.default;
};

const SocialMedia = () => {
  // Hero slider state
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderTimer = useRef(null);

  useEffect(() => {
    sliderTimer.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(sliderTimer.current);
  }, []);

  const handleIndicatorClick = (index) => {
    setActiveSlide(index);
    clearInterval(sliderTimer.current);
    sliderTimer.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
  };

  const counterText = `0${activeSlide + 1} / 0${SLIDER_IMAGES.length}`;

  // Brief generator state
  const [briefAnswers, setBriefAnswers] = useState({ biz: null, obj: null, plat: null, challenge: null });

  const handleBriefOpt = (key, val) => {
    setBriefAnswers((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));
  };

  const answeredCount = Object.values(briefAnswers).filter(Boolean).length;
  const briefComplete = answeredCount === 4;
  const briefOutput = getBriefOutput(briefAnswers);

  const challengeLabels = {
    contenido: "Producción sostenida",
    estrategia: "Narrativa clara",
    comunidad: "Activación de comunidad",
    resultados: "Redes en negocio",
  };

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sm-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const faqs = [
    {
      q: "¿Cuánto cuesta gestionar las redes con Trompo?",
      a: "Depende del alcance: cantidad de plataformas, volumen de contenido, si incluye producción audiovisual, community management y nivel de reporting. Damos rango realista en la primera reunión — y siempre con un mínimo razonable, porque por debajo de cierto umbral no se puede operar bien.",
    },
    {
      q: "¿Producen el contenido o lo hace el cliente?",
      a: "Producimos in-house: fotografía, video, motion, diseño, copy. El cliente aporta dirección, criterio editorial sobre temas sensibles del negocio y aprueba contenido cuando corresponde. Lo que no hacemos es 'recibir material y subirlo' — eso no es agencia.",
    },
    {
      q: "¿Cuántos posts por mes incluye el servicio?",
      a: "Según el plan: típicamente entre 12 y 30 piezas mensuales por canal entre feed, reels y stories, más community management diario. Para volumen mayor (cuentas grandes o múltiples plataformas) ajustamos el alcance del servicio.",
    },
    {
      q: "¿Hacen community management también, o solo postean?",
      a: "Hacemos community management activo: respuesta a comentarios, DMs, menciones y monitoreo de comunidad. Acordamos SLA por canal: por ejemplo, respuesta a DMs urgentes en horario laboral en menos de 2 horas. Esa parte es clave — postear sin responder es romper la confianza.",
    },
    {
      q: "¿Trabajan con tono de marca propio o tienen un molde?",
      a: "Tono propio. Cada marca tiene su voz y la respetamos. En la fase inicial definimos guía de tono, palabras que sí/no, criterio editorial y referencias. Después esa guía gobierna toda la operación.",
    },
    {
      q: "¿Pueden manejar redes en distintos países o idiomas?",
      a: "Sí. Hemos operado cuentas regionales (Argentina, Uruguay, Chile, México) coordinando lenguaje, calendario y particularidades culturales. Para idiomas adicionales trabajamos con copywriters nativos especializados.",
    },
    {
      q: "¿Qué pasa si necesitamos algo urgente fuera del calendario?",
      a: "Tenemos mecanismo para piezas urgentes y reactivas: se priorizan dentro del scope o se acuerda producción extra si supera el alcance. La operación de redes vive entre planificación y reacción — ambas son parte del trabajo.",
    },
  ];

  return (
    <div className="sm-page">

      {/* HERO */}
      <section className="sm-hero">
        <div className="sm-hero-slider">
          {SLIDER_IMAGES.map((src, i) => (
            <div
              key={i}
              className={`sm-slider-image${activeSlide === i ? " active" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>

        <div className="sm-slider-indicators">
          {SLIDER_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`sm-slider-indicator${activeSlide === i ? " active" : ""}`}
              onClick={() => handleIndicatorClick(i)}
            />
          ))}
          <span className="sm-slider-counter">{counterText}</span>
        </div>

        <div className="sm-hero-eyebrow">
          <span>Servicio · 2026</span>
          <span className="sm-blink">●</span>
          <span>Contenido, comunidad &amp; narrativa</span>
        </div>

        <h1 className="sm-hero-title">
          <span className="sm-hero-title-line"><span>Operación de redes</span></span>
          <span className="sm-hero-title-line"><span>con <em>criterio</em></span></span>
          <span className="sm-hero-title-line"><span>editorial</span></span>
          <span className="sm-hero-title-line"><span>sostenido.</span></span>
        </h1>

        <div className="sm-hero-bottom">
          <p className="sm-hero-desc">
            <strong>Las redes sociales son el canal de relación diaria con la audiencia.</strong> Operamos contenido orgánico, comunidad, narrativa y respuesta para Instagram, LinkedIn, TikTok, YouTube y Facebook — pensadas como sistema de relación a largo plazo, no como calendario de publicaciones.
          </p>
          <div className="sm-hero-stat">
            <div className="sm-hero-stat-num">40+</div>
            <div className="sm-hero-stat-label">Cuentas de marca operadas mensualmente por el equipo</div>
          </div>
          <div className="sm-hero-stat">
            <div className="sm-hero-stat-num">1.5K</div>
            <div className="sm-hero-stat-label">Posts y piezas de contenido producidos cada mes</div>
          </div>
        </div>
      </section>

      <div className="sm-divider" />

      {/* MANIFESTO */}
      <section className="sm-manifesto">
        <div>
          <div className="sm-manifesto-num sm-reveal">
            01<small>Lo que sostenemos</small>
          </div>
        </div>
        <div className="sm-manifesto-content">
          <h2 className="sm-reveal">
            Las redes no son <span className="sm-strike">posteos.</span><br />
            Son una <em>conversación</em><br />
            diaria con la audiencia.
          </h2>
          <p className="sm-manifesto-lead sm-reveal">
            Hay marcas que publican todos los días pero no construyen comunidad. Y hay marcas que publican menos pero generan vínculo sostenido. La diferencia no está en la frecuencia — está en el criterio editorial. Operamos las redes como sistema de relación: contenido que aporta, narrativa que sostiene la marca, respuesta que construye confianza. La métrica que importa no es cuántas veces se publicó — es cuántas personas siguen conectadas después de un año.
          </p>
        </div>
      </section>

      <div className="sm-divider" />

      {/* BRIEF GENERATOR */}
      <section className="sm-brief-section">
        <div className="sm-brief-header">
          <div>
            <div className="sm-section-eyebrow sm-reveal">02 · Generá tu brief</div>
            <h2 className="sm-brief-h sm-reveal">
              Definí tu estrategia<br />
              de redes <em>en 4 pasos.</em>
            </h2>
          </div>
          <p className="sm-brief-meta sm-reveal">
            <strong>2 min</strong>
            brief inicial autogenerado · te lo enviamos por email para que lo lleves a la primera reunión
          </p>
        </div>

        <div className="sm-brief-tool sm-reveal">
          <div className="sm-brief-input">
            <h3 className="sm-brief-input-h">Brief generator</h3>
            <p className="sm-brief-input-sub">
              Respondé las 4 preguntas para tener un brief inicial de tu estrategia de redes — sin compromiso, sin formularios largos.
            </p>

            <div className="sm-brief-q-block">
              <div className="sm-brief-q">01 · Tu negocio es principalmente</div>
              <div className="sm-brief-options">
                {[
                  { val: "B2C", label: "B2C / consumo masivo" },
                  { val: "B2B", label: "B2B / industria" },
                  { val: "DTC", label: "DTC / e-commerce" },
                  { val: "Servicios", label: "Servicios profesionales" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    className={`sm-brief-opt${briefAnswers.biz === val ? " selected" : ""}`}
                    onClick={() => handleBriefOpt("biz", val)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm-brief-q-block">
              <div className="sm-brief-q">02 · Objetivo principal en redes</div>
              <div className="sm-brief-options">
                {[
                  { val: "awareness", label: "Awareness de marca" },
                  { val: "leads", label: "Generar leads" },
                  { val: "ventas", label: "Vender directo" },
                  { val: "comunidad", label: "Construir comunidad" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    className={`sm-brief-opt${briefAnswers.obj === val ? " selected" : ""}`}
                    onClick={() => handleBriefOpt("obj", val)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm-brief-q-block">
              <div className="sm-brief-q">03 · Plataformas prioritarias</div>
              <div className="sm-brief-options">
                {[
                  { val: "IG", label: "Instagram" },
                  { val: "LinkedIn", label: "LinkedIn" },
                  { val: "TikTok", label: "TikTok" },
                  { val: "YouTube", label: "YouTube" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    className={`sm-brief-opt${briefAnswers.plat === val ? " selected" : ""}`}
                    onClick={() => handleBriefOpt("plat", val)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm-brief-q-block">
              <div className="sm-brief-q">04 · Cuál es tu desafío hoy</div>
              <div className="sm-brief-options">
                {[
                  { val: "contenido", label: "Producir contenido sostenido" },
                  { val: "estrategia", label: "Definir narrativa clara" },
                  { val: "comunidad", label: "Activar comunidad" },
                  { val: "resultados", label: "Traducir redes en negocio" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    className={`sm-brief-opt${briefAnswers.challenge === val ? " selected" : ""}`}
                    onClick={() => handleBriefOpt("challenge", val)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm-brief-progress">
              Respuestas: <strong>{answeredCount}</strong> / 4
            </div>
          </div>

          <div className="sm-brief-result">
            <div className="sm-brief-result-h">Brief inicial · Trompo Agencia</div>
            <div className="sm-brief-output">{briefOutput}</div>

            {briefComplete && (
              <div className="sm-brief-summary">
                <div className="sm-brief-sum-cell">
                  <div className="sm-brief-sum-label">Tipo de negocio</div>
                  <div className="sm-brief-sum-value">{briefAnswers.biz}</div>
                </div>
                <div className="sm-brief-sum-cell">
                  <div className="sm-brief-sum-label">Objetivo</div>
                  <div className="sm-brief-sum-value accent">{briefAnswers.obj}</div>
                </div>
                <div className="sm-brief-sum-cell">
                  <div className="sm-brief-sum-label">Plataforma core</div>
                  <div className="sm-brief-sum-value">{briefAnswers.plat}</div>
                </div>
                <div className="sm-brief-sum-cell">
                  <div className="sm-brief-sum-label">Foco operativo</div>
                  <div className="sm-brief-sum-value accent">
                    {challengeLabels[briefAnswers.challenge] || briefAnswers.challenge}
                  </div>
                </div>
              </div>
            )}

            <Link to="/contactanos" className="sm-brief-cta">
              Pedir reunión con este brief →
            </Link>
          </div>
        </div>
      </section>

      <div className="sm-divider" />

      {/* PLATFORMS */}
      <section className="sm-platforms">
        <h2 className="sm-platforms-h sm-reveal">
          Operamos los canales<br />
          donde <em>tu marca tiene que estar.</em>
        </h2>
        <p className="sm-platforms-sub sm-reveal">
          No todos los canales sirven para toda marca. Definimos mix con criterio según vertical, audiencia y objetivo.
        </p>
        <div className="sm-platforms-grid">
          <div className="sm-platform-cell sm-reveal">
            <svg className="sm-platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            <div className="sm-platform-name">Instagram</div>
            <div className="sm-platform-desc">Feed, reels, stories, lives. La columna vertebral de marcas B2C y lifestyle.</div>
          </div>
          <div className="sm-platform-cell sm-reveal">
            <svg className="sm-platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <div className="sm-platform-name">LinkedIn</div>
            <div className="sm-platform-desc">Posicionamiento ejecutivo, B2B y employer branding. Mayor intent profesional.</div>
          </div>
          <div className="sm-platform-cell sm-reveal">
            <svg className="sm-platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
            <div className="sm-platform-name">TikTok</div>
            <div className="sm-platform-desc">Contenido nativo vertical, alcance orgánico. Esencial en marcas jóvenes y DTC.</div>
          </div>
          <div className="sm-platform-cell sm-reveal">
            <svg className="sm-platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
            </svg>
            <div className="sm-platform-name">YouTube</div>
            <div className="sm-platform-desc">Video largo, shorts, playlists temáticas. Construcción de autoridad de marca.</div>
          </div>
          <div className="sm-platform-cell sm-reveal">
            <svg className="sm-platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <div className="sm-platform-name">Facebook</div>
            <div className="sm-platform-desc">Comunidad madura, eventos, marketplace. Aún válido en verticales específicas.</div>
          </div>
        </div>
      </section>

      <div className="sm-divider" />

      {/* DELIVERABLES */}
      <section className="sm-deliverables-section">
        <p className="sm-section-eyebrow sm-reveal">03 · Entregables</p>
        <h2 className="sm-deliverables-h sm-reveal">
          Lo que operamos<br />
          en <em>cada cuenta.</em>
        </h2>
        <div className="sm-deliverables-grid">
          <div className="sm-deliverable-cell sm-reveal">
            <div className="sm-deliverable-letter">A</div>
            <h3>Estrategia de contenido</h3>
            <p>Pilares de contenido, calendario editorial, tono de voz, formato y plan de narrativa por trimestre. Sin estrategia, las redes son un calendario sin propósito.</p>
          </div>
          <div className="sm-deliverable-cell sm-reveal">
            <div className="sm-deliverable-letter">B</div>
            <h3>Producción de contenido</h3>
            <p>Piezas de feed, reels, stories, carruseles, copy y formatos nativos de cada plataforma. Producción in-house con calendario sostenido y volumen real.</p>
          </div>
          <div className="sm-deliverable-cell sm-reveal">
            <div className="sm-deliverable-letter">C</div>
            <h3>Community management</h3>
            <p>Respuesta a comentarios, mensajes directos, menciones y comunidad. Gestión profesional con criterio editorial, escalación de temas sensibles y SLA acordado por canal.</p>
          </div>
          <div className="sm-deliverable-cell sm-reveal">
            <div className="sm-deliverable-letter">D</div>
            <h3>Reporting &amp; dirección</h3>
            <p>Análisis mensual, lectura de comportamiento de la audiencia, ajustes de estrategia y reporte ejecutivo. Las redes se dirigen — no se delegan al pasar.</p>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="sm-portfolio">
        <div className="sm-portfolio-header">
          <div>
            <p className="sm-section-eyebrow sm-reveal">04 · Cuentas en operación</p>
            <h2 className="sm-portfolio-h sm-reveal">
              Marcas que operamos<br />
              <em>todos los días.</em>
            </h2>
          </div>
          <div className="sm-portfolio-meta sm-reveal">
            <strong>40+</strong>
            cuentas en operación mensual continua, con producción y community management completo.
          </div>
        </div>
        <div className="sm-portfolio-grid">
          <a href="#" className="sm-portfolio-item sm-reveal">
            <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?w=900&q=85" alt="" loading="lazy" />
            <div className="sm-portfolio-item-overlay">
              <div className="sm-portfolio-item-tag">Instagram · Café</div>
              <div className="sm-portfolio-item-name">Ardu Café</div>
            </div>
          </a>
          <a href="#" className="sm-portfolio-item sm-reveal">
            <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=900&q=85" alt="" loading="lazy" />
            <div className="sm-portfolio-item-overlay">
              <div className="sm-portfolio-item-tag">LinkedIn · B2B Industrial</div>
              <div className="sm-portfolio-item-name">Denso Argentina</div>
            </div>
          </a>
          <a href="#" className="sm-portfolio-item sm-reveal">
            <img src="https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=900&q=85" alt="" loading="lazy" />
            <div className="sm-portfolio-item-overlay">
              <div className="sm-portfolio-item-tag">Multi-canal · Salud</div>
              <div className="sm-portfolio-item-name">CEDIR Salud</div>
            </div>
          </a>
          <a href="#" className="sm-portfolio-item sm-reveal">
            <img src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=900&q=85" alt="" loading="lazy" />
            <div className="sm-portfolio-item-overlay">
              <div className="sm-portfolio-item-tag">TikTok · Indumentaria</div>
              <div className="sm-portfolio-item-name">AF Jeans</div>
            </div>
          </a>
          <a href="#" className="sm-portfolio-item sm-reveal">
            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=85" alt="" loading="lazy" />
            <div className="sm-portfolio-item-overlay">
              <div className="sm-portfolio-item-tag">Instagram · Estética</div>
              <div className="sm-portfolio-item-name">Korper</div>
            </div>
          </a>
          <a href="#" className="sm-portfolio-item sm-reveal">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=85" alt="" loading="lazy" />
            <div className="sm-portfolio-item-overlay">
              <div className="sm-portfolio-item-tag">YouTube + IG · Turismo</div>
              <div className="sm-portfolio-item-name">Lozada Viajes</div>
            </div>
          </a>
        </div>
      </section>

      {/* PROCESS / TIMELINE */}
      <section className="sm-process">
        <div className="sm-process-inner">
          <p className="sm-section-eyebrow sm-reveal">05 · Cómo trabajamos</p>
          <h2 className="sm-process-h sm-reveal">
            El proceso<br />
            de <em>cada cuenta.</em>
          </h2>
          <div className="sm-timeline-list">
            <div className="sm-timeline-item sm-reveal">
              <div className="sm-timeline-step">01</div>
              <div className="sm-timeline-content">
                <h3>Auditoría y estrategia</h3>
                <p>Mapeamos cuentas actuales, competencia, audiencia y posicionamiento. Definimos pilares, narrativa, tono y calendario editorial alineado al negocio.</p>
              </div>
              <div className="sm-timeline-duration">Mes 1</div>
            </div>
            <div className="sm-timeline-item sm-reveal">
              <div className="sm-timeline-step">02</div>
              <div className="sm-timeline-content">
                <h3>Producción mensual</h3>
                <p>Sesión de fotos, video y diseño de contenido para todo el mes en una jornada de producción. Eficiencia operativa sin sacrificar coherencia visual.</p>
              </div>
              <div className="sm-timeline-duration">Mes 1 →</div>
            </div>
            <div className="sm-timeline-item sm-reveal">
              <div className="sm-timeline-step">03</div>
              <div className="sm-timeline-content">
                <h3>Operación diaria</h3>
                <p>Publicación, programación, community management, respuesta a comentarios y monitoreo de comunidad. Operación profesional, no automatización ciega.</p>
              </div>
              <div className="sm-timeline-duration">Continuo</div>
            </div>
            <div className="sm-timeline-item sm-reveal">
              <div className="sm-timeline-step">04</div>
              <div className="sm-timeline-content">
                <h3>Reporting y ajuste</h3>
                <p>Reporte mensual con lectura de comportamiento, propuestas de ajuste y plan trimestral revisado. Las redes evolucionan — y la estrategia también.</p>
              </div>
              <div className="sm-timeline-duration">Mensual</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSlider
        eyebrow="06 · Testimonios"
        heading="Lo que dicen las marcas<br />que <em>delegan sus redes.</em>"
      />

      {/* STATS BAND */}
      <section className="sm-stats">
        <div className="sm-stats-eyebrow">Trompo en números</div>
        <div className="sm-stats-grid">
          <div className="sm-stat-cell sm-reveal">
            <div className="sm-stat-big">40<em>+</em></div>
            <div className="sm-stat-label">Cuentas activas con<br />operación mensual</div>
          </div>
          <div className="sm-stat-cell sm-reveal">
            <div className="sm-stat-big">1.5K</div>
            <div className="sm-stat-label">Piezas producidas<br />cada mes en cartera</div>
          </div>
          <div className="sm-stat-cell sm-reveal">
            <div className="sm-stat-big">12K<em>+</em></div>
            <div className="sm-stat-label">Mensajes y comentarios<br />gestionados al mes</div>
          </div>
          <div className="sm-stat-cell sm-reveal">
            <div className="sm-stat-big">5</div>
            <div className="sm-stat-label">Plataformas operadas<br />en simultáneo por cliente</div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="sm-faqs">
        <div className="sm-faqs-header">
          <div>
            <p className="sm-section-eyebrow sm-reveal">07 · Preguntas frecuentes</p>
            <h2 className="sm-faqs-h sm-reveal">
              Preguntas <em>antes</em><br />
              de delegar tus redes.
            </h2>
          </div>
          <p className="sm-faqs-meta sm-reveal">
            Las dudas más frecuentes de marcas que vienen operando redes internamente o con freelancers y evalúan profesionalizar la operación con una agencia.
          </p>
        </div>
        <div className="sm-faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`sm-faq-item${openFaq === index ? " open" : ""}`}>
              <button className="sm-faq-q" onClick={() => toggleFaq(index)} type="button">
                <span>{faq.q}</span>
                <span className="sm-faq-q-icon" />
              </button>
              <div className="sm-faq-a">
                <div className="sm-faq-a-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section className="sm-other-services">
        <p className="sm-section-eyebrow sm-reveal">Sistema integrado</p>
        <h2 className="sm-other-services-h sm-reveal">
          Conocé los otros<br />
          servicios <em>del sistema.</em>
        </h2>
        <div className="sm-services-grid">
          <Link to="/servicios/diseno" className="sm-service-card">
            <div className="sm-service-card-num">01 / Diseño</div>
            <h4>Diseño</h4>
            <p>Identidad y sistema visual.</p>
            <span className="sm-service-card-arrow">→</span>
          </Link>
          <Link to="/servicios/multimedia" className="sm-service-card">
            <div className="sm-service-card-num">02 / Multimedia</div>
            <h4>Multimedia</h4>
            <p>Audiovisual, motion y producción.</p>
            <span className="sm-service-card-arrow">→</span>
          </Link>
          <Link to="/servicios/desarrollo" className="sm-service-card">
            <div className="sm-service-card-num">03 / Desarrollo Web</div>
            <h4>Desarrollo Web</h4>
            <p>Sitios y plataformas que escalan.</p>
            <span className="sm-service-card-arrow">→</span>
          </Link>
          <Link to="/servicios/paid-media" className="sm-service-card">
            <div className="sm-service-card-num">04 / Paid Media</div>
            <h4>Paid Media</h4>
            <p>Inversión publicitaria con ROI.</p>
            <span className="sm-service-card-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* CTA + FORM */}
      <section className="cta-section" id="contacto">
        <div className="cta-bg-mega">Social</div>
        <div className="cta-wrap">
          <div>
            <div className="cta-eyebrow">Conversemos</div>
            <h2 className="cta-h">
              ¿Tus redes <em>no construyen marca</em><br />como deberían?
            </h2>
            <p className="reveal">
              Auditoría de cuentas actuales: estrategia, contenido, comunidad y resultados. Diagnóstico profesional con recomendación priorizada por impacto — sin propuesta cerrada de antemano.
            </p>
          </div>

          <div className="cta-form-card reveal">
            <h3 className="cta-form-h">Completá el siguiente formulario.</h3>
            <p className="cta-form-sub">Definamos tu próximo paso estratégico.</p>

            <FormIndex location="social-media" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default SocialMedia;
