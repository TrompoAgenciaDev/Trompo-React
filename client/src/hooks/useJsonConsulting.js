import { useState, useEffect } from "react";

const useJsonConsulting = ({ quantity, category, tag, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileMap = {
    portfolio: `${import.meta.env.BASE_URL}portfolio.json`,
    posts: `${import.meta.env.BASE_URL}posts.json`,
  };

  const norm = (v) => (v ?? "").toString().trim().toLowerCase();

  const toArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return [v];
    if (typeof v === "object") {
      const keys = Object.keys(v);
      const vals = Object.values(v).flatMap((x) =>
        Array.isArray(x) ? x : x != null ? [x] : []
      );
      return [...keys, ...vals];
    }
    return [];
  };

  const containsCI = (listLike, value) =>
    toArray(listLike).some((x) => norm(x) === norm(value));

  const getCategories = (item) => toArray(item?.categories ?? item?.category);
  const getTags = (item) => toArray(item?.tags);

  // NUEVO: resolver rutas a absolutas
  const resolveUrl = (p) => {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    const clean = p.replace(/^\.?\//, ""); // quita "./" o "/"
    return `${import.meta.env.BASE_URL}${clean}`;
  };

  // opcional: normalizar galería
  const normalizeItem = (it) => {
    const categories = toArray(it?.categories ?? it?.category);

    return {
      ...it,
      categories, // siempre presente
      featured_image: resolveUrl(it.featured_image),
      featured_video: it.featured_video,
      gallery: Array.isArray(it.gallery) ? it.gallery.map(resolveUrl) : [],
      enlacePortfolio: it.url_client ? resolveUrl(it.url_client) : undefined,
    };
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = fileMap[type];
        if (!url) throw new Error(`Tipo desconocido: ${type}`);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let data = await res.json();

        if (category) {
          data = data.filter((item) =>
            containsCI(getCategories(item), category)
          );
        }
        if (tag) {
          data = data.filter((item) => containsCI(getTags(item), tag));
        }

        data = data.map(normalizeItem);

        if (quantity) data = data.slice(0, quantity);
        if (alive) setItems(data);
      } catch (err) {
        if (alive)
          setError(`Hubo un problema al cargar los datos: ${err.message}`);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [quantity, category, tag, type]);

  return { items, loading, error };
};

export default useJsonConsulting;
