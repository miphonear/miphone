// svgo.config.mjs
export default {
  multipass: true,
  plugins: [
    // Limpieza segura que no toca colores
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'removeUselessDefs',
    'cleanupNumericValues',
    'removeUnusedNS',
    'removeRasterImages',

    // Mantener escalado por CSS: quita width/height y conserva viewBox
    'removeDimensions',

    // Remover solo atributos de accesibilidad y estilos inline problemáticos
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'aria-label',
          'aria-labelledby',
          'aria-describedby',
          'role',
          'focusable',
          'tabindex',
          'style',
          'xml:space',
          'data-*',
        ],
      },
    },

    // NO tocar colores
    // No uses convertColors aquí

    // Ordenar atributos (no cambia colores)
    'sortAttrs',

    // Opcional: remover <title>. Si querés mantenerlos para accesibilidad, comentá esta línea
    'removeTitle',

    // NO activar cleanupIDs si tenés gradientes/mascaras (url(#id))
    // 'cleanupIDs',
  ],
}

// Para correr el archivo, en raiz:	npx svgo --config=svgo.config.mjs -f public/images/brands -o public/images/brands
