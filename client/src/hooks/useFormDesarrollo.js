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
      const url = `${import.meta.env.BASE_URL}form-handler.php`;
      console.log("Enviando a:", url);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("HTTP status:", response.status);

      const text = await response.text();
      console.log("Respuesta cruda del PHP:", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("La respuesta del servidor no es JSON válido");
      }

      console.log("Respuesta parseada:", json);
      setResult(json);

      if (json.success) {
        setSuccess(true);
        window.location.href = `${import.meta.env.BASE_URL}gracias`;
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
