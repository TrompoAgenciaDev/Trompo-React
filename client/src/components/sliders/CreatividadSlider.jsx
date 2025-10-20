import { useEffect, useRef, useState } from "react";
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

/* Inner slider infinito 4:3 */
function InnerAutoSlider({ list, interval = 2200, direction = 1, draggingRef }) {
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

  const REPEAT = 5;
  const extended = Array.from({ length: REPEAT }, () => list).flat();
  const baseLen = len;
  const middleIndex = baseLen * Math.floor(REPEAT / 2);

  const [idx, setIdx] = useState(middleIndex);
  const [anim, setAnim] = useState(true);
  const t = useRef(null);

  useEffect(() => {
    t.current = setInterval(() => {
      if (!draggingRef?.current) {
        setIdx((p) => p + (direction > 0 ? 1 : -1));
        setAnim(true);
      }
    }, interval);
    return () => clearInterval(t.current);
  }, [interval, direction, draggingRef]);

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

  return (
    <div
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

/* Video único por slide 4:3 */
function VideoSlide({ src }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
      }}
    >
      <video
        src={src}
        muted
        playsInline
        autoPlay
        loop
        preload="none"
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

export default function CreatividadSlider({ tipo = "mix" }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(() =>
    typeof window === "undefined" ? 1 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1
  );
  const [paused, setPaused] = useState(false);
  const [touchDelay, setTouchDelay] = useState(false);
  const timer = useRef(null);
  const draggingRef = useRef(false);

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

        // repetición para carrusel infinito
        const REPEAT = 5;
        const expanded = Array.from({ length: REPEAT }, () => baseSlides).flat();
        if (mounted) setSlides(expanded);
        if (mounted) setIndex(baseSlides.length * Math.floor(REPEAT / 2));
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

  useEffect(() => {
    if (paused || slides.length === 0 || draggingRef.current || touchDelay) return;
    
    // Intervalo más rápido en mobile
    const interval = window.innerWidth < 768 ? 2000 : 4000;
    timer.current = setInterval(() => setIndex((p) => p + 1), interval);
    return () => clearInterval(timer.current);
  }, [paused, slides.length, touchDelay]);

  const slideWidthPct = 100 / visible;
  const offsetPct = index * slideWidthPct;

  const next = () => {
    clearInterval(timer.current);
    setIndex((p) => p + 1);
  };
  const prev = () => {
    clearInterval(timer.current);
    setIndex((p) => p - 1);
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
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {slides.map((item, i) => (
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
                <VideoSlide src={item.src} />
              ) : (
                <InnerAutoSlider list={item.images} interval={2200} direction={1} draggingRef={draggingRef} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
