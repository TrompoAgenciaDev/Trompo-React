import { useRef, useState } from "react";
import { motion } from "framer-motion";
import usePortfolioData from "../hooks/usePortfolioData";
import "../assets/styles/portfolio.css";

function Portfolio3d({ location = "desarrollo", categoria }) {
  const draggingRef = useRef(false);
  const quantity = 12;

  const { items, loading, error } = usePortfolioData({
    location,
    category: categoria || undefined,
    limit: quantity,
  });

  const duplicatedItems = Array.from({ length: 5 }, () => items).flat();

  const PortfolioCarruselItem = ({
    id, title, backgroundImage, enlacePortfolio, draggingRef,
  }) => {
    const [velocityReduction, setVelocityReduction] = useState(50);
    const SlowSpeed = () => setVelocityReduction(5);
    const NormalSpeed = () => setVelocityReduction(260);

    const handleClick = (e) => {
      if (draggingRef.current) { e.preventDefault(); e.stopPropagation(); }
    };

    return (
      <motion.a
        onMouseOver={SlowSpeed}
        onMouseLeave={NormalSpeed}
        animate={{ x: ["-0%", "-300%"] }}
        transition={{ ease: "linear", duration: velocityReduction, repeat: Infinity }}
        href={location === "desarrollo" ? enlacePortfolio : undefined}
        target="_blank"
        rel="noreferrer"
        data-id={id}
        className="portfolio-card"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        onClick={handleClick}
        draggable={false}
      >
        <h2 className="portfolio-title">{title}</h2>
      </motion.a>
    );
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="portfolio-section">
      <div className="title-section" />
      <div className="portfolio-carrusel">
        <motion.div
          drag="x"
          dragElastic={0.05}
          dragMomentum
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          style={{ display: "flex", gap: "20px", cursor: "grab", willChange: "transform",
                   minWidth: "max-content", height: "100%", alignItems: "center" }}
          whileTap={{ cursor: "grabbing" }}
          onDragStart={() => { draggingRef.current = true; }}
          onDragEnd={() => { requestAnimationFrame(() => { draggingRef.current = false; }); }}
        >
          {duplicatedItems.map((item, index) => {
            if (categoria && !item.categories?.includes(categoria)) return null;
            return (
              <PortfolioCarruselItem
                key={`${item.id}-${index}`}
                id={item.id}
                title={item.title}
                backgroundImage={item.vertical_image}
                enlacePortfolio={item.enlacePortfolio}
                draggingRef={draggingRef}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default Portfolio3d;
