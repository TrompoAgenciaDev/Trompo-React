import { useState, useEffect } from "react";

const useFetchServiceFaq = ({ category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/generaltext.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (category === "services") {
          setItems(data.services || []);
        } else if (category === "faqs") {
          setItems(data.faqs || []);
        } else {
          setItems([]);
        }
      } catch (err) {
        setError(`Hubo un problema al cargar los datos: ${err.message}`);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return { items, loading, error };
};

export default useFetchServiceFaq;
