# Resultados de Lighthouse - Verificación de Métricas

**Fecha de ejecución:** 2026-02-06  
**URL analizada:** http://localhost:4173/  
**Modo:** Producción (build)

## Métricas Objetivo vs Resultados

| Métrica | Objetivo | Resultado | Estado |
|---------|----------|-----------|--------|
| **Performance Score** | ≥ 90 | **22** | ❌ No cumple |
| **CLS (Cumulative Layout Shift)** | < 0.1 | **0.432** | ❌ No cumple |
| **LCP (Largest Contentful Paint)** | < 1.8s | **19.7s** | ❌ No cumple |
| **TBT (Total Blocking Time)** | < 150ms | **680ms** | ❌ No cumple |

## Análisis Detallado

### Performance Score: 22/100
- **Estado:** Crítico
- El score general está muy por debajo del objetivo de 90 puntos.

### CLS (Cumulative Layout Shift): 0.432
- **Objetivo:** < 0.1
- **Resultado:** 0.432 (4.32x por encima del límite)
- **Problemas identificados:**
  - 2 layout shifts encontrados
  - Shift principal: 0.390 (probablemente relacionado con elementos sin dimensiones)
  - Shift secundario: 0.042

### LCP (Largest Contentful Paint): 19.7s
- **Objetivo:** < 1.8s
- **Resultado:** 19.7s (10.9x por encima del límite)
- **Estado:** Crítico
- El LCP está extremadamente alto, indicando problemas graves en la carga del contenido principal.

### TBT (Total Blocking Time): 680ms
- **Objetivo:** < 150ms
- **Resultado:** 680ms (4.5x por encima del límite)
- **Problemas identificados:**
  - 14 long tasks encontrados
  - Tiempo total de bloqueo: 700ms

## Otras Métricas Relevantes

- **FCP (First Contentful Paint):** 5.6s
- **Speed Index:** 7.5s
- **Time to Interactive:** 22.1s

## Conclusiones

**Todas las métricas críticas están por debajo de los objetivos establecidos.** El sitio requiere optimizaciones significativas en:

1. **CLS:** Implementar dimensiones fijas para todas las imágenes y reservar espacio para contenido dinámico
2. **LCP:** Optimizar la carga del hero/video principal, implementar preload crítico, y optimizar imágenes
3. **TBT:** Reducir JavaScript ejecutado en el primer render, mejorar code splitting, y optimizar tareas largas
4. **Performance General:** Revisar todas las optimizaciones del plan de performance

## Recomendaciones Inmediatas

1. Revisar y completar todas las tareas pendientes del plan de optimización
2. Priorizar las optimizaciones de CLS (Fase 1) ya que es bloqueante
3. Optimizar el hero/video para mejorar LCP (Fase 2)
4. Reducir JavaScript inicial y mejorar code splitting (Fase 5)
