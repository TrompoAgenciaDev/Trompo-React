import { useState, useEffect } from 'react';

const useJsonConsulting = ({ quantity, category, tag, type }) => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const base = import.meta.env.BASE_URL;
  const fileMap = {
    portfolio: `${base}portfolio.json`,
    posts:     `${base}posts.json`,
  };

  // helpers
  const norm = (v) => (v ?? '').toString().trim().toLowerCase();
  const inArrayCI = (arr, value) =>
    Array.isArray(arr) && arr.some((x) => norm(x) === norm(value));

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = fileMap[type];
        if (!url) throw new Error(`Tipo desconocido: ${type}`);

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let data = await res.json();

        if (category) {
          const catNorm = norm(category);
          data = data.filter((item) => inArrayCI(item?.categories, catNorm));
        }

        if (tag) {
          const tagNorm = norm(tag);
          data = data.filter((item) => inArrayCI(item?.tags, tagNorm));
        }

        if (quantity) data = data.slice(0, quantity);

        if (alive) setItems(data);
      } catch (err) {
        if (alive) setError(`Hubo un problema al cargar los datos: ${err.message}`);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [quantity, category, tag, type]);

  return { items, loading, error };
};

export default useJsonConsulting;
