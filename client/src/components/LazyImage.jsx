import { useState } from 'react';
import { useLazyLoading } from '../hooks/useLazyLoading';

/**
 * Componente de imagen con lazy loading, soporte AVIF/WebP y srcSet optimizado
 * @param {Object} props - Props del componente
 * @param {string} props.src - URL de la imagen (fallback para navegadores antiguos)
 * @param {string} props.srcSet - Conjunto de imágenes responsive (ej: "image-400w.webp 400w, image-800w.webp 800w")
 * @param {string} props.sizes - Tamaños de imagen según viewport (ej: "(max-width: 768px) 100vw, 50vw")
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.className - Clases CSS
 * @param {string} props.placeholder - Color o imagen placeholder
 * @param {boolean} props.critical - Si es imagen crítica (sin lazy loading)
 * @param {Object} props.style - Estilos inline
 * @param {number} props.width - Ancho de la imagen en píxeles
 * @param {number} props.height - Alto de la imagen en píxeles
 * @param {Function} props.onLoad - Callback cuando carga
 * @param {Function} props.onError - Callback cuando hay error
 * @param {string} props.srcAvif - URL de la imagen en formato AVIF (opcional)
 * @param {string} props.srcSetAvif - srcSet para imágenes AVIF (opcional)
 * @param {string} props.srcWebP - URL de la imagen en formato WebP (opcional, si no se proporciona se usa src)
 * @param {string} props.srcSetWebP - srcSet para imágenes WebP (opcional, si no se proporciona se usa srcSet)
 * @returns {JSX.Element}
 */
const LazyImage = ({
  src,
  srcSet,
  sizes,
  alt = '',
  className = '',
  placeholder = '#f0f0f0',
  critical = false,
  style = {},
  width,
  height,
  onLoad,
  onError,
  srcAvif,
  srcSetAvif,
  srcWebP,
  srcSetWebP,
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

  // Calcular aspect-ratio si width y height están presentes
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  
  // Separar estilos del contenedor de los estilos de la imagen
  const { objectFit, ...containerStyleProps } = style || {};
  
  // Estilos del contenedor con dimensiones fijas para evitar CLS
  const containerStyle = {
    backgroundColor: placeholder,
    position: 'relative',
    overflow: 'hidden',
    ...(width && height ? {
      aspectRatio,
      width: '100%',
      minHeight: 0, // Permite que aspect-ratio funcione correctamente
    } : {}),
    ...containerStyleProps
  };

  // Determinar si usar <picture> con múltiples formatos
  const usePicture = srcAvif || srcSetAvif || srcWebP || srcSetWebP;
  
  // Validar srcSet: eliminar si solo tiene una imagen (srcSet falso)
  const hasValidSrcSet = srcSet && srcSet.split(',').length > 1;
  const finalSrcSet = hasValidSrcSet ? srcSet : undefined;
  const finalSrcSetAvif = srcSetAvif && srcSetAvif.split(',').length > 1 ? srcSetAvif : undefined;
  const finalSrcSetWebP = srcSetWebP && srcSetWebP.split(',').length > 1 ? srcSetWebP : undefined;

  const imageProps = {
    alt,
    width,
    height,
    loading: critical ? "eager" : "lazy",
    decoding: "async",
    onLoad: handleLoad,
    onError: handleError,
    style: {
      width: '100%',
      height: '100%',
      objectFit: objectFit || 'cover',
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease',
    },
    ...props
  };

  return (
    <div
      ref={ref}
      className={`lazy-image-container ${className}`}
      style={containerStyle}
    >
      {shouldLoad && !hasError && (
        usePicture ? (
          <picture>
            {/* AVIF - formato más moderno y eficiente */}
            {(srcAvif || finalSrcSetAvif) && (
              <source
                type="image/avif"
                srcSet={finalSrcSetAvif || srcAvif}
                sizes={sizes}
              />
            )}
            {/* WebP - fallback moderno */}
            {(srcWebP || finalSrcSetWebP || src) && (
              <source
                type="image/webp"
                srcSet={finalSrcSetWebP || (srcWebP ? `${srcWebP} 1x` : undefined)}
                sizes={sizes}
              />
            )}
            {/* Fallback final - formato original */}
            <img
              src={src}
              srcSet={finalSrcSet}
              sizes={sizes}
              {...imageProps}
            />
          </picture>
        ) : (
          <img
            src={src}
            srcSet={finalSrcSet}
            sizes={sizes}
            {...imageProps}
          />
        )
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
