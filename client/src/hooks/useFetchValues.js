import { useState, useEffect } from "react";

export default function useFetchValues() {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const buildTime = import.meta.env.BUILD_TIME || Date.now();
        const url = `${import.meta.env.BASE_URL}values.json?v=${buildTime}`;
        const res = await fetch(url, { cache: "default" });
        if (!res.ok) throw new Error("No se pudo cargar el archivo de valores");

        const data = await res.json();
        if (isMounted) setValues(Array.isArray(data) ? data : data.values || []);
      } catch (err) {
        if (isMounted) setError("No se pudieron cargar los valores.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, []);

  return { values, loading, error };
}
