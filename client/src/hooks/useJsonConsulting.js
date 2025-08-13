import { useState, useEffect } from 'react';

const useJsonConsulting = ({ quantity, category, tag, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileMap = {
    portfolio: '/portfolio.json',
    posts: '/posts.json',
  };

  // helpers
  const norm = (v) => (v ?? '').toString().trim().toLowerCase();
  const inArrayCI = (arr, value) =>
    Array.isArray(arr) && arr.some((x) => norm(x) === norm(value));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fileMap[type], { cache: "no-store" });
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

        if (quantity) {
          data = data.slice(0, quantity);
        }

        setItems(data);
      } catch (err) {
        setError(`Hubo un problema al cargar los datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quantity, category, tag, type]);

  return { items, loading, error };
};

export default useJsonConsulting;
