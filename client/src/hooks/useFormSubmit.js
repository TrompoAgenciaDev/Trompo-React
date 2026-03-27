import { useState } from "react";

/**
 * Hook para manejar el envío unificado del formulario (BD local + Email SMTP)
 */
export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Endpoint unificado
  const formUrl = () => `${import.meta.env.BASE_URL}form-handler.php`;

  const submitForm = async (formData, { submissionId, formIdentifier }) => {
    setLoading(true);
    setError(null);

    try {
      formData.append("SUBMISSION_ID", submissionId);
      formData.append("LOCATION", formIdentifier);

      const response = await fetch(formUrl(), {
        method: "POST",
        body: formData, // FormData automático para PHP
      });

      const json = await response.json();

      if (json.success) {
        setSuccess(true);
        // Log de éxito interno (opcional)
        console.log(`[Form] Envío exitoso. ID: ${submissionId}`);
      } else {
        const errorMsg = json.error || "Error al enviar el formulario";
        setError(errorMsg);
        console.error(`[Form] Error del servidor: ${errorMsg}`);
      }
    } catch (err) {
      console.error("[Form] Error de red:", err);
      setError("Error de conexión. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, success, error, setError };
};
