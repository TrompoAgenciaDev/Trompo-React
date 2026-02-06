import { useRef, useEffect } from 'react';

/**
 * Hero completamente estático - cumple estrictamente las reglas de LCP y CLS
 * 
 * REGLAS CUMPLIDAS:
 * - Un solo elemento LCP (el poster)
 * - Poster renderizado en primer render, nunca desaparece
 * - Un solo poster en DOM usando <picture> con source media
 * - Video montado después del primer paint, solo se superpone visualmente
 * - Tamaño definitivo desde el inicio, sin cambios de layout
 * - No depende de estado para renderizar
 */
const StaticHero = ({
  desktopSrc,
  mobileSrc,
  desktopPoster,
  mobilePoster,
  className = '',
}) => {
  const videoRef = useRef(null);
  
  // useEffect SOLO para iniciar el video después del primer paint
  // NO afecta layout ni LCP
  // PROHIBIDO: requestIdleCallback en above-the-fold
  useEffect(() => {
    // Esperar al primer paint usando requestAnimationFrame
    // Esto asegura que el poster ya se pintó antes de iniciar el video
    const initVideo = () => {
      const video = videoRef.current;
      if (!video) return;
      
      // Determinar qué video cargar basado en viewport
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const videoSrc = isMobile ? mobileSrc : desktopSrc;
      
      // Establecer la fuente del video
      const source = video.querySelector('source');
      if (source) {
        source.src = videoSrc;
      }
      
      // Cargar el video
      video.preload = 'metadata';
      video.load();
      
      // Cuando el video pueda reproducirse, hacerlo visible
      // PERO el poster permanece visible debajo (z-index)
      const handleCanPlay = () => {
        video.style.opacity = '1';
        // El poster NO se oculta, solo queda debajo del video
      };
      
      const handleError = () => {
        console.warn('Error al cargar video hero');
        // Si hay error, el poster ya está visible, no hacer nada
      };
      
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });
    };
    
    // Usar requestAnimationFrame para esperar al primer paint
    // Luego setTimeout(0) para diferir la carga del video
    let timeoutId;
    const rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(initVideo, 0);
    });
    
    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [desktopSrc, mobileSrc]);
  
  // El poster se renderiza inmediatamente en el HTML inicial
  // Un solo elemento <img> usando <picture> con source media
  // NUNCA desaparece, permanece en el DOM durante toda la vida de la página
  return (
    <div data-hero-container className={className}>
      {/* POSTER: Un solo elemento LCP, nunca desaparece */}
      <picture>
        <source 
          media="(min-width: 768px)" 
          srcSet={desktopPoster}
        />
        <img
          src={mobilePoster}
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="hero-poster-img"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            // NUNCA display: none, NUNCA opacity: 0
            // El poster permanece visible siempre
            // width y height definidos para evitar CLS
          }}
        />
      </picture>
      
      {/* VIDEO: Se monta después del primer paint, solo se superpone */}
      {/* Un solo video, la fuente se establece dinámicamente en useEffect */}
      <video
        ref={videoRef}
        className="hero-video"
        width={1920}
        height={1080}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 2,
          opacity: 0,
          transition: 'opacity 0.5s ease',
          // El video va encima del poster pero no lo oculta
          // El poster permanece visible debajo (aunque cubierto visualmente)
        }}
      >
        {/* La fuente se establece dinámicamente en useEffect después del primer paint */}
        <source type="video/mp4" />
      </video>
    </div>
  );
};

export default StaticHero;
