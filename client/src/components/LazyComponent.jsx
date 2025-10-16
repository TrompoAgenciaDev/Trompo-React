import { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Componente wrapper para lazy loading de componentes pesados
 * @param {Object} props - Props del componente
 * @param {Function} props.importFunc - Función de importación del componente
 * @param {React.Component} props.fallback - Componente de fallback (opcional)
 * @param {Object} props.componentProps - Props para pasar al componente lazy
 * @returns {JSX.Element}
 */
const LazyComponent = ({ 
  importFunc, 
  fallback = <LoadingSpinner />, 
  componentProps = {},
  ...props 
}) => {
  const LazyComp = lazy(importFunc);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComp {...componentProps} {...props} />
    </Suspense>
  );
};

export default LazyComponent;
