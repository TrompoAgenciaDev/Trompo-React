import { useState } from "react";

export default function useFormBrevo() {
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

      // Envío paralelo: Brevo (principal) + Backup (sin bloquear)
      const [brevoResponse, backupResponse] = await Promise.allSettled([
        // Envío principal a Brevo (bloquea el flujo)
        fetch(url, {
          method: "POST",
          body: formData,
        }),
        // Envío de backup en paralelo (no bloquea)
        fetch(`${import.meta.env.VITE_BACKUP_ENDPOINT || '/backend/backup-endpoint.php'}`, {
          method: "POST",
          body: formData,
        }).catch((backupErr) => {
          // Errores del backup se manejan silenciosamente
          console.warn("Backup falló (no crítico):", backupErr);
          return { ok: false, status: 0 };
        }),
      ]);

      // Procesar respuesta de Brevo (principal)
      if (brevoResponse.status === "rejected") {
        throw new Error("Error al conectar con el servidor");
      }

      const response = brevoResponse.value;
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

      // Log del resultado del backup (sin afectar el flujo)
      if (backupResponse.status === "fulfilled" && backupResponse.value.ok) {
        try {
          const backupData = await backupResponse.value.json();
          console.log("Backup guardado:", backupData);
        } catch {
          // Ignorar errores de parseo del backup
        }
      }

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
