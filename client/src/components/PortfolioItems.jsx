import { useState } from "react";
import usePortfolioItems from "../hooks/usePortfolioItems";

//styles and animations
import {motion} from 'framer-motion';

const PortfolioItems = ({ handleMouseEnter, handleMouseLeave}) => {
  const [quantity, setQuantity] = useState(12);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  const { items, loading, error } = usePortfolioItems({
    quantity,
    category,
    tag,
  });

  
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid-portfolio">
      {items.map((item, index) => {
        const backgroundImage = item.featured_image || "";

        return (
          <motion.div
            key={index}
            className="portfolio-item"
            onMouseEnter={() => handleMouseEnter(backgroundImage || "/logo.png")}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            onHoverStart={event => {}}
            onHoverEnd={event => {}}
          >
            <h2>{item.title}</h2>
          </motion.div>
        );        
      })}
    </div>
  );
};

export default PortfolioItems;