import { useState } from 'react';
import { useLazyLoading } from '../hooks/useLazyLoading';

/**
 * Componente de imagen con lazy loading
 * @param {Object} props - Props del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.className - Clases CSS
 * @param {string} props.placeholder - Color o imagen placeholder
 * @param {boolean} props.critical - Si es imagen crítica (sin lazy loading)
 * @param {Object} props.style - Estilos inline
 * @param {Function} props.onLoad - Callback cuando carga
 * @param {Function} props.onError - Callback cuando hay error
 * @returns {JSX.Element}
 */
const LazyImage = ({
  src,
  alt = '',
  className = '',
  placeholder = '#f0f0f0',
  critical = false,
  style = {},
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { isVisible, ref } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '50px',
    once: true
  });

  const shouldLoad = critical || isVisible;

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div
      ref={ref}
      className={`lazy-image-container ${className}`}
      style={{
        backgroundColor: placeholder,
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {shouldLoad && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            ...style
          }}
          {...props}
        />
      )}
      
      {hasError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px'
          }}
        >
          Error loading image
        </div>
      )}
    </div>
  );
};

export default LazyImage;
