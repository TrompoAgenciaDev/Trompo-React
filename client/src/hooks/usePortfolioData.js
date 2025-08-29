import { useEffect, useState } from "react";

const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const resolveUrl = (p) => {
  if (!p) return "";
  if (/^(https?:|data:|mailto:|tel:)/i.test(p)) return p;
  const cleaned = p.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${cleaned}`;
};

export default function usePortfolioData({ location, category, limit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${import.meta.env.BASE_URL}portfolio.json`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // fuente según location; si no hay location, usa todo
        const base = location ? toArray(data[location]) : Object.values(data).flat();
        // filtra por categoría si viene
        const filtered = category
          ? base.filter((it) =>
              toArray(it?.category).map(norm).includes(norm(category))
            )
          : base;

        const normalized = filtered.map((it) => ({
          ...it,
          featured_image: resolveUrl(it.featured_image),
          vertical_image: resolveUrl(it.vertical_image),
          featured_video: it.featured_video ? resolveUrl(it.featured_video) : "",
          enlacePortfolio: it.url_client || "",
          categories: toArray(it.category),
        }));

        const limited = limit ? normalized.slice(0, limit) : normalized;
        if (alive) setItems(limited);
      } catch (e) {
        if (alive) setError(e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [location, category, limit]);

  return { items, loading, error };
}
