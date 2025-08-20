import { useEffect, useState } from "react";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const url = `${import.meta.env.BASE_URL}members.json`;

    fetch(url, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (alive) {
          setMembers(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch(() => {
        if (alive) setError("No se pudieron cargar los miembros.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  return { members, loading, error };
}
