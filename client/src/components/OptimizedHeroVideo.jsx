import { useState, useEffect } from 'react';
import LazyVideo from './LazyVideo';

/**
 * Componente optimizado para videos hero con poster y lazy loading
 * @param {Object} props - Props del componente
 * @param {string} props.desktopSrc - URL del video desktop
 * @param {string} props.mobileSrc - URL del video mobile
 * @param {string} props.desktopPoster - URL del poster desktop
 * @param {string} props.mobilePoster - URL del poster mobile
 * @param {string} props.className - Clases CSS
 * @param {boolean} props.critical - Si es video crítico
 * @returns {JSX.Element}
 */
const OptimizedHeroVideo = ({
  desktopSrc,
  mobileSrc,
  desktopPoster,
  mobilePoster,
  className = '',
  critical = false,
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };

    checkMobile();
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    mediaQuery.addEventListener('change', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', checkMobile);
    };
  }, []);

  const videoSrc = isMobile ? mobileSrc : desktopSrc;
  const posterSrc = isMobile ? mobilePoster : desktopPoster;

  return (
    <>
      {/* Desktop Video */}
      <LazyVideo
        src={desktopSrc}
        poster={desktopPoster}
        posterWidth={1920}
        posterHeight={1080}
        className={`hero-video desktop-only ${className}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        critical={true}
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onError={(error) => console.log('Error en video desktop:', error)}
        onLoad={() => console.log('Video desktop cargado')}
        {...props}
      />

      {/* Mobile Video */}
      <LazyVideo
        src={mobileSrc}
        poster={mobilePoster}
        posterWidth={768}
        posterHeight={1024}
        className={`hero-video mobile-only ${className}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        critical={true}
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onError={(error) => console.log('Error en video mobile:', error)}
        onLoad={() => console.log('Video mobile cargado')}
        {...props}
      />
    </>
  );
};

export default OptimizedHeroVideo;
