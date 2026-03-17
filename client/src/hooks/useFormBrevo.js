import { useState, useRef } from "react";
import { traceEvent } from "../utils/formTrace";

const brevoUrl = () => `${import.meta.env.BASE_URL}form-handler.php`;
const backupUrl = () =>
  import.meta.env.VITE_BACKUP_ENDPOINT || `${import.meta.env.BASE_URL}api/form-backup.php`;

/**
 * Hook para envío a Brevo + backup paralelo.
 * - Lock con useRef para evitar doble ejecución.
 * - Trazabilidad con traceEvent (submissionId, eventos, timestamps).
 * - submissionId se envía al backend para anti-duplicación.
 */
export default function useFormBrevo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const isSubmittingRef = useRef(false);

  const submitForm = async (formData, options = {}) => {
    const { submissionId, formIdentifier } = options;
    const fid = formIdentifier || formData.get?.("LOCATION") || "unknown";

    if (isSubmittingRef.current) {
      traceEvent("DOUBLE_SUBMIT_BLOCKED", submissionId || "none", { formIdentifier: fid });
      console.warn("[FormBrevo] Segundo submit bloqueado (ya hay un envío en curso).");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);

    // Payload para Backup (JSON o FormData según prefiera el backend)
    // El backend nuevo (PHP) parece aceptar FormData o JSON.
    // En main se usaba FormData para el backupFetch.
    const backupPayload = new FormData();
    formData.forEach((value, key) => backupPayload.append(key, value));
    if (submissionId) backupPayload.append("SUBMISSION_ID", submissionId);

    traceEvent("BACKUP_FETCH_START", submissionId || "none", { formIdentifier: fid });

    const backupPromise = fetch(backupUrl(), {
      method: "POST",
      body: backupPayload,
      keepalive: true,
    })
      .then(async (r) => {
        const text = await r.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            success: false,
            duplicate: false,
            db_saved: false,
            mail_sent: false,
            error: text || `HTTP ${r.status}`,
            debug: {},
          };
        }
        traceEvent("BACKUP_FETCH_SUCCESS", submissionId || "none", {
          formIdentifier: fid,
          ...data,
        });
        console.log("[Backup]", data);
        return data;
      })
      .catch((err) => {
        traceEvent("BACKUP_FETCH_ERROR", submissionId || "none", {
          formIdentifier: fid,
          error: String(err),
        });
        console.warn("[Backup] Error:", err);
      });

    try {
      traceEvent("FORM_NATIVE_SUBMIT", submissionId || "none", { formIdentifier: fid });
      const response = await fetch(brevoUrl(), { method: "POST", body: formData });
      
      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("La respuesta del servidor no es JSON válido");
      }

      setResult(json);
      if (json.success) {
        setSuccess(true);
        traceEvent("FORM_SUCCESS", submissionId || "none", { formIdentifier: fid });
        // Redirigir a la página de gracias tras el envío exitoso
        window.location.href = `${import.meta.env.BASE_URL}gracias`;
      } else {
        const rawError = json.error;
        const errorMsg = (typeof rawError === "object" && rawError !== null)
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || "Error al enviar");
        setError(errorMsg);
        traceEvent("FORM_SERVER_ERROR", submissionId || "none", { formIdentifier: fid, error: errorMsg });
      }
    } catch (err) {
      console.error("Error en envío:", err);
      const errorMsg = err.message || "Hubo un error desconocido.";
      setError(errorMsg);
      traceEvent("FORM_FETCH_ERROR", submissionId || "none", { formIdentifier: fid, error: errorMsg });
    } finally {
      // Esperamos el backup por si acaso? No, keepalive se encarga si cerramos pestaña,
      // pero aquí redirigimos. window.location.href corta la ejecución.
      // Si queremos asegurar el backup, deberíamos esperar el backupPromise antes de redirigir.
      await backupPromise; 
      
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return { loading, error, success, submitForm, result };
}
