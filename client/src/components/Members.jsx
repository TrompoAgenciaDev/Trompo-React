import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMembers from "../hooks/useMembers";
import membersData from "../json/members.json";

import "../assets/styles/members.css";

export default function Members() {
  const { current, goNext, goPrev, setIndex } = useMembers(membersData);

  // Variants para animar slide left/right
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // Controlamos la dirección de animación para framer-motion drag
  const [direction, setDirection] = React.useState(1);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection > 0) goNext();
    else goPrev();
  };

  return (
    <div className="slider-container" style={{ overflow: "hidden" }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={membersData[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.x < -100) {
              paginate(1);
            } else if (offset.x > 100) {
              paginate(-1);
            }
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            userSelect: "none",
            cursor: "grab",
          }}
        >
          {/* Texto */}
          <div className="text-slide" style={{ flex: 1, padding: "1rem" }}>
            <h3>
              <strong>{membersData[current].name}</strong> {membersData[current].position}
            </h3>
            <p>{membersData[current].portfolio}</p>
          </div>

          {/* Imagen */}
          <div className="image-slide" style={{ flex: 1 }}>
            <img
              src={membersData[current].featured_image}
              alt={membersData[current].name}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flechas */}
      <button
        onClick={() => paginate(-1)}
        aria-label="Anterior"
        style={{ position: "absolute", left: 0, top: "50%" }}
      >
        &#8592;
      </button>
      <button
        onClick={() => paginate(1)}
        aria-label="Siguiente"
        style={{ position: "absolute", right: 0, top: "50%" }}
      >
        &#8594;
      </button>
    </div>
  );
}
