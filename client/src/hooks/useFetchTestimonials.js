import { useState, useEffect } from "react";

export default function useFetchTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const buildTime = import.meta.env.BUILD_TIME || Date.now();
        const url = `${import.meta.env.BASE_URL}testimoniales.json?v=${buildTime}`;
        const res = await fetch(url, { cache: "default" });
        if (!res.ok) throw new Error("No se pudo cargar el archivo de testimonios");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.testimoniales || [];
        if (alive) setTestimonials(list);
      } catch (e) {
        if (alive) setError("No se pudieron cargar los testimonios.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  return { testimonials, loading, error };
}
