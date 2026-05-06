import { useEffect } from "react";
import "../../assets/styles/verticales-landing.css";
import FormIndex from "../../components/forms/FormIndex";

const Verticales = () => {
  const base = import.meta.env.BASE_URL?.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  // Splash
  useEffect(() => {
    const timer = setTimeout(() => {
      const splash = document.getElementById("vl-splash");
      if (splash) splash.classList.add("gone");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = document.getElementById("vl-cursor");
    const trail = document.getElementById("vl-cursor-trail");
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let animFrame;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
      animFrame = requestAnimationFrame(animateTrail);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animateTrail();

    const hoverEls = document.querySelectorAll("[data-cursor-hover]");
    const addHover = () => cursor.classList.add("hover");
    const removeHover = () => cursor.classList.remove("hover");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  // Nav scroll effect
  useEffect(() => {
    const nav = document.getElementById("vl-nav");
    const handleScroll = () => {
      if (!nav) return;
      if (window.scrollY > 60) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".vl-page .reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const increment = target / 40;
            const update = () => {
              current += increment;
              if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
              } else {
                el.textContent = target;
              }
            };
            update();
            counterObs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".vl-page .counter").forEach((c) => counterObs.observe(c));
    return () => counterObs.disconnect();
  }, []);

  // Horizontal scroll cases (desktop only)
  useEffect(() => {
    if (window.innerWidth <= 920) return;

    const casesWrap = document.getElementById("vl-cases-wrap");
    const casesTrack = document.getElementById("vl-cases-track");
    const cards = document.querySelectorAll(".vl-page .case-card");
    const progressDots = document.querySelectorAll("#vl-progress span");

    if (!casesWrap || !casesTrack) return;

    const handleScroll = () => {
      const wrapTop = casesWrap.getBoundingClientRect().top;
      const wrapHeight = casesWrap.offsetHeight - window.innerHeight;

      // Clamp progress to [0,1] — siempre actualizar el transform para evitar saltos
      const progress = wrapTop >= 0 ? 0 : wrapTop <= -wrapHeight ? 1 : -wrapTop / wrapHeight;

      const maxTranslate = casesTrack.scrollWidth - window.innerWidth + 80;
      casesTrack.style.transform = `translateX(-${progress * maxTranslate}px)`;

      const activeIndex = Math.min(Math.floor(progress * cards.length), cards.length - 1);
      progressDots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="vl-page">
      {/* Custom cursor */}
      <div className="vl-cursor" id="vl-cursor"></div>
      <div className="vl-cursor-trail" id="vl-cursor-trail"></div>

      {/* Background shape */}
      <div className="vl-trompo-bg"></div>

      {/* Splash entrada */}
      <div className="vl-splash" id="vl-splash">
        <div className="vl-splash-mark">
          <span>Trompo</span>
          <div className="vl-splash-spinner"></div>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <nav id="vl-nav">
        <a href="/" className="logo" data-cursor-hover>
          <img className="logo-img" src={`${base}assets/white.webp`} alt="Trompo" />
        </a>
        <div className="vl-nav-meta">
          <span className="vl-nav-link-time">Industrias del Movimiento</span>
          <a href="#contacto" className="vl-nav-cta" data-cursor-hover>
            Hablemos
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div>
          <div className="hero-eyebrow">
            <span>2026</span>
            <span className="blink">●</span>
            <span>Caso · Industrias del Movimiento</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-line"><span>Marketing</span></span>
            <span className="hero-title-line"><span>para marcas</span></span>
            <span className="hero-title-line"><span>que <em>mueven</em></span></span>
            <span className="hero-title-line"><span>Argentina.</span></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <p className="hero-desc">
            <strong>Diez años ordenando el ecosistema digital del sector industrial.</strong>{" "}
            Trabajamos con fabricantes, terminales, distribuidores y concesionarias de las
            industrias que mueven el país. Estrategia, datos, creatividad y canales
            funcionando como un solo sistema.
          </p>
          <div className="hero-clients">
            <div className="hero-clients-label">Marcas que nos eligen</div>
            <div className="hero-clients-list">
              Volvo Trucks <span>·</span>
              <br />
              Denso <span>·</span>
              <br />
              Super Walter <span>·</span>
              <br />
              Kamax
            </div>
          </div>
        </div>
      </section>


      {/* ===== INTRO ===== */}
      <section className="intro">
        <div className="intro-grid">
          <div className="intro-num reveal">
            01
            <small>Nuestra mirada</small>
          </div>
          <div className="intro-text-block">
            <h2 className="intro-h reveal">
              No vendemos <span className="strike">campañas</span>
              <br />
              Construimos <em>sistemas</em>
              <br />
              que sostienen negocio.
            </h2>
            <p className="intro-lead reveal">
              En el marketing de las industrias del movimiento — agro, automotriz, transporte,
              autopartes, motos, maquinaria — el problema rara vez es de esfuerzo o de
              presupuesto. Es de cómo está estructurado el ecosistema digital. Más canales, más
              datos, más herramientas, menos integración real entre todo eso. Trabajamos para
              que cada pieza empuje en la misma dirección.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CASES HORIZONTAL SCROLL ===== */}
      <div className="cases-scroll-wrap" id="vl-cases-wrap">
        <div className="cases-sticky">
          <div className="scroll-hint">Scroll</div>
          <div className="cases-track" id="vl-cases-track">

            {/* VOLVO */}
            <article className="case-card" data-cursor-hover>
              <img
                src={`${base}assets/img/slider/volvo.png`}
                alt="Volvo Trucks"
              />
              <div className="case-bignum">01</div>
              <div className="case-content">
                <div className="case-tag">Terminal · Transporte Pesado</div>
                <h3 className="case-name">
                  Volvo Trucks <em>&amp; Buses</em>
                  <br />
                  Argentina
                </h3>
                <p className="case-desc">
                  Más de dos años acompañando la operación digital de la terminal de transporte
                  pesado más exigente del mercado. Estrategia, performance, contenido y soporte
                  a la red de concesionarios funcionando como un sistema integrado.
                </p>
                <div className="case-stats-row">
                  <div>
                    <div className="case-stat-num">24<em>+</em></div>
                    <div className="case-stat-label">Meses<br />relación continua</div>
                  </div>
                  <div>
                    <div className="case-stat-num">360<em>°</em></div>
                    <div className="case-stat-label">Estrategia<br />integrada</div>
                  </div>
                </div>
              </div>
            </article>

            {/* DENSO */}
            <article className="case-card" data-cursor-hover>
              <img
                src={`${base}assets/img/slider/denso.png`}
                alt="Denso autopartes"
              />
              <div className="case-bignum">02</div>
              <div className="case-content">
                <div className="case-tag">Multinacional · Autopartes</div>
                <h3 className="case-name">
                  Denso <em>Manufacturing</em>
                  <br />
                  Argentina
                </h3>
                <p className="case-desc">
                  Marketing digital para una multinacional japonesa tier 1 del sector
                  autopartista. Cómo construir presencia y autoridad técnica B2B en una
                  industria donde la decisión la toma ingeniería y la operación, no marketing.
                </p>
                <div className="case-stats-row">
                  <div>
                    <div className="case-stat-num">B2B</div>
                    <div className="case-stat-label">Comunicación<br />técnica especializada</div>
                  </div>
                  <div>
                    <div className="case-stat-num">JP <em>↔</em> AR</div>
                    <div className="case-stat-label">Coordinación<br />con casa matriz</div>
                  </div>
                </div>
              </div>
            </article>

            {/* SUPER WALTER */}
            <article className="case-card" data-cursor-hover>
              <img
                src={`${base}assets/img/slider/super-walter.png`}
                alt="Super Walter agro"
              />
              <div className="case-bignum">03</div>
              <div className="case-content">
                <div className="case-tag">Distribuidor · Maquinaria Agrícola</div>
                <h3 className="case-name">
                  Super Walter
                  <br />
                  <em>Maquinarias</em>
                </h3>
                <p className="case-desc">
                  Distribuidor de maquinaria agrícola con red de cobertura nacional. Marketing
                  pensado para los ciclos del campo, las ferias del sector y una red comercial
                  que necesita material útil — no campañas decorativas.
                </p>
                <div className="case-stats-row">
                  <div>
                    <div className="case-stat-num">Nacional</div>
                    <div className="case-stat-label">Cobertura<br />territorial</div>
                  </div>
                  <div>
                    <div className="case-stat-num">Ciclo</div>
                    <div className="case-stat-label">Calendario<br />adaptado al agro</div>
                  </div>
                </div>
              </div>
            </article>

            {/* KAMAX */}
            <article className="case-card" data-cursor-hover>
              <img
                src={`${base}assets/img/slider/kamax.png`}
                alt="Kamax motos"
              />
              <div className="case-bignum">04</div>
              <div className="case-content">
                <div className="case-tag">Retail Multimarca · Motos</div>
                <h3 className="case-name">
                  Kamax <em>Motos</em>
                  <br />
                  Argentina
                </h3>
                <p className="case-desc">
                  Red de retail multimarca de motos. Marketing donde la conversación digital
                  tiene que terminar en una visita al local — y donde el comprador primerizo, el
                  reincidente y el fierro conviven en la misma estrategia.
                </p>
                <div className="case-stats-row">
                  <div>
                    <div className="case-stat-num">Multi</div>
                    <div className="case-stat-label">Marcas<br />en una red</div>
                  </div>
                  <div>
                    <div className="case-stat-num">D2C</div>
                    <div className="case-stat-label">Digital al<br />showroom físico</div>
                  </div>
                </div>
              </div>
            </article>

            {/* NOVA */}
            <article className="case-card" data-cursor-hover>
              <img
                src={`${base}assets/img/slider/nova.png`}
                alt="Nova International"
              />
              <div className="case-bignum">05</div>
              <div className="case-content">
                <div className="case-tag">Importadora</div>
                <h3 className="case-name">
                  Nova <em>International</em>
                  <br />
                  Argentina
                </h3>
                <p className="case-desc">
                  Red de retail multimarca de motos. Marketing donde la conversación digital
                  tiene que terminar en una visita al local — y donde el comprador primerizo, el
                  reincidente y el fierro conviven en la misma estrategia.
                </p>
                <div className="case-stats-row">
                  <div>
                    <div className="case-stat-num">Multi</div>
                    <div className="case-stat-label">Marcas<br />en una red</div>
                  </div>
                  <div>
                    <div className="case-stat-num">D2C</div>
                    <div className="case-stat-label">Digital al<br />showroom físico</div>
                  </div>
                </div>
              </div>
            </article>

            {/* VAN LIVING */}
            <article className="case-card" data-cursor-hover>
              <img
                src={`${base}assets/img/slider/van-living.png`}
                alt="Van Living"
              />
              <div className="case-bignum">06</div>
              <div className="case-content">
                <div className="case-tag">Motorhomes</div>
                <h3 className="case-name">
                  Van <em>Living</em>
                  <br />
                  Argentina
                </h3>
                <p className="case-desc">
                  Red de retail multimarca de motos. Marketing donde la conversación digital
                  tiene que terminar en una visita al local — y donde el comprador primerizo, el
                  reincidente y el fierro conviven en la misma estrategia.
                </p>
                <div className="case-stats-row">
                  <div>
                    <div className="case-stat-num">Multi</div>
                    <div className="case-stat-label">Marcas<br />en una red</div>
                  </div>
                  <div>
                    <div className="case-stat-num">D2C</div>
                    <div className="case-stat-label">Digital al<br />showroom físico</div>
                  </div>
                </div>
              </div>
            </article>

          </div>

          <div className="cases-scroll-progress" id="vl-progress">
            <span className="active"></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* ===== APPROACH ===== */}
      <section className="approach">
        <h2 className="approach-h reveal">
          Más canales,
          <br />
          más datos,
          <br />
          <em>más certezas.</em>
        </h2>
        <div className="approach-grid">
          <div className="approach-item reveal" data-cursor-hover>
            <div className="approach-num">01</div>
            <h3 className="approach-h-item">Diagnóstico antes que propuesta</h3>
            <p className="approach-text">
              Empezamos entendiendo cómo está organizado hoy el ecosistema digital, dónde se
              pierden los leads y qué piezas no conversan entre sí. Sin diagnóstico, no hay
              estrategia — solo intuición.
            </p>
          </div>
          <div className="approach-item reveal" data-cursor-hover>
            <div className="approach-num">02</div>
            <h3 className="approach-h-item">Sistema integrado, no campañas sueltas</h3>
            <p className="approach-text">
              Estrategia, datos, creatividad, performance y contenido funcionan como un solo
              sistema. Lo que se hace en Google Ads tiene que conversar con el CRM, con el
              contenido orgánico y con la red comercial.
            </p>
          </div>
          <div className="approach-item reveal" data-cursor-hover>
            <div className="approach-num">03</div>
            <h3 className="approach-h-item">Reporting que informa decisiones</h3>
            <p className="approach-text">
              Reportes pensados para que dirección y comercial puedan leerlos sin traducciones.
              Métricas que muestran qué parte del marketing está moviendo el negocio — no solo
              qué generó alcance.
            </p>
          </div>
          <div className="approach-item reveal" data-cursor-hover>
            <div className="approach-num">04</div>
            <h3 className="approach-h-item">Soporte real a la red comercial</h3>
            <p className="approach-text">
              Concesionarios, distribuidores, vendedores y dealers necesitan materiales útiles,
              leads calificados y procesos claros. Marketing es para ventas — no contra ventas.
              Esa es la verdadera transformación.
            </p>
          </div>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="quote-section">
        <div className="quote-mark reveal">"</div>
        <p className="quote-text reveal">
          En el marketing industrial argentino,
          el problema casi nunca es de esfuerzo.
          <br />
          Es de <strong>cómo está estructurado el ecosistema.</strong>
        </p>
        <p className="quote-author reveal">
          Esteban Raparo · <span>Founder Trompo Agencia</span>
        </p>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="stats-band">
        <div className="stats-eyebrow">Trompo en números</div>
        <div className="stats-grid">
          <div className="stat-cell reveal">
            <div className="stat-big">
              <span className="counter" data-target="15">0</span>
              <em>+</em>
            </div>
            <div className="stat-label-band">
              Años de experiencia
              <br />
              en marketing digital
            </div>
          </div>
          <div className="stat-cell reveal">
            <div className="stat-big">
              <span className="counter" data-target="10">0</span>
              <em>+</em>
            </div>
            <div className="stat-label-band">
              Años acompañando
              <br />
              marcas industriales
            </div>
          </div>
          <div className="stat-cell reveal">
            <div className="stat-big">
              <span className="counter" data-target="80">0</span>
              <em>+</em>
            </div>
            <div className="stat-label-band">
              Marcas argentinas
              <br />
              en nuestra trayectoria
            </div>
          </div>
          <div className="stat-cell reveal">
            <div className="stat-big">
              G<em>·</em>P
            </div>
            <div className="stat-label-band">
              Google Partner
              <br />
              Certified desde el inicio
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section" id="contacto">
        <div className="cta-bg-mega">Movimiento</div>
        <div className="cta-wrap">
          <div>
            <div className="cta-eyebrow">03 · Conversemos</div>
            <h2 className="cta-h">
              Si el marketing
              <br />
              en tu empresa está
              <br />
              moviéndose <em>sin rumbo</em>,
              <br />
              hablemos.
            </h2>
            <p className="cta-sub">
              Una conversación de 25 minutos para entender cómo está hoy tu ecosistema digital y
              mostrarte cómo trabajamos con marcas parecidas a la tuya. Sin propuesta comercial.
              Sin presión.
            </p>
          </div>
          <div className="cta-form-card reveal">
            <h3 className="cta-form-h">Completá el siguiente formulario.</h3>
            <p className="cta-form-sub">Definamos tu próximo paso estratégico.</p>
            <FormIndex location="verticales" />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="footer-inner">
          <div className="vl-footer-logo">
            Trompo
          </div>
          <div className="footer-meta">
            Trompo Agencia
            <br />
            Vanguardia Digital · Córdoba
            <br />
            Google Partner Certified
            <br />
            <a href="https://trompoagencia.com" data-cursor-hover>
              trompoagencia.com
            </a>
            <br />
            <a href="mailto:esteban@trompoagencia.com" data-cursor-hover>
              esteban@trompoagencia.com
            </a>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Trompo Agencia · Vanguardia Digital</span>
          <span>Diseñado para marcas que mueven Argentina</span>
        </div>
      </footer>
    </div>
  );
};

export default Verticales;
