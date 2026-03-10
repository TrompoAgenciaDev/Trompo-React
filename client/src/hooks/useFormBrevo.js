import { useRef, useState } from "react";
import { sendBackupNotification } from "../utils/sendBackupNotification";

export default function useFormBrevo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const isSubmittingRef = useRef(false);

  const submitForm = async (formData) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);

    const fields = Object.fromEntries(
      typeof formData.entries === "function" ? formData.entries() : []
    );

    try {
      // Ahora enviamos directamente al handler de SMTP (backup) como destino principal
      const url = `${import.meta.env.BASE_URL}api/form-backup.php`;

      const payload = {
        formId: fields.LOCATION || "home",
        fields,
        timestamp: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
        // Redirigir a la página de gracias tras el envío exitoso por SMTP
        window.location.href = `${import.meta.env.BASE_URL}gracias`;
      } else {
        const rawError = json.error;
        const errorMsg = (typeof rawError === "object" && rawError !== null)
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || (json.http ? `Error SMTP ${json.http}` : JSON.stringify(json)) || "Hubo un error al enviar el formulario.");
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error en el envío:", err);
      setError(String(err.message || "Hubo un error desconocido."));
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return { loading, error, success, submitForm, result };
}
