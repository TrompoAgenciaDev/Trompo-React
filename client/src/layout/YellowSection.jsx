import React, { useState } from "react";
import { motion } from "motion/react";

import "../assets/styles/yellowSection.css";
import useFetchServiceFaq from "../hooks/useFetchServiceFaq";

function YellowSection({ type }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const { items, loading, error } = useFetchServiceFaq({ category: type });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const countList = (id) => {    
    return id += 1;
  }

  return (
    <section className="bg-yellow full-container">
      {type === "services" && (
        <>
          <div className="banner full-container">
            <picture className="full-container mobile-banner">
              <source srcSet="/banner1-home-mobile.webp" type="image/webp" />
              <source srcSet="/banner1-home-mobile.png" type="image/png" />
              <img src="/banner-home.png" alt="Banner Home" />
            </picture>
            <picture className="full-container desktop-banner">
              <source srcSet="/banner1-home-desktop.webp" type="image/webp" />
              <source srcSet="/banner1-home-desktop.png" type="image/png" />
              <img src="/banner1-home-desktop.png" alt="Banner Home" />
            </picture>
          </div>

          <div className="container">
            <p className="services-text">
              Con un Equipo interdisciplinario y años de experiencia, nos
              especializamos en entender las necesidades de cada cliente y
              convertirlas en <span className="bold">oportunidades</span> que
              impulsen su crecimiento.
            </p>
          </div>

          <div className="container">
            <div className="grid-services">
              {items.map((item) => (
                <div className="service-section-row" key={item.id}>
                  <div className="service-grid">
                    <span className="service-title-grid">
                      <span className="title-grid title-grid-hover">
                        {item.title}
                        <span className="title-grid title-grid-hover hover-show">
                          {item.subtitle}
                        </span>
                      </span>
                    </span>
                    <div className="content-text-grid hover-show">
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
                          stroke="#1E1E1E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {type === "faqs" && (
        <div className="container">
          <div className="accordion">
            {items.map((item, index) => (
              <div className="accordion-item" key={item.id}>
                <div className="accordion-grid">
                  <button
                    onClick={() => toggleItem(index)}
                    className={`accordion-title ${openIndex === index ? "accordion-item-active" : ""}`}
                  >
                    <span>{countList(item.id)}. {' '}</span>
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
      )}
    </section>
  );
}

export default YellowSection;
