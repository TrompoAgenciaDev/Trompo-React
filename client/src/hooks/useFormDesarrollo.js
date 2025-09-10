import { useState } from "react";

export default function useFormDesarrollo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const submitForm = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.BASE_URL}form-handler.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const json = await response.json();
      console.log("Respuesta del PHP:", json);
      setResult(json);

      if (json.success) {
        setSuccess(true);
        window.location.href = `${import.meta.env.BASE_URL}gracias`;
      } else {
        throw new Error(json.error || "Error al enviar el formulario");
      }
    } catch (err) {
      setError(err.message || "Hubo un error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, submitForm, result };
}
