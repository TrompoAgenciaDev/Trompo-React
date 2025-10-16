import { useState, useEffect } from 'react';

/**
 * Componente simple de video hero sin lazy loading para debugging
 */
const SimpleHeroVideo = ({
  desktopSrc,
  mobileSrc,
  desktopPoster,
  mobilePoster,
  className = '',
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

  return (
    <>
      {/* Desktop Video */}
      <video
        className={`hero-video desktop-only ${className}`}
        poster={desktopPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onError={(error) => console.log('Error en video desktop:', error)}
        onLoad={() => console.log('Video desktop cargado')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        {...props}
      >
        <source src={desktopSrc} type="video/mp4" />
      </video>

      {/* Mobile Video */}
      <video
        className={`hero-video mobile-only ${className}`}
        poster={mobilePoster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onError={(error) => console.log('Error en video mobile:', error)}
        onLoad={() => console.log('Video mobile cargado')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        {...props}
      >
        <source src={mobileSrc} type="video/mp4" />
      </video>
    </>
  );
};

export default SimpleHeroVideo;
