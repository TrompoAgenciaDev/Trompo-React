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
    const [velocityReduction, setVelocityReduction] = useState(12);
    const SlowSpeed = () => setVelocityReduction(2);
    const NormalSpeed = () => setVelocityReduction(40);

    const handleClick = (e) => {
      // Si está arrastrando, prevenir la navegación
      if (draggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Solo para desarrollo, abrir en nueva pestaña de forma segura
      if (location === "desarrollo" && enlacePortfolio) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent?.stopImmediatePropagation();
        // Usar window.open solo en respuesta directa a un click del usuario
        // Esto evita que los adblockers lo detecten como popup automático
        window.open(enlacePortfolio, '_blank', 'noopener,noreferrer');
        return false;
      }
    };

    // Para desarrollo, usar div en lugar de <a> para evitar navegación
    const Component = location === "desarrollo" ? motion.div : motion.a;
    const linkProps = location === "desarrollo"
      ? {}
      : {
        href: enlacePortfolio || "#",
        rel: "noopener noreferrer"
      };

    return (
      <Component
        onMouseOver={SlowSpeed}
        onMouseLeave={NormalSpeed}
        animate={{ x: ["-0%", "-300%"] }}
        transition={{ ease: "linear", duration: velocityReduction, repeat: Infinity }}
        {...linkProps}
        data-id={id}
        className="portfolio-card"
        style={{ backgroundImage: `url(${backgroundImage})`, cursor: location === "desarrollo" ? "pointer" : undefined }}
        onClick={handleClick}
        draggable={false}
      >
        <h2 className="portfolio-title">{title}</h2>
      </Component>
    );
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error)}</p>;

  return (
    <div className="portfolio-section">
      <div className="title-section" />
      <div className="portfolio-carrusel">
        <motion.div
          drag="x"
          dragElastic={0.05}
          dragMomentum
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          style={{
            display: "flex", gap: "20px", cursor: "grab", willChange: "transform",
            minWidth: "max-content", height: "100%", alignItems: "center"
          }}
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
