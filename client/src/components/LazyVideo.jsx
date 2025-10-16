import { useState, useRef, useEffect } from 'react';
import { useLazyVideo } from '../hooks/useLazyLoading';

/**
 * Componente de video con lazy loading y poster optimizado
 * @param {Object} props - Props del componente
 * @param {string} props.src - URL del video
 * @param {string} props.poster - URL del poster
 * @param {string} props.className - Clases CSS
 * @param {boolean} props.autoPlay - Si debe autoplay
 * @param {boolean} props.loop - Si debe loop
 * @param {boolean} props.muted - Si debe estar muteado
 * @param {boolean} props.playsInline - Si debe playsinline
 * @param {string} props.preload - Tipo de preload
 * @param {boolean} props.critical - Si es video crítico (sin lazy loading)
 * @param {Object} props.style - Estilos inline
 * @param {Function} props.onLoad - Callback cuando carga
 * @param {Function} props.onError - Callback cuando hay error
 * @returns {JSX.Element}
 */
const LazyVideo = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  preload = 'metadata',
  critical = false,
  style = {},
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const videoRef = useRef(null);
  
  const { isVisible, ref, shouldLoadVideo } = useLazyVideo({
    threshold: 0.1,
    rootMargin: '100px', // Más margen para videos
    once: true
  });

  const shouldLoad = critical || shouldLoadVideo;

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      };

      const handleError = () => {
        setHasError(true);
        if (onError) onError();
      };

      const handleCanPlay = () => {
        setShowPoster(false);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('canplay', handleCanPlay);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [shouldLoad, onLoad, onError]);

  return (
    <div
      ref={ref}
      className={`lazy-video-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        ...style
      }}
    >
      {/* Poster placeholder */}
      {showPoster && poster && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 2,
            opacity: shouldLoad ? 0 : 1,
            transition: 'opacity 0.5s ease'
          }}
        />
      )}

      {/* Video element */}
      {shouldLoad && !hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            ...style
          }}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px',
            zIndex: 3
          }}
        >
          Error loading video
        </div>
      )}

      {/* Loading indicator */}
      {shouldLoad && !isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
            color: '#fff',
            fontSize: '14px'
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};

export default LazyVideo;
