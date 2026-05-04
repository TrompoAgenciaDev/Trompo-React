import { useState, useRef, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { useFormSubmit } from "../../hooks/useFormSubmit";
import { generateSubmissionId, traceEvent } from "../../utils/formTrace";
{/*import "../../assets/styles/form-index.css"; */}
import '../../assets/styles/cta-section.css';

export default function FormIndex({ location = "home", showServicio = false }) {
  const { loading, success, error, submitForm, setError } = useFormSubmit();
  const submissionIdRef = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {

    if (success) {
      window.location.href = `${import.meta.env.BASE_URL}gracias`;
    }
  }, [success]);
  const [renderTime] = useState(Math.floor(Date.now() / 1000));

  const handleClickSubmit = () => {
    if (!submissionIdRef.current) {
      submissionIdRef.current = generateSubmissionId();
      traceEvent("CLICK_SUBMIT", submissionIdRef.current, { formIdentifier: location });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Evitar ejecuciones duplicadas si ya está cargando
    const submissionId = submissionIdRef.current || generateSubmissionId();
    if (!submissionIdRef.current) submissionIdRef.current = submissionId;
    traceEvent("ONSUBMIT_TRIGGERED", submissionId, { formIdentifier: location });

    // 2. reCAPTCHA check
    if (!executeRecaptcha) {
      console.warn("reCAPTCHA no está listo");
      setError("No se pudo validar el envío. Intentá nuevamente.");
      return;
    }

    const formData = new FormData(e.target);

    // 3. Honeypot check
    if (formData.get("fax") && String(formData.get("fax")).trim() !== "") {
      traceEvent("HONEYPOT_BLOCKED", submissionId, { formIdentifier: location });
      console.warn("[FormIndex] Bot detectado (honeypot).");
      window.location.href = `${import.meta.env.BASE_URL}gracias`;
      return;
    }

    try {
      // 4. reCAPTCHA Token
      const token = await executeRecaptcha("form_submit");
      
      if (!token) {
        throw new Error("recaptcha_failed");
      }

      formData.append("LOCATION", location);
      formData.append("g-recaptcha-response", token);
      formData.append("_t", renderTime); // Time Trap
      
      // 5. Submit
      submitForm(formData, { submissionId, formIdentifier: location });
    } catch (err) {
      console.error("Error al obtener token de reCAPTCHA:", err);
      setError("No se pudo validar el envío. Intentá nuevamente.");
      traceEvent("RECAPTCHA_ERROR", submissionId, { formIdentifier: location, error: String(err) });
    }
  };

  return (
    <div className="trompo-form">
      <form id="trompo-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="NOMBRE">Ingresá tu nombre*</label>
          <input
            id="NOMBRE"
            type="text"
            name="NOMBRE"
            className="form-input"
            placeholder="Nombre"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="APELLIDOS">Ingresá tu apellido*</label>
          <input
            id="APELLIDOS"
            type="text"
            name="APELLIDOS"
            className="form-input"
            placeholder="Apellido"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="EMAIL">Ingresá tu email corporativo*</label>
          <input
            id="EMAIL"
            type="email"
            name="EMAIL"
            className="form-input"
            placeholder="info@miempresa.com"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="EMPRESA">Ingresá la URL de la empresa*</label>
          <input
            id="EMPRESA"
            type="url"
            name="EMPRESA"
            className="form-input"
            placeholder="www.miempresa.com"
            required
          />
        </div>
        {showServicio && (
          <div className="form-group">
            <label className="form-label" htmlFor="SERVICIO">¿Qué servicio te interesa?</label>
            <select id="SERVICIO" name="SERVICIO" className="form-select">
              <option value="">Seleccioná una opción</option>
              <option value="estrategia">Estrategia Digital Integral</option>
              <option value="paid-media">Paid Media (Google / Meta Ads)</option>
              <option value="social-media">Redes Sociales</option>
              <option value="diseno">Diseño &amp; Branding</option>
              <option value="web">Desarrollo Web</option>
              <option value="multimedia">Multimedia &amp; Producción</option>
              <option value="todo">Sistema Completo (todo integrado)</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="CONSULTA">Describí brevemente tu consulta*</label>
          <textarea
            id="CONSULTA"
            name="CONSULTA"
            className="form-textarea"
            placeholder="Tu consulta..."
            rows="4"
            required
          />
        </div>
        {/* Honeypot: campo invisible para bots; humanos no lo ven ni completan */}
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <label htmlFor="fax">Fax</label>
          <input
            id="fax"
            type="text"
            name="fax"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="form-submit" disabled={loading} onClick={handleClickSubmit}>
          {loading ? "Enviando..." : "Enviar →"}
        </button>
      </form>
      {error && (
        <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
          {error === "validation_failed" || error === "spam_detected" || error === "recaptcha_failed" || error === "token_missing"
            ? "No se pudo validar el envío. Intentá nuevamente."
            : "Error al enviar el formulario."}
        </p>
      )}
    </div>
  );
}