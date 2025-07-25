import { useState, useEffect } from "react";

export default function useFetchTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/testimoniales.json")
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el archivo de testimonios");
        return res.json();
      })
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los testimonios.");
        setLoading(false);
      });
  }, []);

  return { testimonials, loading, error };
}