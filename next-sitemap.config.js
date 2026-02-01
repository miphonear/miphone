/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://miphone.ar',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // exclude: ['/admin/*', '/api/*'],
  additionalPaths: async (config) => {
    const today = new Date().toISOString()
    const extra = [
      '/', // home (opcional si ya la incluye)
      '/apple',
      '/android',
      '/consolas',
      '/wearables',
      '/foto-video',
      '/drone',
      '/accesorios',
    ]
    return extra.map((loc) =>
      config.transform(config, {
        loc,
        lastmod: today,
        changefreq: 'daily',
        priority: loc === '/' ? 0.7 : 0.6,
      }),
    )
  },
}
