export default {
  multipass: true,
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'removeUselessDefs',
    'cleanupNumericValues',
    'removeUnknownsAndDefaults',
    'removeUnusedNS',
    'removeRasterImages',
    // Mantiene escalado por CSS; asegurar que viewBox permanezca
    'removeDimensions',
    // Si NO necesitás id/class en tus SVGs, mantenelo. Si sí, excluílos.
    {
      name: 'removeAttrs',
      params: {
        attrs: ['style', 'xml:space', 'data.*'], // conservá id/class si los usás
      },
    },
    {
      name: 'convertColors',
      params: {
        currentColor: true, // intenta mapear fill/stroke a currentColor
      },
    },
    // Opcionales de calidad de vida
    'sortAttrs',
    // 'removeTitle', // descomenta si no usás <title> en accesibilidad
    // 'cleanupIDs', // solo si no referenciás IDs
  ],
}
