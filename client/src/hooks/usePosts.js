import { useEffect, useState } from "react";

export default function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let alive = true;

    // /public/posts.json (respeta base path en Vite)
    const url = `/posts.json`;

    fetch(url, { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (!alive) return;
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError("No se pudieron cargar los posts.");
        setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  return { posts, loading, error };
}
