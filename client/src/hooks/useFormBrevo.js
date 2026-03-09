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

    // Solo enviar al backup si el usuario resolvió el reCAPTCHA (si está activo).
    // El endpoint de backup también valida el token en servidor si hay RECAPTCHA_SECRET.
    if (typeof fields["g-recaptcha-response"] === "string" && fields["g-recaptcha-response"].trim() !== "") {
      sendBackupNotification({
        formId: fields.LOCATION || "home",
        fields,
        timestamp: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      });
    }

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
        // Asegurarse de que el error sea un string (Evita React Error #31)
        const rawError = json.error;
        const errorMsg = (typeof rawError === "object" && rawError !== null)
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || "Hubo un error al enviar el formulario.");
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      // Asegurarse de que err.message sea string
      setError(String(err.message || "Hubo un error desconocido."));
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return { loading, error, success, submitForm, result };
}
