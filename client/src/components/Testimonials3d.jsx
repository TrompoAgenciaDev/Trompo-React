import { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css";

gsap.registerPlugin(Draggable);

const AUTOPLAY_DURATION = 20; // Duración en segundos para rotar 180 grados
const REPEAT = 2; // Duplicar items para loop infinito

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export default function Testimonials3D({ size = null }) {
  const { testimonials, loading, error } = useFetchTestimonials();
  const total = testimonials.length;
  
  // Refs
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const moverRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTweenRef = useRef(null);
  const draggableRef = useRef(null);
  const dragProxyRef = useRef(null);
  const slide3dRefs = useRef([]);
  
  // Estado
  const [viewportHeight, setViewportHeight] = useState(0);
  
  // Valores de rotación cilíndrica
  const rotation = useRef(0);
  const radius = useRef(0);
  
  // Duplicar items para loop infinito
  const cloned = useMemo(
    () => (total ? Array.from({ length: REPEAT }, () => testimonials).flat() : []),
    [testimonials, total]
  );
  
  // Calcular altura del viewport y radio
  useEffect(() => {
    if (!viewportRef.current) return;
    
    const measureViewportHeight = () => {
      if (viewportRef.current) {
        const height = viewportRef.current.offsetHeight;
        setViewportHeight(height);
        radius.current = height / 2;
      }
    };
    
    measureViewportHeight();
    window.addEventListener('resize', measureViewportHeight);
    
    return () => window.removeEventListener('resize', measureViewportHeight);
  }, []);
  
  // Inicializar refs de slides
  useEffect(() => {
    slide3dRefs.current = slide3dRefs.current.slice(0, cloned.length);
  }, [cloned.length]);
  
  // Función para renderizar slides en 3D (estable, misma referencia)
  const renderSlides = useRef(() => {
    if (radius.current === 0 || cloned.length === 0) return;
    
    const totalSlides = cloned.length;
    
    slide3dRefs.current.forEach((slide3dEl, index) => {
      if (!slide3dEl) return;
      
      // Ángulo base fijo para cada slide
      const baseAngle = (index / totalSlides) * 180;
      
      // Ángulo final = baseAngle + rotación global
      const finalAngle = baseAngle + rotation.current;
      
      // Aplicar transformación 3D
      gsap.set(slide3dEl, {
        rotateX: finalAngle,
        transformOrigin: "center center",
        z: radius.current,
        force3D: true
      });
    });
  }).current;
  
  // Crear tween infinito para autoplay
  useEffect(() => {
    if (!total || radius.current === 0) return;
    
    // Matar tween anterior si existe
    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }
    
    // Crear objeto con propiedad current para animar
    const rotationObj = { current: rotation.current };
    
    // Crear tween infinito que rota 180 grados
    scrollTweenRef.current = gsap.to(rotationObj, {
      current: `+=180`,
      duration: AUTOPLAY_DURATION,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        rotation.current = rotationObj.current;
        renderSlides();
      }
    });
    
    return () => {
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
    };
  }, [total, radius.current, cloned.length]);
  
  // Drag con Draggable de GSAP usando viewport como elemento draggable
  useEffect(() => {
    if (!viewportRef.current || !total || !scrollTweenRef.current) return;
    
    const viewport = viewportRef.current;
    const scrollTween = scrollTweenRef.current;
    let startRotation = 0;
    
    // Matar draggable anterior si existe
    if (draggableRef.current) {
      draggableRef.current.kill();
    }
    
    // Crear Draggable en viewport que solo modifica rotation (NO mueve elementos)
    draggableRef.current = Draggable.create(viewport, {
      type: "y",
      inertia: false,
      onDragStart: () => {
        scrollTween.pause();
        startRotation = rotation.current;
      },
      onDrag: function() {
        // Calcular rotación basada en el drag
        // Convertir movimiento Y a rotación en X
        const dragDelta = this.y - this.startY;
        // Convertir píxeles a grados
        // Radio en píxeles representa 90 grados del cilindro
        const pixelsPerDegree = radius.current / 90;
        const rotationDelta = dragDelta / pixelsPerDegree;
        
        // Actualizar rotación desde el punto inicial
        rotation.current = startRotation + rotationDelta;
        
        // Resetear posición del draggable para evitar movimiento físico
        this.y = 0;
        this.startY = 0;
        gsap.set(viewport, { y: 0, clearProps: "y" });
        
        // Renderizar slides
        renderSlides();
      },
      onDragEnd: () => {
        // Actualizar el tween para continuar desde el ángulo actual
        if (scrollTweenRef.current) {
          const rotationObj = { current: rotation.current };
          scrollTweenRef.current.kill();
          scrollTweenRef.current = gsap.to(rotationObj, {
            current: `+=180`,
            duration: AUTOPLAY_DURATION,
            ease: "none",
            repeat: -1,
            onUpdate: () => {
              rotation.current = rotationObj.current;
              renderSlides();
            }
          });
        }
      }
    })[0];
    
    return () => {
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }
    };
  }, [total, radius.current, scrollTweenRef.current, renderSlides]);
  
  // Test visual obligatorio: verificar que el 3D funciona
  useEffect(() => {
    if (slide3dRefs.current[0] && viewportRef.current && containerRef.current) {
      const slide3d0 = slide3dRefs.current[0];
      const viewport = viewportRef.current;
      const container = containerRef.current;
      
      // Aplicar transform de prueba
      gsap.set(slide3d0, { 
        rotateX: 60, 
        z: 300,
        force3D: true,
        transformOrigin: "center center"
      });
      
      // Logging para diagnóstico
      setTimeout(() => {
        const slide3dStyle = window.getComputedStyle(slide3d0);
        const viewportStyle = window.getComputedStyle(viewport);
        const containerStyle = window.getComputedStyle(container);
        
        console.log('=== TEST 3D DIAGNÓSTICO ===');
        console.log('slide3d transform:', slide3dStyle.transform);
        console.log('viewport perspective:', viewportStyle.perspective);
        console.log('container transform:', containerStyle.transform);
        console.log('viewport transform:', viewportStyle.transform);
        console.log('viewport transformStyle:', viewportStyle.transformStyle);
        console.log('slide3d transformStyle:', slide3dStyle.transformStyle);
        
        // Verificar si hay flattening
        if (slide3dStyle.transform === 'none' || slide3dStyle.transform === 'matrix(1, 0, 0, 1, 0, 0)') {
          console.warn('⚠️ FLATTENING DETECTADO: slide3d no tiene transform aplicado');
        }
        if (viewportStyle.perspective === 'none' || viewportStyle.perspective === '0px') {
          console.warn('⚠️ PERSPECTIVE NO APLICADA: viewport no tiene perspective');
        }
        if (containerStyle.transform !== 'none') {
          console.warn('⚠️ CONTAINER CON TRANSFORM: puede causar flattening');
        }
      }, 100);
      
      // Volver a 0 después de 300ms
      const timeout = setTimeout(() => {
        gsap.set(slide3d0, { 
          rotateX: 0, 
          z: 0,
          force3D: true,
          transformOrigin: "center center"
        });
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [viewportHeight, cloned.length]);
  
  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div>{error}</div>;
  if (!total) return <div>No hay testimonios disponibles.</div>;
  
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `${base}${imagePath.slice(1)}`;
    }
    return `${base}${imagePath}`;
  };
  
  return (
    <div 
      style={{ 
        position: 'relative', 
        transform: 'none !important',
        isolation: 'isolate'
      }}
    >
      <div
        ref={containerRef}
        className="testimoniales-container testimoniales-container-vertical"
      >
        <div 
          ref={viewportRef}
          className="testimoniales-viewport"
        >
          <div
            ref={moverRef}
            className="testimoniales-mover"
          >
            <div
              ref={trackRef}
              className="testimoniales-track"
            >
              {cloned.map((item, i) => (
                <div key={i} className="testimoniales-slide">
                  <div
                    ref={(el) => (slide3dRefs.current[i] = el)}
                    className="slide-3d"
                  >
                    <div className="testimoniales-card">
                      <div className="testimoniales-text">
                        {item.text.replace(/^✨\s*/, '')}
                      </div>
                      <div className="testimoniales-author-info">
                        <img 
                          src={getImagePath(item.image)} 
                          alt={item.name || item.author} 
                          className="testimoniales-avatar"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="testimoniales-author-details">
                          <div className="testimoniales-author-name">
                            {item.name || (() => {
                              const parts = (item.author || '').split(/[-,]/);
                              return parts[0] ? parts[0].trim() : item.author;
                            })()}
                          </div>
                          <div className="testimoniales-author-role" title={item.role || (() => {
                            const parts = (item.author || '').split(/[-,]/);
                            return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
                          })()}>
                            {item.role || (() => {
                              const parts = (item.author || '').split(/[-,]/);
                              return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="testimoniales-quote-icon">"</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
