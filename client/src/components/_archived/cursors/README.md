# Custom Cursors - Archivados

Esta carpeta contiene los componentes de custom cursors que fueron archivados pero están listos para uso futuro.

## Archivos

- **TrailCursor.jsx**: Componente de cursor con trail/rastro que sigue el movimiento del mouse
- **CustomCursor.jsx**: Componente de cursor personalizado con diferentes estados (link, external, drag, etc.)
- **trail-cursor.css**: Estilos para el TrailCursor
- **custom-cursor.css**: Estilos para el CustomCursor (ubicado en `../../assets/_archived/`)

## Uso anterior

Estos componentes se utilizaban en:
- `App.jsx` - TrailCursor estaba comentado
- `EstrategiesText.jsx` - MixBlendCursor (archivo no encontrado, posiblemente eliminado)
- Varios componentes con atributos `data-cursor`

## Para reactivar

1. Descomentar las importaciones en los archivos donde se usaban
2. Restaurar los estilos relacionados en los archivos CSS
3. Agregar de vuelta los atributos `data-cursor` donde sean necesarios
4. Verificar que los estilos de `trail-cursor.css` y `custom-cursor.css` estén importados

## Notas

- Los estilos relacionados con `body.trail-cursor-in-slider` fueron eliminados de los CSS principales
- Los atributos `data-cursor` fueron removidos de los componentes
- Los estilos estándar de CSS `cursor: pointer` se mantuvieron intactos
