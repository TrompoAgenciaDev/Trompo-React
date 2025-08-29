import { useEffect, useState } from "react";

const resolveUrl = (p) => {
  if (!p) return "";
  if (/^(https?:|data:|mailto:|tel:)/i.test(p)) return p;
  const cleaned = p.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${cleaned}`;
};
const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const inList = (arr = [], val) => arr.map(norm).includes(norm(val));

export default function usePostsData({ tag, category, limit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${import.meta.env.BASE_URL}posts.json`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        if (tag) data = data.filter((p) => inList(p.tags || [], tag));
        if (category) data = data.filter((p) => inList(p.categories || p.category || [], category));

        const normalized = data.map((p) => ({
          ...p,
          cover: resolveUrl(p.cover || p.featured_image),
          featured_image: resolveUrl(p.featured_image || p.cover),
          categories: p.categories || p.category || [],
        }));

        const limited = Number.isFinite(limit) ? normalized.slice(0, limit) : normalized;
        if (alive) setItems(limited);
      } catch (e) {
        if (alive) setError(e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tag, category, limit]);

  return { items, loading, error };
}
