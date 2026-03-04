import { useState } from "react";
import { sendBackupNotification } from "../utils/sendBackupNotification";

export default function useFormBrevo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const submitForm = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const fields = Object.fromEntries(
      typeof formData.entries === "function" ? formData.entries() : []
    );
    sendBackupNotification({
      formId: fields.LOCATION || "home",
      fields,
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    });

    try {
      const url = `${import.meta.env.BASE_URL}form-handler.php`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
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
        window.location.href = `${import.meta.env.BASE_URL}gracias`;
      } else {
        setError(json.error || "Hubo un error al enviar el formulario.");
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      setError(err.message || "Hubo un error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, submitForm, result };
}
