import { useEffect, useState } from "react";

const resolvePath = (p) => {
  if (!p) return "";
  if (/^(https?:|data:|mailto:|tel:|blob:)/i.test(p)) return p;
  return p.replace(/^\/+/, "");
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

        const buildTime = import.meta.env.BUILD_TIME || Date.now();
        const res = await fetch(`posts.json?v=${buildTime}`, { cache: "default" }); // sin BASE
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        if (tag) data = data.filter((p) => inList(p.tags || [], tag));
        if (category)
          data = data.filter((p) =>
            inList(p.categories || p.category || [], category)
          );

        const normalized = data.map((p) => ({
          ...p,
          cover: resolvePath(p.cover || p.featured_image),
          featured_image: resolvePath(p.featured_image || p.cover),
          categories: p.categories || p.category || [],
        }));

        const limited = Number.isFinite(limit)
          ? normalized.slice(0, limit)
          : normalized;
        if (alive) setItems(limited);
      } catch (e) {
        if (alive) setError(e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tag, category, limit]);

  return { items, loading, error };
}
