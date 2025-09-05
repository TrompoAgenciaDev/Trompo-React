import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function useFormDesarrollo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const submitForm = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}form-handler.php`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        navigate("/gracias");
      } else {
        throw new Error(result.error || "Error al enviar el formulario");
      }
    } catch (err) {
      setError(err.message || "Hubo un error desconocido.");
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    success,
    submitForm
  };
}