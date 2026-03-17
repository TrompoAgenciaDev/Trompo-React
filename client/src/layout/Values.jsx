import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import Icons from "../components/Icons";
import useFetchValues from "../hooks/useFetchValues";

import "../assets/styles/values.css";

function Collapse({ isOpen, children }) {
  const innerRef = useRef(null);

  return (
    <motion.div
      initial={false}
      animate={
        isOpen
          ? { maxHeight: "1000px", opacity: 1 }
          : { maxHeight: 0, opacity: 0 }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
      aria-hidden={!isOpen}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}

function Values() {
  const { values, loading, error } = useFetchValues();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (loading) return <div>Cargando valores...</div>;
  if (error) return <div>{typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error)}</div>;
  if (!values.length) return <div>No hay valores disponibles.</div>;

  return (
    <section className="full-container bg-yellow values-section">
      <div className="container grid-container">
        <div className="grid-item">
          <h2>¿Por qué contratar una agencia especializada?</h2>
          <p>
            En Argentina es común ver proyectos web realizados con bajos
            presupuestos y sin planificación técnica, lo que genera sitios mal
            desarrollados, poco escalables y difíciles de mantener.
          </p>
          <p>
            En Trompo ofrecemos una alternativa profesional, con beneficios
            reales:
          </p>
        </div>

        <div className="grid-item">
          {values.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.id}
                className={`grid-value-content ${isOpen ? "item-active" : ""}`}
                onClick={() => toggleItem(index)}
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0.9,
                  backgroundColor: isOpen ? "#FEE070" : "rgba(0,0,0,0)",
                }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeOut" },
                  backgroundColor: { duration: 0.1, ease: "easeOut" },
                }}
              >
                <div className="icon-grid">
                  <Icons iconName={item.icon} />
                </div>

                <div className="content-grid">
                  <motion.span
                    className="title-item-content"
                    initial={false}
                    animate={{ scale: isOpen ? 0.95 : 1 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    style={{
                      display: "inline-block",
                      transformOrigin: "left center",
                    }}
                  >
                    {item.title}
                  </motion.span>

                  <Collapse isOpen={isOpen}>
                    <p className="text-item-content">{item.content}</p>
                  </Collapse>
                </div>

                <span className="icon-content" aria-hidden="true">
                  <svg
                    height="21"
                    viewBox="0 0 21 21"
                    width="21"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5.5 10.5h10" />
                      <path d="m10.5 5.5v10" />
                    </g>
                  </svg>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Values;
