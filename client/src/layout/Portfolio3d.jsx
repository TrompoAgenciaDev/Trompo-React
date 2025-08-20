import { useState } from "react";
import { motion } from "framer-motion";
import useJsonConsulting from "../hooks/useJsonConsulting";

// styles
import "../assets/styles/portfolio.css";

function resolveUrl(src) {
  if (!src) return "";
  if (/^(https?:|data:|mailto:|tel:)/i.test(src)) return src;
  const cleaned = src.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${cleaned}`;
}

function Portfolio3d() {
  const [quantity] = useState(12);
  const [category] = useState("");
  const [tag] = useState("");
  const [type] = useState("portfolio");

  const { items, loading, error } = useJsonConsulting({
    quantity,
    category,
    tag,
    type,
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  // Duplicamos para efecto infinito (sin tocar tu layout ni estilos)
  const duplicatedItems = [
    ...items, ...items, ...items, ...items, ...items, ...items,
    ...items, ...items, ...items, ...items, ...items, ...items,
    ...items, ...items, ...items, ...items, ...items, ...items
  ];

  const PortfolioCarruselItem = ({ id, title, backgroundImage, enlacePortfolio }) => {
    const [velocityReduction, setVelocityReduction] = useState(50);
    const SlowSpeed = () => setVelocityReduction(5);
    const NormalSpeed = () => setVelocityReduction(260);

    return (
      <motion.div
        onMouseOver={SlowSpeed}
        onMouseLeave={NormalSpeed}
        animate={{ x: ["-0%", "-300%"] }}
        transition={{
          ease: "linear",
          duration: velocityReduction,
          repeat: Infinity,
        }}
        // href={resolveUrl(enlacePortfolio)}
        data-id={id}
        className="portfolio-card"
        style={{ backgroundImage: `url(${resolveUrl(backgroundImage)})` }}
      >
        <h2 className="portfolio-title">{title}</h2>
      </motion.div>
    );
  };

  return (
    <div className="portfolio-section">
      <div className="title-section"></div>

      <div className="portfolio-carrusel">
        <motion.div
          drag="x"
          dragElastic={0.05}
          dragMomentum={true}
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          style={{
            display: "flex",
            gap: "20px",
            cursor: "grab",
            willChange: "transform",
            minWidth: "max-content",
            height: "100%",
            alignItems: "center",
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          {duplicatedItems.map((item, index) => (
            <PortfolioCarruselItem
              key={`${item.id}-${index}`}
              id={item.id}
              title={item.title}
              backgroundImage={item.featured_image}
              enlacePortfolio={item.enlacePortfolio}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Portfolio3d;
