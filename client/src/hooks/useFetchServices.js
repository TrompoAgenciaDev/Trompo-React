import { useState, useEffect } from "react";

const useFetchServices = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const buildTime = import.meta.env.BUILD_TIME || Date.now();
        const url = `${import.meta.env.BASE_URL}services.json?v=${buildTime}`;
        const res = await fetch(url, { cache: "default" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.services || [];
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

    return () => {
      alive = false;
    };
  }, []);

  return { items, loading, error };
};

export default useFetchServices;
