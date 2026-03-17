import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "motion/react";
import "../assets/styles/animated-text-section.css";

// Componente para animar frase por frase
const AnimatedPhrase = ({ phrase, index, phraseDelay, shouldAnimate }) => {
  return (
    <motion.span
      className="animated-text-phrase"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: shouldAnimate ? 1 : 0.1 }}
      transition={{
        delay: shouldAnimate ? index * phraseDelay : 0,
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      {phrase}
    </motion.span>
  );
};

const AnimatedTextSection = ({ text, backgroundClass = "" }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const hasAnimatedRef = useRef(false);
  
  // Usar useInView para detectar cuando entra al viewport
  // Necesitamos que el ref esté disponible, así que usamos containerRef que se monta primero
  const isInView = useInView(containerRef, { 
    once: false, 
    amount: 0.1, // Trigger cuando al menos el 10% está visible
    margin: "0px" // Sin margen adicional
  });

  // Determinar color del texto basado en la clase de fondo
  const textColor = useMemo(() => {
    if (backgroundClass.includes('black-bg') || backgroundClass.includes('black-bg-2')) {
      return '#ffffff'; // Blanco para fondos negros
    }
    return '#000000'; // Negro para fondos blancos o sin clase
  }, [backgroundClass]);

  // Esperar a que el componente esté montado
  useEffect(() => {
    const checkRef = () => {
      if (containerRef.current) {
        setIsMounted(true);
      }
    };
    
    const timer = setTimeout(checkRef, 100);
    checkRef();
    
    return () => clearTimeout(timer);
  }, []);

  // Detectar cuando entra al viewport por primera vez y animar
  useEffect(() => {
    // Solo animar si entra al viewport Y aún no se ha animado Y el componente está montado
    if (isInView && !hasAnimatedRef.current && isMounted) {
      // Usar un pequeño delay para asegurar que todo esté listo
      const timeout = setTimeout(() => {
        hasAnimatedRef.current = true;
        setHasAnimated(true);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
    // Una vez que hasAnimatedRef.current es true, nunca más se ejecutará esta lógica
  }, [isInView, isMounted]);

  const phraseDelay = 0.3;
  
  // Dividir el texto en frases
  const phrases = useMemo(() => {
    if (!text) return [];
    
    const splitRegex = /([,.])\s+/g;
    const result = [];
    let lastIndex = 0;
    let match;
    
    while ((match = splitRegex.exec(text)) !== null) {
      const phrase = text.substring(lastIndex, match.index + 1) + ' ';
      if (phrase.trim().length > 0) {
        result.push(phrase);
      }
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      const lastPhrase = text.substring(lastIndex);
      if (lastPhrase.trim().length > 0) {
        result.push(lastPhrase);
      }
    }
    
    return result;
  }, [text]);

  if (!text) return null;

  return (
    <div ref={containerRef} className={`full-container animated-text-section-wrapper ${backgroundClass}`}>
      <div className="container animated-text-container">
        {isMounted && (
          <motion.span 
            ref={textRef}
            className="animated-text"
            style={{ color: textColor }}
          >
            {phrases.map((phrase, phraseIndex) => (
              <AnimatedPhrase
                key={`phrase-${phraseIndex}`}
                phrase={phrase}
                index={phraseIndex}
                phraseDelay={phraseDelay}
                shouldAnimate={hasAnimated}
              />
            ))}
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default AnimatedTextSection;
