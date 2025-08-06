import { useState, useEffect } from "react";
import GeneralText from "../json/generaltext.json";

const useFetchServiceFaq = ({ category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      if (category === "services") {
        setItems(GeneralText.services || []);
      } else if (category === "faqs") {
        setItems(GeneralText.faqs || []);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(`Hubo un problema al cargar los datos: ${err.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  return { items, loading, error };
};

export default useFetchServiceFaq;
