import React, { useRef, useEffect, useState } from "react";
import "../../assets/styles/publi-slider.css";

const slides = [
  {
    href: "https://www.google.com",
    img: "/assets/portfolioImg/volvo.jpg",
    alt: "Volvo",
  },
  {
    href: "https://www.bing.com",
    img: "/assets/portfolioImg/menta.png",
    alt: "Menta",
  },
  {
    href: "https://www.duckduckgo.com",
    img: "/assets/portfolioImg/ranko.jpg",
    alt: "Ranko",
  },
];

export default function PubliSlides() {
  const containerRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(2);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= 1024) setSlidesToShow(3);
      else if(width >= 768) setSlidesToShow(2); 
      else setSlidesToShow(1);
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
          style={{
            backgroundImage: `url(${item.img})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          title={item.alt}
        />
      ))}
    </div>
  );
}
