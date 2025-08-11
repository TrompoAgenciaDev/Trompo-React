import React, { useState } from "react";
import { motion } from "motion/react";

function AccordionAbout() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  return (
    <div className="accordion">
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
    </div>
  );
}

export default AccordionAbout;
