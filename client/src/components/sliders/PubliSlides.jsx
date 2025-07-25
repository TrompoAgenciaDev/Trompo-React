import React, { useRef, useEffect, useState } from "react";
import "../../assets/styles/publi-slider.css";

const slides = [
  [
    { href: "https://www.google.com", img: "/assets/portfolioImg/volvo.jpg", alt: "Volvo" },
    { href: "https://www.bing.com", img: "/assets/portfolioImg/menta.png", alt: "Menta" },
  ],
  [
    { href: "https://www.yahoo.com", img: "/assets/portfolioImg/femesa.jpg", alt: "Femesa" },
    { href: "https://www.duckduckgo.com", img: "/assets/portfolioImg/ranko.jpg", alt: "Ranko" },
  ],
];

export default function PubliSlides() {
  const containerRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(2);

  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      if (width > 900) setSlidesToShow(3);
      else setSlidesToShow(2);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleSlides = slides.slice(0, slidesToShow);

  return (
    <div ref={containerRef} className="publi-slider-container">
      {visibleSlides.map((slide, idx) => (
        <div key={idx} className="publi-slide">
          {slide.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="publi-slide-item"
              style={{
                backgroundImage: `url(${item.img})`,
              }}
              title={item.alt}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
