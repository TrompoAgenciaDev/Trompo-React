import { useEffect, useRef, useState } from 'react';
import '../assets/styles/safari-video.css';

const SafariVideo = ({ 
  src, 
  className = '', 
  autoPlay = true, 
  loop = true, 
  muted = true,
  playsInline = true,
  preload = 'metadata',
  controlsList = 'nodownload noremoteplayback',
  disablePictureInPicture = true,
  onError,
  onLoad,
  ...props 
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Detectar Safari
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  // Función para intentar reproducir el video
  const playVideo = async () => {
    if (!videoRef.current) return false;

    try {
      const video = videoRef.current;
      
      // En Safari, necesitamos ser más explícitos
      if (isSafari) {
        // Recargar el video si es necesario
        if (video.readyState < 2) {
          video.load();
          await new Promise(resolve => {
            video.addEventListener('loadeddata', resolve, { once: true });
          });
        }
      }
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setHasError(false);
        return true;
      }
    } catch (error) {
      setHasError(true);
      setIsPlaying(false);
      if (onError) onError(error);
      return false;
    }
    return false;
  };

  // Manejar interacción del usuario
  const handleUserInteraction = async () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (autoPlay && !isPlaying) {
        await playVideo();
      }
    }
  };

  // Efecto principal para configurar el video
  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;

    // Configurar propiedades del video
    video.muted = muted;
    video.playsInline = playsInline;
    video.loop = loop;
    video.preload = preload;

    // Event listeners
    const handleLoadedData = async () => {
      if (onLoad) onLoad();
      
      // En Safari, esperar a que el usuario interactúe antes de autoplay
      if (isSafari && autoPlay) {
        // Intentar autoplay inmediatamente
        const success = await playVideo();
        if (!success) {
          // Si falla, esperar interacción del usuario
          document.addEventListener('click', handleUserInteraction, { once: true });
          document.addEventListener('touchstart', handleUserInteraction, { once: true });
        }
      } else if (autoPlay) {
        await playVideo();
      }
    };

    const handleError = (e) => {
      setHasError(true);
      if (onError) onError(e);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [src, isSafari, autoPlay, muted, playsInline, loop, preload, onError, onLoad]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      playsInline={playsInline}
      loop={loop}
      preload={preload}
      controlsList={controlsList}
      disablePictureInPicture={disablePictureInPicture}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        backgroundColor: '#ffffff'
      }}
      {...props}
    >
      <source src={src} type="video/mp4" />
      {/* Fallback para navegadores que no soportan video */}
      Tu navegador no soporta el video.
    </video>
  );
};

export default SafariVideo;
