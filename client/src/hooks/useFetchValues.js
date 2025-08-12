import { useState, useEffect } from "react";

export default function useFetchValues() {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Evita setState si el componente se desmonta

    const fetchData = async () => {
      try {
        const res = await fetch("/values.json", {
          headers: {
            "Cache-Control": "no-cache", // evita usar datos viejos
          },
        });
        if (!res.ok) throw new Error("No se pudo cargar el archivo de valores");

        const data = await res.json();
        if (isMounted) {
          setValues(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError("No se pudieron cargar los valores.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { values, loading, error };
}
