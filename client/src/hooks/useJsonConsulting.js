import { useState, useEffect } from 'react';
import Portfolio from '../json/portfolio.json';
import Posts from '../json/posts.json';

const dataType = {
  portfolio: Portfolio,
  posts: Posts,
};

const useJsonConsulting = ({ quantity, category, tag, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = dataType[type];

        if (category) {
          data = data.filter(item => item.categories.includes(category));
        }

        if (tag) {
          data = data.filter(item => item.tags.includes(tag));
        }

        if (quantity) {
          data = data.slice(0, quantity);
        }

        setItems(data);
      } catch (err) {
        setError(`Hubo un problema al cargar los datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quantity, category, tag, type]);

  return { items, loading, error };
};

export default useJsonConsulting;
