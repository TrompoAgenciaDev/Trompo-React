import React, { useState } from "react";
import { motion } from "motion/react";
import "../assets/styles/faqs.css";
import useFetchFaqs from "../hooks/useFetchFaqs";

function Faqs({ location = "home" }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const { items, loading, error } = useFetchFaqs(location);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const toggleItem = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <section className="bg-yellow full-container faqs">
      <div className="container">
        <div className="accordion-title-section">Preguntas Frecuentes</div>
        <div className="accordion">
          {items.map((item, index) => (
            <div className="accordion-item" key={item.id ?? index}>
              <div className="accordion-grid">
                <button
                  onClick={() => toggleItem(index)}
                  className={`accordion-title ${openIndex === index ? "accordion-item-active" : ""}`}
                >
                  <span>{index + 1}. </span>
                  {item.question}
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="full-container accordion-content"
                >
                  <div
                    className="accordion-text"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faqs;
