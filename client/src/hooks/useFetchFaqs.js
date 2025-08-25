import { useState, useEffect } from "react";

const useFetchFaqs = (section = "home") => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${import.meta.env.BASE_URL}faqs.json`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Compat: si antes era array, úsalo tal cual; si es objeto, usa la clave pedida.
        const key = String(section || "home").toLowerCase();
        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.[key])
              ? data[key]
              : [];

        if (!Array.isArray(list)) throw new Error(`Sección "${key}" no encontrada`);
        if (alive) setItems(list);
      } catch (err) {
        if (alive) {
          setError(`Hubo un problema al cargar los datos: ${err.message}`);
          setItems([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [section]);

  return { items, loading, error };
};

export default useFetchFaqs;
