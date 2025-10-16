import React, { useRef, useEffect, useState } from "react";
import LazyImage from "../LazyImage";
import "../../assets/styles/publi-slider.css";

const slides = [
  {
    href: "https://www.google.com",
    img: "/assets/instagramPublis/search-display.webp",
    alt: "ADS",
  },
  {
    href: "https://www.bing.com",
    img: "/assets/instagramPublis/raulito.webp",
    alt: "Mermeladas Raulito",
  },
  {
    href: "https://www.duckduckgo.com",
    img: "/assets/instagramPublis/tono-de-voz.webp",
    alt: "Trompo Tono de Voz",
  },
];

export default function PubliSlides() {
  const containerRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(2);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= 768) setSlidesToShow(3);
      else setSlidesToShow(2);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleSlides = slides.slice(0, slidesToShow);

  return (
    <div ref={containerRef} className="publi-slider-container">
      {visibleSlides.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="publi-slide"
        >
          <LazyImage 
            src={item.img} 
            alt={item.alt}
            placeholder="#f0f0f0"
          />
        </a>
      ))}
    </div>
  );
}
