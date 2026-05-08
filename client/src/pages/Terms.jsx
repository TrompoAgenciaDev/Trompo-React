import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/terms-conditions.css";

const TOC_ITEMS = [
  { id: "s01", num: "01", label: "Aceptación de los términos" },
  { id: "s02", num: "02", label: "Identificación del titular" },
  { id: "s03", num: "03", label: "Objeto del sitio" },
  { id: "s04", num: "04", label: "Uso del sitio" },
  { id: "s05", num: "05", label: "Propiedad intelectual" },
  { id: "s06", num: "06", label: "Datos personales y privacidad" },
  { id: "s07", num: "07", label: "Cookies y tecnologías similares" },
  { id: "s08", num: "08", label: "Enlaces a sitios de terceros" },
  { id: "s09", num: "09", label: "Limitación de responsabilidad" },
  { id: "s10", num: "10", label: "Servicios profesionales" },
  { id: "s11", num: "11", label: "Modificaciones" },
  { id: "s12", num: "12", label: "Ley aplicable y jurisdicción" },
  { id: "s13", num: "13", label: "Contacto" },
];

export default function Terms() {
  const tocLinksRef = useRef([]);

  // TOC active state on scroll
  useEffect(() => {
    const sections = document.querySelectorAll(".terms-section");
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            tocLinksRef.current.forEach((link) => {
              if (!link) return;
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + e.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".terms-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/" data-cursor-hover>Trompo</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Términos y condiciones</span>
      </div>

      {/* HERO */}
      <section className="terms-hero">
        <div className="terms-hero-eyebrow">Documento legal · Marco aplicable</div>
        <h1 className="terms-hero-h1">
          Términos<br />y <em>condiciones</em>.
        </h1>
        <p className="terms-hero-desc">
          Documento que regula el acceso, la navegación y el uso del sitio web institucional de Trompo Agencia. Al ingresar al sitio, el usuario acepta los términos detallados a continuación.
        </p>

        <div className="terms-hero-meta">
          <div className="terms-meta-cell">
            <span className="terms-meta-label">Razón social</span>
            <span className="terms-meta-value">Trompo Agencia</span>
          </div>
          <div className="terms-meta-cell">
            <span className="terms-meta-label">Domicilio</span>
            <span className="terms-meta-value">Córdoba, Argentina</span>
          </div>
          <div className="terms-meta-cell">
            <span className="terms-meta-label">Contacto</span>
            <span className="terms-meta-value">somos@trompoagencia.com</span>
          </div>
          <div className="terms-meta-cell">
            <span className="terms-meta-label">Última actualización</span>
            <span className="terms-meta-value gold">Mayo 2026</span>
          </div>
        </div>
      </section>

      {/* DOC: TOC + CONTENT */}
      <div className="terms-doc">

        {/* TOC */}
        <aside className="terms-toc">
          <div className="terms-toc-h">Contenido</div>
          <ul className="terms-toc-list">
            {TOC_ITEMS.map(({ id, num, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="terms-toc-link"
                  data-cursor-hover
                  ref={(el) => (tocLinksRef.current[i] = el)}
                >
                  <span className="terms-toc-num">{num}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* CONTENT */}
        <article className="terms-content">

          <section className="terms-section" id="s01">
            <div className="terms-section-num">01 · Aceptación</div>
            <h2 className="terms-section-h">Aceptación de los <em>términos</em>.</h2>
            <p>El presente documento establece los términos y condiciones generales (en adelante, los "Términos") aplicables al acceso y uso del sitio web ubicado en <a href="https://trompoagencia.com" data-cursor-hover>trompoagencia.com</a> (en adelante, el "Sitio"), titularidad de Trompo Agencia.</p>
            <p>El acceso al Sitio implica el conocimiento y la aceptación expresa, plena y sin reservas por parte del usuario de la totalidad de los Términos vigentes en cada momento. <strong>Si el usuario no está de acuerdo con alguno de los puntos detallados, deberá abstenerse de utilizar el Sitio.</strong></p>
          </section>

          <section className="terms-section" id="s02">
            <div className="terms-section-num">02 · Titular</div>
            <h2 className="terms-section-h">Identificación del <em>titular</em>.</h2>
            <p>El titular del Sitio es <strong>Trompo Agencia</strong>, agencia de marketing digital con domicilio en la ciudad de Córdoba, Argentina.</p>
            <ul className="terms-list">
              <li><strong>Razón social:</strong> Trompo Agencia</li>
              <li><strong>Domicilio:</strong> Córdoba, Argentina</li>
              <li><strong>Correo de contacto:</strong> somos@trompoagencia.com</li>
              <li><strong>Inicio de operaciones:</strong> 2016</li>
            </ul>
          </section>

          <section className="terms-section" id="s03">
            <div className="terms-section-num">03 · Objeto</div>
            <h2 className="terms-section-h">Objeto del <em>Sitio</em>.</h2>
            <p>El Sitio tiene como finalidad presentar institucionalmente a Trompo Agencia, comunicar los servicios profesionales que ofrece, exponer su trayectoria y facilitar el contacto inicial con potenciales clientes y colaboradores.</p>
            <p>Los contenidos del Sitio tienen carácter <strong>informativo y comercial</strong>. La información publicada no constituye asesoramiento profesional vinculante hasta tanto se formalice una relación contractual específica entre Trompo Agencia y el usuario.</p>
          </section>

          <section className="terms-section" id="s04">
            <div className="terms-section-num">04 · Uso del Sitio</div>
            <h2 className="terms-section-h">Uso permitido <em>y restricciones</em>.</h2>
            <p>El usuario se compromete a utilizar el Sitio de conformidad con la ley vigente, los presentes Términos, la moral, las buenas costumbres y el orden público.</p>
            <p>Queda expresamente prohibido al usuario:</p>
            <ul className="terms-list">
              <li>Utilizar el Sitio con fines ilícitos, lesivos de derechos de terceros, o que de cualquier forma puedan dañar, inutilizar o sobrecargar el Sitio.</li>
              <li>Introducir o difundir virus informáticos o cualquier otro sistema susceptible de provocar alteraciones en el Sitio o en los sistemas de los usuarios.</li>
              <li>Realizar acciones de scraping automatizado, ingeniería inversa o intentos de acceso no autorizado a áreas restringidas.</li>
              <li>Suplantar la identidad de Trompo Agencia, de su personal o de cualquier tercero.</li>
              <li>Reproducir, distribuir o explotar comercialmente los contenidos del Sitio sin autorización expresa por escrito.</li>
            </ul>
          </section>

          <section className="terms-section" id="s05">
            <div className="terms-section-num">05 · Propiedad intelectual</div>
            <h2 className="terms-section-h">Propiedad <em>intelectual</em>.</h2>
            <p>Todos los contenidos del Sitio — incluyendo textos, imágenes fotográficas, vídeos, gráficos, ilustraciones, marca, logotipos, isotipos, código fuente, diseño, estructura, selección y disposición de contenidos — son <strong>propiedad exclusiva de Trompo Agencia</strong> o de sus respectivos titulares cuando corresponda, y se encuentran protegidos por la legislación nacional e internacional sobre propiedad intelectual e industrial.</p>
            <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación, total o parcial, de los contenidos del Sitio sin la autorización previa, expresa y por escrito de Trompo Agencia.</p>
            <p>Las marcas comerciales, denominaciones y logotipos de terceros eventualmente mencionados en el Sitio son propiedad de sus respectivos titulares y se utilizan únicamente con fines identificativos o ilustrativos relacionados con la trayectoria de la agencia.</p>
            <div className="terms-callout">
              <div className="terms-callout-label">Aclaración</div>
              <p>La presencia de una marca cliente en el Sitio no implica necesariamente una relación comercial vigente al día de la fecha. Se trata de una representación de la trayectoria histórica de Trompo Agencia.</p>
            </div>
          </section>

          <section className="terms-section" id="s06">
            <div className="terms-section-num">06 · Privacidad</div>
            <h2 className="terms-section-h">Datos personales <em>y privacidad</em>.</h2>
            <p>Trompo Agencia trata los datos personales que el usuario proporciona a través del Sitio (por ejemplo, mediante formularios de contacto) con el único objeto de gestionar la consulta realizada y, en su caso, evaluar la viabilidad de una relación comercial profesional.</p>
            <p>El tratamiento de datos personales se realiza conforme a lo dispuesto por la <strong>Ley N° 25.326 de Protección de Datos Personales</strong> de la República Argentina y normativa concordante.</p>
            <p>El usuario tiene derecho, en todo momento y de forma gratuita, a:</p>
            <ul className="terms-list">
              <li>Acceder a sus datos personales tratados por Trompo Agencia.</li>
              <li>Solicitar su rectificación cuando sean inexactos o incompletos.</li>
              <li>Solicitar la supresión de sus datos cuando ya no resulten necesarios.</li>
              <li>Oponerse al tratamiento de sus datos en los términos previstos por la normativa.</li>
            </ul>
            <p>El ejercicio de estos derechos puede solicitarse mediante correo electrónico a <a href="mailto:somos@trompoagencia.com" data-cursor-hover>somos@trompoagencia.com</a>, identificándose adecuadamente.</p>
          </section>

          <section className="terms-section" id="s07">
            <div className="terms-section-num">07 · Cookies</div>
            <h2 className="terms-section-h">Cookies y tecnologías <em>similares</em>.</h2>
            <p>El Sitio utiliza cookies y tecnologías similares con la finalidad de garantizar el correcto funcionamiento de la navegación, recordar preferencias del usuario y obtener información estadística sobre el uso del Sitio.</p>
            <p>Las cookies utilizadas pueden clasificarse en:</p>
            <ul className="terms-list">
              <li><strong>Cookies técnicas:</strong> imprescindibles para el funcionamiento del Sitio.</li>
              <li><strong>Cookies analíticas:</strong> permiten medir y analizar el comportamiento de los usuarios mediante herramientas como Google Analytics.</li>
              <li><strong>Cookies de terceros:</strong> instaladas por servicios externos integrados al Sitio (por ejemplo, plataformas publicitarias).</li>
            </ul>
            <p>El usuario puede configurar el navegador para aceptar, rechazar o eliminar las cookies en cualquier momento. La desactivación de determinadas cookies puede afectar el funcionamiento de algunas secciones del Sitio.</p>
          </section>

          <section className="terms-section" id="s08">
            <div className="terms-section-num">08 · Enlaces externos</div>
            <h2 className="terms-section-h">Enlaces a sitios <em>de terceros</em>.</h2>
            <p>El Sitio puede incluir enlaces a otros sitios web operados por terceros. Estos enlaces se proporcionan únicamente con fines de referencia y no implican que Trompo Agencia respalde, recomiende o asuma responsabilidad alguna sobre el contenido, las prácticas de privacidad o el funcionamiento de dichos sitios externos.</p>
            <p>El acceso a sitios de terceros se realiza por cuenta y riesgo del usuario, y queda sujeto a los términos y condiciones particulares que cada uno de ellos establezca.</p>
          </section>

          <section className="terms-section" id="s09">
            <div className="terms-section-num">09 · Responsabilidad</div>
            <h2 className="terms-section-h">Limitación <em>de responsabilidad</em>.</h2>
            <p>Trompo Agencia se compromete a mantener actualizada y veraz la información publicada en el Sitio. No obstante, no garantiza la ausencia de errores, omisiones o inexactitudes en los contenidos.</p>
            <p>Trompo Agencia no será responsable por:</p>
            <ul className="terms-list">
              <li>Interrupciones, fallas técnicas, virus u otros elementos lesivos en el Sitio o en su acceso.</li>
              <li>Daños o perjuicios derivados del uso del Sitio o de la imposibilidad de utilizarlo.</li>
              <li>Decisiones tomadas por el usuario sobre la base exclusiva de la información publicada en el Sitio sin previa relación contractual formalizada.</li>
              <li>Contenidos, productos o servicios ofrecidos por sitios web de terceros enlazados desde el Sitio.</li>
            </ul>
          </section>

          <section className="terms-section" id="s10">
            <div className="terms-section-num">10 · Servicios profesionales</div>
            <h2 className="terms-section-h">Servicios <em>profesionales</em>.</h2>
            <p>Los servicios profesionales prestados por Trompo Agencia (entre otros: diseño, multimedia, desarrollo web, paid media y redes sociales) se rigen por los términos particulares que se acuerdan en cada propuesta comercial y contrato de prestación de servicios firmado con el cliente.</p>
            <p>La información publicada en el Sitio respecto de los servicios tiene carácter ilustrativo. Las métricas, benchmarks y resultados mencionados representan datos históricos agregados de la cartera de Trompo Agencia y <strong>no constituyen una garantía de resultados futuros</strong> aplicables a un caso específico.</p>
            <div className="terms-callout">
              <div className="terms-callout-label">Importante</div>
              <p>Cualquier compromiso comercial vinculante con Trompo Agencia requiere la firma previa de un contrato de prestación de servicios o de una propuesta comercial formalmente aceptada por ambas partes.</p>
            </div>
          </section>

          <section className="terms-section" id="s11">
            <div className="terms-section-num">11 · Modificaciones</div>
            <h2 className="terms-section-h">Modificaciones de los <em>Términos</em>.</h2>
            <p>Trompo Agencia se reserva el derecho de modificar los presentes Términos en cualquier momento, sin previo aviso, con el fin de adaptarlos a cambios legislativos, novedades del Sitio o nuevas prácticas comerciales.</p>
            <p>Las modificaciones entrarán en vigencia a partir de su publicación en el Sitio. Se recomienda al usuario revisar periódicamente los Términos. La fecha de la última actualización se indica en la cabecera de este documento.</p>
          </section>

          <section className="terms-section" id="s12">
            <div className="terms-section-num">12 · Ley aplicable</div>
            <h2 className="terms-section-h">Ley aplicable <em>y jurisdicción</em>.</h2>
            <p>Los presentes Términos se rigen por las leyes vigentes en la <strong>República Argentina</strong>.</p>
            <p>Para cualquier controversia derivada del acceso o uso del Sitio, las partes se someten expresamente a la jurisdicción de los tribunales ordinarios de la ciudad de <strong>Córdoba, Provincia de Córdoba, Argentina</strong>, con renuncia a cualquier otro fuero o jurisdicción que pudiera corresponder.</p>
          </section>

          <section className="terms-section" id="s13">
            <div className="terms-section-num">13 · Contacto</div>
            <h2 className="terms-section-h">Contacto <em>legal</em>.</h2>
            <p>Para cualquier consulta relacionada con los presentes Términos, ejercicio de derechos sobre datos personales o aspectos legales del uso del Sitio, el usuario puede dirigirse al equipo de Trompo Agencia mediante los siguientes canales:</p>
            <ul className="terms-list">
              <li><strong>Correo electrónico:</strong> <a href="mailto:somos@trompoagencia.com" data-cursor-hover>somos@trompoagencia.com</a></li>
              <li><strong>Domicilio:</strong> Córdoba, Argentina</li>
              <li><strong>Horario de atención:</strong> Lunes a Viernes · 09:00 a 18:00 hs (ART)</li>
            </ul>
            <p>Trompo Agencia atenderá las consultas recibidas en un plazo razonable, conforme a la naturaleza y complejidad de cada solicitud.</p>
          </section>

        </article>
      </div>

      {/* CTA */}
      <section className="terms-cta">
        <div className="terms-cta-eyebrow">Conversemos</div>
        <h2>¿Preguntas sobre los <em>Términos</em>?</h2>
        <p>Si necesitás aclarar algún punto del documento o tenés una consulta legal específica, escribinos. Te respondemos en horario laboral.</p>
        <div className="terms-cta-buttons">
          <Link to="/contactanos" className="terms-btn-primary" data-cursor-hover>Solicitar reunión →</Link>
          <a href="mailto:somos@trompoagencia.com" className="terms-btn-ghost" data-cursor-hover>Escribir un email</a>
        </div>
      </section>
    </>
  );
}
