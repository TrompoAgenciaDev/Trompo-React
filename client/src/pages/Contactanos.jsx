import { useEffect, useRef } from "react";

import FormIndex from "../components/forms/FormIndex";
import Dock from "../components/Dock";

import "../assets/styles/contact-page.css";

const Contactanos = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".contact-wrap .reveal").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="contact-wrap">
      <div className="contact-info">
        <div className="contact-info-top">
          <div className="contact-eyebrow reveal">Contacto · 2026</div>
          <h1 className="contact-h reveal">
            Hablemos<br />de tu<br />
            <em>negocio.</em>
          </h1>
          <p className="contact-desc reveal">
            <strong>Una conversación corta, sin presión.</strong> Te hacemos un diagnóstico genuino de tu situación actual y te mostramos cómo trabajamos. Sin propuesta cerrada de entrada.
          </p>
        </div>

        <div>
          <div className="contact-data">
            <div className="contact-data-item reveal">
              <div className="contact-data-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div className="contact-data-label">Email</div>
                <div className="contact-data-val">
                  <a href="mailto:somos@trompoagencia.com">somos@trompoagencia.com</a>
                </div>
              </div>
            </div>

            <div className="contact-data-item reveal">
              <div className="contact-data-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="contact-data-label">Ubicación</div>
                <div className="contact-data-val">
                  Córdoba, Argentina<br />
                  <span>Atendemos clientes en todo el país</span>
                </div>
              </div>
            </div>

            <div className="contact-data-item reveal">
              <div className="contact-data-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="contact-data-label">Horario de atención</div>
                <div className="contact-data-val">Lun a Vie · 09:00 a 18:00 hs</div>
              </div>
            </div>
          </div>

          <div className="contact-disclaimer reveal">
            La información que compartís en este formulario se usa únicamente para contactarte y preparar una propuesta personalizada.
          </div>
        </div>
      </div>

      <div className="contact-form-wrap">
        <div className="form-header reveal">
          <h2>Completá el formulario<br />y te contactamos.</h2>
          <p>Respondemos dentro de las 24 horas hábiles.</p>
        </div>
        <FormIndex showServicio location="contacto" />
      </div>
      <Dock links={[]} />
    </div>
  );
};

export default Contactanos;
