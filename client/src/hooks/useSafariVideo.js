import { useEffect, useRef, useState } from 'react';

const useSafariVideo = (src, options = {}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  // Detectar Safari
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  // Función para intentar reproducir el video
  const playVideo = async () => {
    if (!videoRef.current) return;

    try {
      // En Safari, necesitamos ser más explícitos
      if (isSafari) {
        videoRef.current.load(); // Recargar el video
        await new Promise(resolve => {
          videoRef.current.addEventListener('loadeddata', resolve, { once: true });
        });
      }
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setHasError(false);
      }
    } catch (error) {
      console.log('Error al reproducir video:', error);
      setHasError(true);
      setIsPlaying(false);
    }
  };

  // Función para pausar el video
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Efecto para manejar la reproducción automática
  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;

    // Configurar el video
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    // Event listeners
    const handleLoadedData = () => {
      if (options.autoPlay !== false) {
        playVideo();
      }
    };

    const handleError = (e) => {
      console.log('Error de video:', e);
      setHasError(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Agregar event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Para Safari, intentar reproducir cuando el usuario interactúa
    const handleUserInteraction = () => {
      if (!isPlaying && !hasError) {
        playVideo();
      }
    };

    // Agregar listener de interacción del usuario
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [src, isSafari, isPlaying, hasError, options.autoPlay]);

  return {
    videoRef,
    isPlaying,
    hasError,
    isSafari,
    playVideo,
    pauseVideo
  };
};

export default useSafariVideo;
