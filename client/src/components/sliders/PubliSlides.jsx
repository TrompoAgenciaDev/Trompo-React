import React, { useRef, useEffect, useState } from "react";

// Ejemplo de datos: cada slide puede tener hasta 2 enlaces
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

  // Solo mostrar la cantidad de slides que entran
  const visibleSlides = slides.slice(0, slidesToShow);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "flex",
        gap: 16,
        justifyContent: "center",
        alignItems: "stretch",
        minHeight: 120,
        margin: "24px 0",
      }}
    >
      {visibleSlides.map((slide, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "#f7f7f7",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            padding: 8,
          }}
        >
          {slide.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                height: 90,
                background: `url(${item.img}) center/cover no-repeat`,
                borderRadius: 8,
                marginBottom: i === slide.length - 1 ? 0 : 8,
                minHeight: 90,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                transition: "box-shadow 0.2s",
              }}
              title={item.alt}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
