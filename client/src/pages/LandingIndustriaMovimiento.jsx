import "../assets/styles/landing-industria-movimiento.css";

const LandingIndustriaMovimiento = () => {
  const base = import.meta.env.BASE_URL?.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return (
    <>
      <div className="l-nav">
        <div className="l-logo">
          <img src={`${base}assets/white.webp`} alt="Trompo" />
        </div>

        <div className="l-nav-links">
          <span className="l-nav-link">Servicios</span>
          <span className="l-nav-link">Casos</span>
          <span className="l-nav-link">Nosotros</span>
          <span className="l-nav-cta">Hablemos</span>
        </div>
      </div>

      <div className="l-hero"
        style={{background: `url(${base}assets/landing/industria.png)`, backgroundPosition: "top center", backgroundRepeat: "no-repeat", backgroundSize:"cover"}}
      >
        
      </div>

      <div className="l-logos">
        <div className="l-logos-label">Trabajamos con</div>
        <div className="l-logo-items">
          <span className="l-logo-item">VOLVO TRUCKS</span>
          <span className="l-logo-item">SUPER WALTER</span>
          <span className="l-logo-item">FRAMEX</span>
          <span className="l-logo-item">DENSO</span>
          <span className="l-logo-item">KAMAX MOTOS</span>
          <span className="l-logo-item">AMES MOTOS</span>
        </div>
      </div>

      <div className="l-cases-header">
        <div className="l-cases-eye">Casos del sector</div>
        <div className="l-cases-h">
          El problema no es la inversión. Es la estructura.
          <br />
          Así lo resolvimos.
        </div>
      </div>

      <div className="l-case">
        <div className="l-case-left">
          <div className="l-case-num">01</div>
          <div className="l-case-tag">Fabricante · Transporte pesado</div>
          <div className="l-case-name">Volvo Trucks Argentina</div>
          <div className="l-case-sector">
            Paid media · Desarrollo web · Reporting
          </div>
          <div className="l-case-body">
            Ecosistema digital fragmentado: campañas de paid activas sin
            alineación entre sí, reporting que no informaba decisiones y un
            sitio que no acompañaba el ciclo de compra del sector.
            Restructuramos la arquitectura completa y conectamos cada pieza en
            un sistema unificado.
          </div>
          <div className="l-case-services">
            <span className="l-service-pill">Google Ads</span>
            <span className="l-service-pill">Meta Ads</span>
            <span className="l-service-pill">Web</span>
            <span className="l-service-pill">Reporting</span>
          </div>
        </div>
        <div className="l-case-right">
          <div className="l-metrics">
            <div className="l-metric">
              <div className="l-metric-val l-metric-val-accent">↑ X%</div>
              <div className="l-metric-label">leads calificados</div>
            </div>
            <div className="l-metric">
              <div className="l-metric-val l-metric-val-accent">↓ X%</div>
              <div className="l-metric-label">costo por lead</div>
            </div>
            <div className="l-metric">
              <div className="l-metric-val">1</div>
              <div className="l-metric-label">sistema integrado</div>
            </div>
            <div className="l-metric">
              <div className="l-metric-val">X sem</div>
              <div className="l-metric-label">implementación</div>
            </div>
          </div>
          <div className="l-gallery">
            <div className="l-gallery-item">
              <div className="l-gallery-label l-gallery-label-accent-sm">
                Campaña
              </div>
            </div>
            <div className="l-gallery-item">
              <div className="l-gallery-label l-gallery-label-accent-sm">
                Dashboard
              </div>
            </div>
            <div className="l-gallery-item">
              <div className="l-gallery-item l-gallery-item-inner-video">
                <div className="l-video-label">Video</div>
              </div>
            </div>
          </div>
          <div className="l-quote">
            <div className="l-quote-text">
              "Antes teníamos datos. Ahora tenemos claridad."
            </div>
            <div className="l-quote-author">
              — [Nombre], Volvo Trucks Argentina
            </div>
          </div>
        </div>
      </div>

      <div className="l-case">
        <div className="l-case-left">
          <div className="l-case-num">02</div>
          <div className="l-case-tag">Maquinaria agrícola</div>
          <div className="l-case-name">Super Walter Maquinaria Agrícola</div>
          <div className="l-case-sector">
            Branding digital · Web · Social · Meta Ads
          </div>
          <div className="l-case-body">
            Empresa con fuerte presencia offline pero sin ecosistema digital
            estructurado. Construimos la presencia desde la base: identidad,
            sitio web orientado a conversión y campañas segmentadas por tipo de
            maquinaria y zona geográfica.
          </div>
          <div className="l-case-services">
            <span className="l-service-pill">Branding</span>
            <span className="l-service-pill">Web</span>
            <span className="l-service-pill">Social media</span>
            <span className="l-service-pill">Meta Ads</span>
          </div>
        </div>
        <div className="l-case-right">
          <div className="l-metrics">
            <div className="l-metric">
              <div className="l-metric-val l-metric-val-accent">↑ X%</div>
              <div className="l-metric-label">consultas online</div>
            </div>

            <div className="l-metric">
              <div className="l-metric-val">X prov</div>
              <div className="l-metric-label">regiones nuevas</div>
            </div>
          </div>
          <div className="l-gallery">
            <div className="l-gallery-item"></div>
            <div className="l-gallery-item"></div>
            <div className="l-gallery-item"></div>
          </div>
        </div>
      </div>

      <div className="l-case">
        <div className="l-case-left">
          <div className="l-case-num">03</div>
          <div className="l-case-tag">Logística · Transporte</div>
          <div className="l-case-name">Framex Logística</div>
          <div className="l-case-sector">
            LinkedIn · Contenido B2B · Web · Branding
          </div>
          <div className="l-case-body">
            Empresa con operación sólida y sin presencia digital que la
            acompañara. Desarrollamos una estrategia de posicionamiento B2B
            centrada en LinkedIn que mostró la operación real y posicionó a
            Framex como referente del sector.
          </div>
          <div className="l-case-services">
            <span className="l-service-pill">LinkedIn</span>
            <span className="l-service-pill">Contenido B2B</span>
            <span className="l-service-pill">Web</span>
          </div>
        </div>
        <div className="l-case-right">
          <div className="l-metrics">
            <div className="l-metric">
              <div className="l-metric-val l-metric-val-accent">↑ X%</div>
              <div className="l-metric-label">alcance LinkedIn</div>
            </div>
            <div className="l-metric">
              <div className="l-metric-val">X</div>
              <div className="l-metric-label">leads B2B / mes</div>
            </div>
          </div>
          <div className="l-gallery">
            <div className="l-gallery-item"></div>
            <div className="l-gallery-item"></div>
            <div className="l-gallery-item"></div>
          </div>
        </div>
      </div>

      <div className="l-cta-section">
        <div className="l-cta-h">
          ¿Tu empresa está en el sector que mueve Argentina?
        </div>
        <div className="l-cta-sub">
          Si reconocés alguno de estos problemas en tu operación,
          <br />
          probablemente valga la pena una conversación.
        </div>
        <div className="l-cta-btn">Hablemos →</div>
        <div className="l-cta-note">
          Sin compromiso. Una reunión de 30 minutos, sin PowerPoint.
        </div>
      </div>
    </>
  );
};

export default LandingIndustriaMovimiento;
