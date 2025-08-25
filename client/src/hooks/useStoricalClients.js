import { useEffect, useMemo, useState, useCallback } from "react";

/**
 * Fuente: /public/clientes-storic.json
 * Expone:
 *  - listCategories(): string[] (en el mismo orden del JSON)
 *  - getClients(catKey: string): {id:number, cliente:string}[]
 *  - selectedCategory, setSelectedCategory
 *  - loading, error
 */
export default function useStoricalClients() {
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let abort = false;
    setLoading(true);
    fetch("/clientes-storic.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (abort) return;
        setData(json);
        // categoría inicial: primera clave del JSON
        const firstKey = Object.keys(json)[0] ?? null;
        setSelectedCategory(firstKey);
        setLoading(false);
      })
      .catch((e) => {
        if (abort) return;
        setError(e);
        setLoading(false);
      });
    return () => {
      abort = true;
    };
  }, []);

  const listCategories = useCallback(() => {
    if (!data) return [];
    // conserva el orden natural del objeto tal como viene
    return Object.keys(data);
  }, [data]);

  const getClients = useCallback(
    (categoryKey) => {
      if (!data) return [];
      // el JSON tiene "Tecnología " con espacio final; respetamos la clave exacta
      if (categoryKey in data) return data[categoryKey] || [];
      // tolerancia: compara por trim si la clave viene normalizada desde UI
      const found = Object.keys(data).find(
        (k) => k.trim().toLowerCase() === String(categoryKey).trim().toLowerCase()
      );
      return found ? data[found] || [] : [];
    },
    [data]
  );

  const clientsOfSelected = useMemo(
    () => getClients(selectedCategory),
    [getClients, selectedCategory]
  );

  return {
    listCategories,
    getClients,
    selectedCategory,
    setSelectedCategory,
    clientsOfSelected,
    loading,
    error,
  };
}
