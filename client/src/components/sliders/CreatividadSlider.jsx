import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

// Carga dinámica desde portfolio.json
async function fetchCreatividadData() {
  const ts = Date.now();
  const res = await fetch(`${import.meta.env.BASE_URL}portfolio.json?v=${ts}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo cargar portfolio.json");
  const data = await res.json();
  return Array.isArray(data?.creatividad) ? data.creatividad : [];
}

/* Inner slider infinito 4:3 con lazy loading */
function InnerAutoSlider({ list, interval = 2200, direction = 1, draggingRef, isVisible }) {
  const len = list.length;
  if (len <= 1) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
        }}
      >
        <img
          src={list[0]}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  // Reducir copias de 5 a 3 para mejor rendimiento
  const REPEAT = 3;
  const extended = Array.from({ length: REPEAT }, () => list).flat();
  const baseLen = len;
  const middleIndex = baseLen * Math.floor(REPEAT / 2);

  const [idx, setIdx] = useState(middleIndex);
  const [anim, setAnim] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const t = useRef(null);
  const containerRef = useRef(null);

  // Lazy loading: solo renderizar cuando está visible
  useEffect(() => {
    if (!isVisible || shouldRender) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;
    
    t.current = setInterval(() => {
      if (!draggingRef?.current) {
        setIdx((p) => p + (direction > 0 ? 1 : -1));
        setAnim(true);
      }
    }, interval);
    return () => clearInterval(t.current);
  }, [interval, direction, draggingRef, shouldRender]);

  useEffect(() => {
    const min = baseLen * 2;
    const max = baseLen * (REPEAT - 2);
    if (idx < min || idx > max) {
      const mod = ((idx % baseLen) + baseLen) % baseLen;
      setAnim(false);
      setIdx(middleIndex + mod);
    }
  }, [idx, baseLen, REPEAT, middleIndex]);

  const offsetPct = idx * 100;

  if (!shouldRender) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0, display: "flex" }}
        animate={{ x: `-${offsetPct}%` }}
        transition={
          anim ? { duration: 0.45, ease: "easeOut" } : { duration: 0 }
        }
      >
        {extended.map((src, i) => (
          <div key={i} style={{ width: "100%", flex: "0 0 100%" }}>
            <LazyImage
              src={src}
              alt=""
              placeholder="#f0f0f0"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* Video único por slide 4:3 con lazy loading */
function VideoSlide({ src, isVisible }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Si ya está visible desde el prop, cargar inmediatamente
    if (isVisible && !shouldLoad) {
      setShouldLoad(true);
      return;
    }
    
    if (shouldLoad || !containerRef.current) return;
    
    // Cargar video solo cuando está visible o cerca de serlo
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isVisible, shouldLoad]);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
      }}
    >
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
    </div>
  );
}

export default function CreatividadSlider({ tipo = "mix" }) {
  const [slides, setSlides] = useState([]);
  const [baseSlidesLength, setBaseSlidesLength] = useState(0);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(() =>
    typeof window === "undefined" ? 1 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1
  );
  const [paused, setPaused] = useState(false);
  const [touchDelay, setTouchDelay] = useState(false);
  const timer = useRef(null);
  const draggingRef = useRef(false);
  const isResettingRef = useRef(false);

  // Carga inicial desde JSON y preparación de slides
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await fetchCreatividadData();
        const brandingSlides = [];
        const multimediaSlides = [];
        const brandingWebSlides = [];

        const tipoLower = (tipo || "mix").toLowerCase();
        const isTipoMix = tipoLower === "mix" || tipoLower === "slider";

        const matchesTipo = (cats) => {
          const c = Array.isArray(cats) ? cats.map((x) => String(x).toLowerCase()) : [];
          const hasSlider = c.includes("slider");
          if (!hasSlider) return false;
          if (isTipoMix) return true;
          if (tipoLower === "branding") return c.includes("branding") && !c.includes("branding-web");
          if (tipoLower === "multimedia") return c.includes("multimedia");
          if (tipoLower === "branding-web") return c.includes("branding-web");
          return false;
        };

        for (const it of items) {
          const categories = Array.isArray(it.category) ? it.category : [];
          const isCreatividad = categories.includes("creatividad");
          const isBranding = categories.includes("branding") && !categories.includes("branding-web");
          const isMultimedia = categories.includes("multimedia");
          const isBrandingWeb = categories.includes("branding-web");

          if (!isCreatividad || !matchesTipo(categories)) continue;

          // Videos (multimedia)
          if (isMultimedia && it.featured_video) {
            multimediaSlides.push({ kind: "video", src: `${import.meta.env.BASE_URL}${it.featured_video}` });
            continue;
          }

          // Videos (branding-web)
          if (isBrandingWeb && it.featured_video) {
            brandingWebSlides.push({ kind: "video", src: `${import.meta.env.BASE_URL}${it.featured_video}` });
            continue;
          }

          // Branding: usar featured + gallery
          if (isBranding) {
            const base = [];
            if (it.featured_image) base.push(`${import.meta.env.BASE_URL}${it.featured_image}`);
            if (Array.isArray(it.gallery)) {
              for (const g of it.gallery) base.push(`${import.meta.env.BASE_URL}${g}`);
            }
            if (base.length > 0) {
              brandingSlides.push({ kind: "image", images: base });
            }
          }
        }

        let baseSlides = [];
        if (tipoLower === "branding") baseSlides = brandingSlides;
        else if (tipoLower === "multimedia") baseSlides = multimediaSlides;
        else if (tipoLower === "branding-web") baseSlides = brandingWebSlides;
        else {
          // Modo mix: intercalar todas las categorías
          const imgCount = brandingSlides.length;
          const vidCount = multimediaSlides.length;
          const webCount = brandingWebSlides.length;
          const maxLen = Math.max(imgCount, vidCount, webCount);
          
          for (let i = 0; i < maxLen; i++) {
            if (imgCount) baseSlides.push(brandingSlides[i % imgCount]);
            if (vidCount) baseSlides.push(multimediaSlides[i % vidCount]);
            if (webCount) baseSlides.push(brandingWebSlides[i % webCount]);
          }
        }

        // repetición para carrusel infinito (reducido de 5 a 3 para mejor rendimiento)
        const REPEAT = 3;
        const expanded = Array.from({ length: REPEAT }, () => baseSlides).flat();
        const middleIndex = baseSlides.length * Math.floor(REPEAT / 2);
        if (mounted) {
          setSlides(expanded);
          setBaseSlidesLength(baseSlides.length);
          setIndex(middleIndex);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setVisible(4);
      else if (window.innerWidth >= 768) setVisible(2);
      else setVisible(1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Función helper para verificar y resetear el índice si es necesario
  const checkAndResetIndex = useCallback((currentIndex, direction = 1) => {
    if (baseSlidesLength === 0 || isResettingRef.current) return currentIndex;
    
    const REPEAT = 3;
    const middleStart = baseSlidesLength * Math.floor(REPEAT / 2);
    const middleEnd = baseSlidesLength * (Math.floor(REPEAT / 2) + 1);
    
    if (direction > 0) {
      // Avanzando: si se acerca al final (último 15% del último bloque), resetear
      const lastBlockStart = baseSlidesLength * (REPEAT - 1);
      const threshold = lastBlockStart + (baseSlidesLength * 0.85);
      if (currentIndex >= threshold) {
        isResettingRef.current = true;
        setTimeout(() => {
          isResettingRef.current = false;
        }, 50);
        return middleStart;
      }
    } else {
      // Retrocediendo: si se acerca al inicio (primer 15% del primer bloque), resetear
      const threshold = baseSlidesLength * 0.15;
      if (currentIndex <= threshold) {
        isResettingRef.current = true;
        setTimeout(() => {
          isResettingRef.current = false;
        }, 50);
        return middleEnd - 1;
      }
    }
    
    return currentIndex;
  }, [baseSlidesLength]);

  useEffect(() => {
    if (paused || slides.length === 0 || draggingRef.current || touchDelay || isResettingRef.current) return;
    
    // Intervalo más rápido en mobile
    const interval = window.innerWidth < 768 ? 2000 : 4000;
    timer.current = setInterval(() => {
      setIndex((p) => {
        const newIndex = p + 1;
        return checkAndResetIndex(newIndex, 1);
      });
    }, interval);
    return () => clearInterval(timer.current);
  }, [paused, slides.length, touchDelay, checkAndResetIndex]);

  const slideWidthPct = 100 / visible;
  const offsetPct = index * slideWidthPct;

  // Calcular qué slides están visibles o cerca de serlo (buffer de 2 slides a cada lado)
  const visibleRange = useMemo(() => {
    const buffer = 2;
    const start = Math.max(0, index - buffer);
    const end = Math.min(slides.length - 1, index + visible + buffer);
    return { start, end };
  }, [index, visible, slides.length]);

  const next = () => {
    clearInterval(timer.current);
    setIndex((p) => checkAndResetIndex(p + 1, 1));
  };
  const prev = () => {
    clearInterval(timer.current);
    setIndex((p) => checkAndResetIndex(p - 1, -1));
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button
        aria-label="Prev"
        onClick={prev}
        style={{
          position: "absolute",
          left: -50,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          borderRadius: 999,
          width: 40,
          height: 40,
          zIndex: 10,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
        >
          <path
            d="M31.9687 16.1926L1.08382 16.1926M1.08382 16.1926L16.5263 31.3777M1.08382 16.1926L16.5263 1.00751"
            stroke="#1D1D1B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        aria-label="Next"
        onClick={next}
        style={{
          position: "absolute",
          right: -50,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          borderRadius: 999,
          width: 40,
          height: 40,
          zIndex: 10,
        }}
      >
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
      </button>

      <div
        style={{ 
          position: "relative", 
          overflow: "hidden", 
          width: "100%",
          margin: "0 auto"
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => {
          // Solo aplicar retraso en mobile
          if (window.innerWidth < 768) {
            setTouchDelay(true);
            clearInterval(timer.current);
            setTimeout(() => {
              setTouchDelay(false);
            }, 1000);
          }
        }}
      >
        <motion.div
          className="showcase-track"
          style={{ 
            display: "flex",
            width: "100%",
            alignItems: "center",
            willChange: "transform"
          }}
          animate={{ x: `-${offsetPct}%` }}
          transition={isResettingRef.current ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
        >
          {slides.map((item, i) => {
            const isVisible = i >= visibleRange.start && i <= visibleRange.end;
            
            return (
              <div
                key={`${i}`}
                style={{
                  width: `${slideWidthPct}%`,
                  flex: `0 0 ${slideWidthPct}%`,
                  padding: window.innerWidth < 768 ? "4px" : window.innerWidth < 1024 ? "6px" : "8px",
                  boxSizing: "border-box",
                  minWidth: 0,
                }}
              >
                {item.kind === "video" ? (
                  <VideoSlide src={item.src} isVisible={isVisible} />
                ) : (
                  <InnerAutoSlider 
                    list={item.images} 
                    interval={2200} 
                    direction={1} 
                    draggingRef={draggingRef}
                    isVisible={isVisible}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
