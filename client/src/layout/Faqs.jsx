import React, { useState } from "react";
import { motion } from "motion/react";

import "../assets/styles/faqs.css";
import useFetchFaqs from "../hooks/useFetchFaqs";

function Faqs() {
  const [openIndex, setOpenIndex] = useState(-1);

  const { items, loading, error } = useFetchFaqs();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const countList = (id) => id + 1;

  return (
    <section className="bg-yellow full-container faqs">
      <div className="container">
        <div className="accordion-title-section">
          Preguntas Frecuentes
        </div>
        <div className="accordion">
          {items.map((item, index) => (
            <div className="accordion-item" key={item.id}>
              <div className="accordion-grid">
                <button
                  onClick={() => toggleItem(index)}
                  className={`accordion-title ${
                    openIndex === index ? "accordion-item-active" : ""
                  }`}
                >
                  <span>{countList(item.id)}. </span>
                  {item.question}
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    openIndex === index
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
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
