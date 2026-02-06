export default {
  plugins: {
    '@fullhuman/postcss-purgecss': process.env.NODE_ENV === 'production' ? {
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
      ],
      // Mantener clases que puedan ser generadas dinámicamente
      safelist: {
        // Patrones para clases dinámicas comunes
        standard: [
          /^lazy-image-container$/,
          /^loading$/,
          /^error$/,
          /^active$/,
          /^inactive$/,
          /^visible$/,
          /^hidden$/,
          /^open$/,
          /^closed$/,
          /^is-/,
          /^has-/,
        ],
        // Clases que empiezan con ciertos prefijos
        deep: [
          /^motion-/,
          /^video-/,
          /^swiper-/,
        ],
        // Clases que contienen ciertos strings
        greedy: [
          /^.*-enter$/,
          /^.*-exit$/,
          /^.*-active$/,
          /^.*-done$/,
        ],
      },
      defaultExtractor: (content) => {
        // Extraer clases de JSX/TSX
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        // Extraer clases de atributos className
        const innerMatches = content.match(/className=["']([^"']+)["']/g) || [];
        const classNames = innerMatches.map(match => 
          match.replace(/className=["']|["']/g, '').split(' ')
        ).flat();
        return [...broadMatches, ...classNames];
      },
    } : false,
  },
};
