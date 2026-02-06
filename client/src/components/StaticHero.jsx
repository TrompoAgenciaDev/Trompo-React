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
  
  // useEffect SOLO para iniciar la reproducción del video después del primer paint
  // El video ya es discoverable desde HTML inicial (sources renderizados)
  // NO afecta layout ni LCP discovery
  useEffect(() => {
    // Esperar al primer paint usando requestAnimationFrame
    // Esto asegura que el poster ya se pintó antes de iniciar el video
    const initVideo = () => {
      const video = videoRef.current;
      if (!video) return;
      
      // Cargar el video (los sources ya están en el HTML)
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
      
      {/* VIDEO: Discoverable desde HTML inicial para LCP optimization */}
      {/* Sources renderizados desde el inicio para que sean discoverable */}
      <video
        ref={videoRef}
        className="hero-video"
        width={1920}
        height={1080}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        fetchPriority="high"
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
        {/* Desktop video - discoverable desde HTML inicial */}
        <source 
          src={desktopSrc}
          type={desktopSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          media="(min-width: 768px)"
        />
        {/* Mobile video - discoverable desde HTML inicial */}
        <source 
          src={mobileSrc}
          type={mobileSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          media="(max-width: 767px)"
        />
      </video>
    </div>
  );
};

export default StaticHero;
