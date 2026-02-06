import { useEffect, useState } from "react";

export default function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resuelve rutas relativas del JSON a URLs servibles por Vite
  const resolveUrl = (p) => {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p; // ya absoluta
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
    const clean = String(p).replace(/^\.?\//, ""); // quita "./" o "/"
    return `${base}/${clean}`;
  };

  const normalizeItem = (it) => ({
    ...it,
    featured_image: resolveUrl(it.featured_image),
    featured_video: it.featured_video, // si es url absoluta se respeta
    gallery: Array.isArray(it.gallery) ? it.gallery.map(resolveUrl) : [],
  });

  useEffect(() => {
    let alive = true;

    const buildTime = import.meta.env.BUILD_TIME || Date.now();
    const url = `${import.meta.env.BASE_URL}posts.json?v=${buildTime}`;

    fetch(url, { cache: "default" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        const arr = Array.isArray(data) ? data : [];
        setPosts(arr.map(normalizeItem));
        setError(null);
      })
      .catch((e) => {
        if (!alive) return;
        setError("No se pudieron cargar los posts.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { posts, loading, error };
}
