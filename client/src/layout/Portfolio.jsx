import { useState } from "react";
// import { useHover } from "../context/HoverContext";
import useJsonConsulting from "../hooks/useJsonConsulting";
import PortfolioCarruselItems from "../components/carrusels/PortfolioCarruselItems";

// styles
import '../assets/styles/portfolio.css';

function Portfolio() {
  // const { handleHover, handleLeave } = useHover();

  const [quantity, setQuantity] = useState(12);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [type] = useState("portfolio"); // Definimos el tipo

  const { items, loading, error } = useJsonConsulting({
    quantity,
    category,
    tag,
    type,
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  // Duplicamos los elementos para un carrusel infinito
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items];


  return (
    <div className="portfolio-section">
      <div className="portfolio-carrusel">
        {duplicatedItems.map((item, index) => (
          <PortfolioCarruselItems
            key={`${item.id}-${index}`}
            id={item.id}
            title={item.title}
            type="portfolio"
            backgroundImage={item.featured_image}
            enlacePortfolio={item.enlacePortfolio}
            // onMouseEnter={() => handleHover(item.id)}
            // onMouseLeave={handleLeave}
          />
        ))}
      </div>
    </div>
  );
}

export default Portfolio;