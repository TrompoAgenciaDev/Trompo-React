import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/paid-media.css";
import "../../assets/styles/cta-section.css";
import FormIndex from "../../components/forms/FormIndex";
import TestimonialsSlider from "../../components/TestimonialsSlider";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=85",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1920&q=85",
];

const CHANNEL_BENCHMARKS = {
  google: { cpl: 12000, qual: 1.0 },
  meta: { cpl: 6000, qual: 0.7 },
  linkedin: { cpl: 35000, qual: 1.4 },
};

function fmtARS(n) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

const PaidMedia = () => {
  // --- Hero slider state ---
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimerRef = useRef(null);

  const goToSlide = (i) => {
    setSlideIndex(i);
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
  };

  useEffect(() => {
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(slideTimerRef.current);
  }, []);

  // --- ROI Calculator state ---
  const [roiChannel, setRoiChannel] = useState("google");
  const [roiBudget, setRoiBudget] = useState(800000);
  const [roiTicket, setRoiTicket] = useState(150000);
  const [roiClose, setRoiClose] = useState(15);

  const ch = CHANNEL_BENCHMARKS[roiChannel];
  const roiLeads = Math.max(1, Math.round(roiBudget / ch.cpl));
  const roiCpl = roiBudget / roiLeads;
  const roiSales = Math.max(0, Math.round(roiLeads * (roiClose / 100) * ch.qual));
  const roiRevenue = roiSales * roiTicket;
  const roiRatio = roiRevenue / roiBudget;

  // --- FAQ accordion state ---
  const [openFaq, setOpenFaq] = useState(-1);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? -1 : i);

  // --- Reveal via IntersectionObserver ---
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".pm-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const padNum = (n) => String(n + 1).padStart(2, "0");
  const total = SLIDER_IMAGES.length;

  const faqs = [
    {
      q: "¿Cuánto tengo que invertir mínimo en pauta?",
      a: "Depende del canal y la vertical. Para hacer experimentos serios en Google Ads B2C arrancás desde un mínimo razonable. En LinkedIn B2B el piso es más alto por costo por click. Lo que no recomendamos: invertir tan poco que no podamos sacar conclusiones — es tirar plata.",
    },
    {
      q: "¿Cobran fee fijo, comisión sobre inversión o variable?",
      a: "Trabajamos con fee mensual fijo según complejidad de cuenta y volumen de inversión. No cobramos comisión sobre pauta — eso desalinea incentivos: la agencia gana cuando vos invertís más, aunque no convenga. Preferimos modelo plano transparente.",
    },
    {
      q: "¿Tengo que firmar permanencia mínima?",
      a: "Sí — 6 meses la primera vez. Es el tiempo razonable para auditar, optimizar, experimentar y empezar a ver resultados sostenidos. Luego renovamos mes a mes. Si en 6 meses no agregamos valor, es lógico no continuar.",
    },
    {
      q: "¿La cuenta de Google/Meta queda a mi nombre?",
      a: "Siempre. Las cuentas son del cliente. Trompo ingresa como administrador. Si en algún momento se decide cortar la relación, vos te quedás con la cuenta, el histórico, los públicos y los aprendizajes — no hay lock-in.",
    },
    {
      q: "¿Hacen creativo de las campañas o solo gestión de pauta?",
      a: "Hacemos las dos cosas. Producimos creatividades nativas para cada canal (no adaptaciones de un mismo material) y testeamos sistemáticamente. Una campaña con buen targeting pero mal creativo es plata tirada — y al revés también.",
    },
    {
      q: "¿Reportan mensualmente? ¿Qué tipo de reporte?",
      a: "Reporte ejecutivo mensual con lectura accionable: qué funcionó, qué no, qué se ajusta el mes que viene. Más un dashboard en Looker Studio en vivo, accesible 24/7. La empresa que solo reporta números agregados sin lectura no agrega valor.",
    },
    {
      q: "¿Trabajan con cuentas chicas o solo con presupuestos grandes?",
      a: "Trabajamos con cuentas serias, no necesariamente grandes. Una empresa con $400.000/mes de pauta bien gestionada puede ser un cliente excelente. Lo que evitamos son cuentas con presupuesto tan bajo que el fee de agencia no se justifica para ninguna de las partes.",
    },
  ];

  return (
    <div className="pm-page">

      {/* HERO */}
      <section className="pm-hero">
        <div className="pm-hero-slider">
          {SLIDER_IMAGES.map((src, i) => (
            <div
              key={i}
              className={`pm-slider-image${slideIndex === i ? " active" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>

        <div className="pm-slider-indicators">
          {SLIDER_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`pm-slider-indicator${slideIndex === i ? " active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
          <span className="pm-slider-counter">
            {padNum(slideIndex)} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="pm-hero-eyebrow">
          <span>Servicio · 2026</span>
          <span className="pm-blink">●</span>
          <span>Google · Meta · LinkedIn · TikTok</span>
        </div>

        <h1 className="pm-hero-title">
          <span className="pm-hero-title-line"><span>Inversión</span></span>
          <span className="pm-hero-title-line"><span>publicitaria con</span></span>
          <span className="pm-hero-title-line"><span><em>retorno</em></span></span>
          <span className="pm-hero-title-line"><span>verificable.</span></span>
        </h1>

        <div className="pm-hero-bottom">
          <p className="pm-hero-desc">
            <strong>Cada peso de inversión publicitaria debe justificarse en términos de retorno.</strong>{" "}
            Operamos campañas en Google Ads, Meta, LinkedIn, TikTok y display con foco en métricas
            conectadas al negocio: leads calificados, ventas reales, retorno medible — no en métricas
            decorativas.
          </p>
          <div className="pm-hero-stat">
            <div className="pm-hero-stat-num">$1B<em>+</em></div>
            <div className="pm-hero-stat-label">Inversión publicitaria gestionada en cuentas de clientes</div>
          </div>
          <div className="pm-hero-stat">
            <div className="pm-hero-stat-num">G·P</div>
            <div className="pm-hero-stat-label">Google Partner Premier desde el inicio del programa en Argentina</div>
          </div>
        </div>
      </section>

      <div className="pm-divider" />

      {/* MANIFESTO */}
      <section className="pm-manifesto">
        <div>
          <div className="pm-manifesto-num pm-reveal">
            01<small>Lo que sostenemos</small>
          </div>
        </div>
        <div className="pm-manifesto-content">
          <h2 className="pm-reveal">
            No medimos <span className="pm-strike">impresiones.</span><br />
            Medimos <em>retorno</em><br />
            sobre inversión real.
          </h2>
          <p className="pm-manifesto-lead pm-reveal">
            Una campaña con muchas impresiones y bajo costo por clic puede ser un fracaso comercial si no
            genera leads calificados. Una campaña con CPL alto puede ser excelente si esos leads cierran.
            Por eso medimos lo que importa: retorno sobre inversión publicitaria, costo por venta y valor
            del cliente en el tiempo. Las métricas que no se conectan con resultados de negocio carecen
            de utilidad operativa.
          </p>
        </div>
      </section>

      <div className="pm-divider" />

      {/* ROI CALCULATOR */}
      <section className="pm-roi-section">
        <div className="pm-roi-header">
          <div>
            <div className="pm-section-eyebrow pm-reveal">02 · Calculá tu ROI</div>
            <h2 className="pm-roi-h pm-reveal">
              ¿Cuánto puede<br />devolverte <em>tu inversión?</em>
            </h2>
          </div>
          <p className="pm-roi-meta pm-reveal">
            <strong>3 min</strong>
            simulación realista basada en benchmarks de la cartera de Trompo en cada vertical
          </p>
        </div>

        <div className="pm-roi-tool pm-reveal">
          <div className="pm-roi-input">
            <h3 className="pm-roi-input-h">Calculadora de ROI estimado</h3>
            <p className="pm-roi-input-sub">
              Movés los sliders y ves cómo cambia el retorno proyectado según canal y vertical. Modelo
              simplificado — no reemplaza una propuesta real.
            </p>

            <div className="pm-roi-field">
              <div className="pm-roi-label">
                <span>01 · Canal principal</span>
              </div>
              <div className="pm-roi-channel-tabs">
                {["google", "meta", "linkedin"].map((ch) => (
                  <button
                    key={ch}
                    className={`pm-roi-channel-btn${roiChannel === ch ? " active" : ""}`}
                    onClick={() => setRoiChannel(ch)}
                  >
                    {ch.charAt(0).toUpperCase() + ch.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pm-roi-field">
              <div className="pm-roi-label">
                <span>02 · Inversión mensual (ARS)</span>
                <span className="pm-roi-label-value">{fmtARS(roiBudget)}</span>
              </div>
              <div className="pm-roi-slider-wrap">
                <input
                  type="range"
                  className="pm-roi-slider"
                  min="200000"
                  max="5000000"
                  step="100000"
                  value={roiBudget}
                  onChange={(e) => setRoiBudget(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pm-roi-field">
              <div className="pm-roi-label">
                <span>03 · Ticket promedio (ARS)</span>
                <span className="pm-roi-label-value">{fmtARS(roiTicket)}</span>
              </div>
              <div className="pm-roi-slider-wrap">
                <input
                  type="range"
                  className="pm-roi-slider"
                  min="20000"
                  max="2000000"
                  step="10000"
                  value={roiTicket}
                  onChange={(e) => setRoiTicket(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pm-roi-field">
              <div className="pm-roi-label">
                <span>04 · Tasa de cierre comercial</span>
                <span className="pm-roi-label-value">{roiClose}%</span>
              </div>
              <div className="pm-roi-slider-wrap">
                <input
                  type="range"
                  className="pm-roi-slider"
                  min="3"
                  max="50"
                  step="1"
                  value={roiClose}
                  onChange={(e) => setRoiClose(Number(e.target.value))}
                />
              </div>
            </div>

            <p className="pm-roi-disclaimer">
              Cálculo orientativo basado en benchmarks promedio. Resultados reales dependen de calidad
              creativa, landing, oferta, mercado y operación comercial.
            </p>
          </div>

          <div className="pm-roi-result">
            <div className="pm-roi-result-h">Proyección estimada · 30 días</div>
            <h3 className="pm-roi-headline">
              ROI estimado: <em>{roiRatio.toFixed(1)}x</em>
            </h3>
            <p className="pm-roi-headline-sub">
              Retorno proyectado sobre la inversión publicitaria en el canal seleccionado.
            </p>

            <div className="pm-roi-metrics">
              <div className="pm-roi-metric">
                <div className="pm-roi-metric-label">Leads estimados</div>
                <div className="pm-roi-metric-value">{roiLeads.toLocaleString("es-AR")}</div>
              </div>
              <div className="pm-roi-metric">
                <div className="pm-roi-metric-label">Costo por lead</div>
                <div className="pm-roi-metric-value">{fmtARS(roiCpl)}</div>
              </div>
              <div className="pm-roi-metric">
                <div className="pm-roi-metric-label">Ventas proyectadas</div>
                <div className="pm-roi-metric-value gold">{roiSales.toLocaleString("es-AR")}</div>
              </div>
              <div className="pm-roi-metric">
                <div className="pm-roi-metric-label">Facturación generada</div>
                <div className="pm-roi-metric-value green">{fmtARS(roiRevenue)}</div>
              </div>
            </div>

            <p className="pm-roi-note">
              Este es un escenario base. En una propuesta real ajustamos el modelo a tu vertical,
              histórico de cuenta y mix de canales — el resultado puede ser muy distinto, en general mejor.
            </p>

            <Link to="/contactanos" className="pm-roi-cta">
              Pedir propuesta real →
            </Link>
          </div>
        </div>
      </section>

      <div className="pm-divider" />

      {/* BENCHMARKS */}
      <section className="pm-benchmarks">
        <h2 className="pm-benchmarks-h pm-reveal">
          Benchmarks promedio<br /><em>de la cartera Trompo</em>
        </h2>
        <p className="pm-benchmarks-sub pm-reveal">
          Métricas reales de cuentas activas de la agencia en los últimos 12 meses, agregadas y
          promediadas. Útiles como referencia, no como promesa.
        </p>
        <div className="pm-benchmark-grid pm-reveal">
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">Google Search</div>
            <div className="pm-benchmark-num">3.8<em>x</em></div>
            <div className="pm-benchmark-label">ROAS promedio<br />en cuentas B2C</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">Performance Max</div>
            <div className="pm-benchmark-num">4.2<em>x</em></div>
            <div className="pm-benchmark-label">ROAS promedio<br />en e-commerce</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">Meta Ads</div>
            <div className="pm-benchmark-num">2.6<em>x</em></div>
            <div className="pm-benchmark-label">ROAS promedio<br />en consumo masivo</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">LinkedIn Ads</div>
            <div className="pm-benchmark-num">12<em>x</em></div>
            <div className="pm-benchmark-label">ROI proyectado<br />cuentas B2B (ciclo largo)</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">Search B2B</div>
            <div className="pm-benchmark-num">$ 8K</div>
            <div className="pm-benchmark-label">CPL promedio<br />vertical industrial</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">Search B2C</div>
            <div className="pm-benchmark-num">$ 2K</div>
            <div className="pm-benchmark-label">CPL promedio<br />vertical consumo</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">Meta Lead Gen</div>
            <div className="pm-benchmark-num">$ 1.2K</div>
            <div className="pm-benchmark-label">CPL promedio<br />servicios profesionales</div>
          </div>
          <div className="pm-benchmark-cell">
            <div className="pm-benchmark-channel">YouTube Ads</div>
            <div className="pm-benchmark-num">68%</div>
            <div className="pm-benchmark-label">Lift de marca<br />en estudios pre/post</div>
          </div>
        </div>
      </section>

      <div className="pm-divider" />

      {/* DELIVERABLES */}
      <section className="pm-deliverables-section">
        <div className="pm-section-eyebrow pm-reveal">03 · Entregables</div>
        <h2 className="pm-deliverables-h pm-reveal">
          Lo que gestionamos<br />en <em>cada cuenta.</em>
        </h2>
        <div className="pm-deliverables-grid">
          <div className="pm-deliverable-cell pm-reveal">
            <div className="pm-deliverable-letter">A</div>
            <h3>Google Ads completo</h3>
            <p>
              Search, Performance Max, Display, Demand Gen, YouTube y Shopping. Configuración técnica,
              optimización continua y experimentación sistemática.
            </p>
          </div>
          <div className="pm-deliverable-cell pm-reveal">
            <div className="pm-deliverable-letter">B</div>
            <h3>Meta Ads</h3>
            <p>
              Campañas de awareness, consideración y conversión. Públicos personalizados, lookalikes,
              retargeting avanzado y optimización creativa basada en lectura del feed.
            </p>
          </div>
          <div className="pm-deliverable-cell pm-reveal">
            <div className="pm-deliverable-letter">C</div>
            <h3>LinkedIn Ads B2B</h3>
            <p>
              Campañas para ciclos de venta complejos: lead gen, ABM, awareness ejecutivo y nurturing por
              segmentos. La plataforma con mayor intent B2B.
            </p>
          </div>
          <div className="pm-deliverable-cell pm-reveal">
            <div className="pm-deliverable-letter">D</div>
            <h3>Reporting &amp; analítica</h3>
            <p>
              GA4, Looker Studio, atribución multi-canal y dashboards adaptados a dirección y comercial.
              Lectura del dato traducida a decisiones — no a archivos.
            </p>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="pm-portfolio">
        <div className="pm-portfolio-header">
          <div>
            <div className="pm-section-eyebrow pm-reveal">04 · Casos</div>
            <h2 className="pm-portfolio-h pm-reveal">
              Cuentas activas que<br /><em>devuelven negocio</em> mes a mes.
            </h2>
          </div>
          <div className="pm-portfolio-meta pm-reveal">
            <strong>40+</strong>
            cuentas con operación semanal · revisión, optimización y reporting mensual continuo.
          </div>
        </div>
        <div className="pm-portfolio-grid">
          <a href="#" className="pm-portfolio-item pm-reveal">
            <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=85" alt="CEDIR Salud" />
            <div className="pm-portfolio-item-overlay">
              <div className="pm-portfolio-item-tag">Google Ads · Salud</div>
              <div className="pm-portfolio-item-name">CEDIR · 4.1x ROAS</div>
            </div>
          </a>
          <a href="#" className="pm-portfolio-item pm-reveal">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=85" alt="AF Jeans" />
            <div className="pm-portfolio-item-overlay">
              <div className="pm-portfolio-item-tag">Meta Ads · E-commerce</div>
              <div className="pm-portfolio-item-name">AF Jeans · 3.8x ROAS</div>
            </div>
          </a>
          <a href="#" className="pm-portfolio-item pm-reveal">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=85" alt="Denso" />
            <div className="pm-portfolio-item-overlay">
              <div className="pm-portfolio-item-tag">LinkedIn · B2B</div>
              <div className="pm-portfolio-item-name">Denso · CPL -42%</div>
            </div>
          </a>
          <a href="#" className="pm-portfolio-item pm-reveal">
            <img src="https://images.unsplash.com/photo-1565024144961-d3acebbe85c1?w=900&q=85" alt="Volvo" />
            <div className="pm-portfolio-item-overlay">
              <div className="pm-portfolio-item-tag">Performance Max · Auto</div>
              <div className="pm-portfolio-item-name">Volvo · 5.2x ROAS</div>
            </div>
          </a>
          <a href="#" className="pm-portfolio-item pm-reveal">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=85" alt="Lozada Viajes" />
            <div className="pm-portfolio-item-overlay">
              <div className="pm-portfolio-item-tag">Multi-canal · Turismo</div>
              <div className="pm-portfolio-item-name">Lozada Viajes · 6.8x</div>
            </div>
          </a>
          <a href="#" className="pm-portfolio-item pm-reveal">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=85" alt="CAMI" />
            <div className="pm-portfolio-item-overlay">
              <div className="pm-portfolio-item-tag">Lead Gen · Salud</div>
              <div className="pm-portfolio-item-name">CAMI · CPL -38%</div>
            </div>
          </a>
        </div>
      </section>

      {/* PROCESS */}
      <section className="pm-process">
        <div className="pm-process-inner">
          <div className="pm-section-eyebrow pm-reveal">05 · Cómo trabajamos</div>
          <h2 className="pm-process-h pm-reveal">
            El proceso<br />de <em>cada cuenta.</em>
          </h2>
          <div className="pm-timeline-list">
            <div className="pm-timeline-item pm-reveal">
              <div className="pm-timeline-step">01</div>
              <div className="pm-timeline-content">
                <h3>Auditoría inicial</h3>
                <p>
                  Antes de mover una sola campaña, auditamos la cuenta: estructura, audiencias,
                  creatividades, conversiones, atribución. Un buen diagnóstico ahorra meses de
                  optimización ciega.
                </p>
              </div>
              <div className="pm-timeline-duration">Semana 1</div>
            </div>
            <div className="pm-timeline-item pm-reveal">
              <div className="pm-timeline-step">02</div>
              <div className="pm-timeline-content">
                <h3>Estrategia y plan</h3>
                <p>
                  Definimos mix de canales, presupuestos por etapa del funnel, KPIs reales y plan de
                  experimentación. Cada peso tiene un porqué — no se invierte por inercia.
                </p>
              </div>
              <div className="pm-timeline-duration">Semana 2</div>
            </div>
            <div className="pm-timeline-item pm-reveal">
              <div className="pm-timeline-step">03</div>
              <div className="pm-timeline-content">
                <h3>Setup y lanzamiento</h3>
                <p>
                  Implementación técnica completa: tracking, conversiones offline, integraciones con CRM,
                  públicos sincronizados y configuración con criterio profesional.
                </p>
              </div>
              <div className="pm-timeline-duration">Semanas 3–4</div>
            </div>
            <div className="pm-timeline-item pm-reveal">
              <div className="pm-timeline-step">04</div>
              <div className="pm-timeline-content">
                <h3>Optimización continua</h3>
                <p>
                  Revisión semanal, experimentación quincenal, reporting mensual, plan de mejora
                  trimestral. La cuenta se trabaja todos los días — no se 'arma' una vez y se mira el
                  reporte.
                </p>
              </div>
              <div className="pm-timeline-duration">Mes 2 →</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSlider
        eyebrow="06 · Testimonios"
        heading="Lo que dicen los clientes<br />sobre <em>las cuentas.</em>"
      />

      {/* STATS BAND */}
      <section className="pm-stats-band">
        <div className="pm-stats-band-eyebrow">Trompo en números</div>
        <div className="pm-stats-band-grid">
          <div className="pm-stat-band-cell pm-reveal">
            <div className="pm-stat-band-big">$1B<em>+</em></div>
            <div className="pm-stat-band-label">Inversión gestionada<br />en 10 años de operación</div>
          </div>
          <div className="pm-stat-band-cell pm-reveal">
            <div className="pm-stat-band-big">40<em>+</em></div>
            <div className="pm-stat-band-label">Cuentas activas con<br />operación semanal</div>
          </div>
          <div className="pm-stat-band-cell pm-reveal">
            <div className="pm-stat-band-big">3.5<em>x</em></div>
            <div className="pm-stat-band-label">ROAS promedio<br />en cartera B2C</div>
          </div>
          <div className="pm-stat-band-cell pm-reveal">
            <div className="pm-stat-band-big">G<em>·</em>P</div>
            <div className="pm-stat-band-label">Google Partner<br />desde el inicio del programa</div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="pm-faqs">
        <div className="pm-faqs-header">
          <div>
            <div className="pm-section-eyebrow pm-reveal">07 · Preguntas frecuentes</div>
            <h2 className="pm-faqs-h pm-reveal">
              Preguntas <em>antes</em><br />de invertir en ads.
            </h2>
          </div>
          <p className="pm-faqs-meta pm-reveal">
            Las dudas más frecuentes de empresas que nunca trabajaron con una agencia de paid media
            profesional o que vienen de malas experiencias previas. Si tu pregunta no está, escribinos.
          </p>
        </div>
        <div className="pm-faq-list">
          {faqs.map((item, i) => (
            <div key={i} className={`pm-faq-item${openFaq === i ? " open" : ""}`}>
              <button className="pm-faq-q" onClick={() => toggleFaq(i)}>
                <span>{item.q}</span>
                <span className="pm-faq-q-icon" />
              </button>
              <div className="pm-faq-a">
                <div className="pm-faq-a-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section className="pm-other-services">
        <div className="pm-section-eyebrow pm-reveal">Sistema integrado</div>
        <h2 className="pm-other-services-h pm-reveal">
          Conocé los otros<br />servicios <em>del sistema.</em>
        </h2>
        <div className="pm-services-grid">
          <Link to="/servicios/diseno" className="pm-service-card">
            <div className="pm-service-card-num">01 / Diseño</div>
            <h4>Diseño</h4>
            <p>Identidad y sistema visual.</p>
            <span className="pm-service-card-arrow">→</span>
          </Link>
          <Link to="/servicios/multimedia" className="pm-service-card">
            <div className="pm-service-card-num">02 / Multimedia</div>
            <h4>Multimedia</h4>
            <p>Audiovisual, motion y producción.</p>
            <span className="pm-service-card-arrow">→</span>
          </Link>
          <Link to="/servicios/desarrollo" className="pm-service-card">
            <div className="pm-service-card-num">03 / Desarrollo Web</div>
            <h4>Desarrollo Web</h4>
            <p>Sitios y plataformas que escalan.</p>
            <span className="pm-service-card-arrow">→</span>
          </Link>
          <Link to="/servicios/social-media" className="pm-service-card">
            <div className="pm-service-card-num">05 / Redes Sociales</div>
            <h4>Redes Sociales</h4>
            <p>Contenido y comunidad diaria.</p>
            <span className="pm-service-card-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* CTA + FORM */}
      <section className="cta-section" id="contacto">
        <div className="cta-bg-mega">Ads</div>
        <div className="cta-wrap">
          <div>
            <div className="cta-eyebrow">Conversemos</div>
            <h2 className="cta-h">
              ¿Tu cuenta de ads <em>devuelve</em><br />lo que invertís?
            </h2>
            <p className="reveal">
              Auditoría gratuita de la cuenta actual: estructura, conversiones, atribución y creatividad. Diagnóstico cuantitativo con recomendación priorizada por impacto — sin propuesta cerrada de antemano.
            </p>
          </div>

          <div className="cta-form-card reveal">
            <h3 className="cta-form-h">Completá el siguiente formulario.</h3>
            <p className="cta-form-sub">Definamos tu próximo paso estratégico.</p>

            <FormIndex location="paid-media" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default PaidMedia;
