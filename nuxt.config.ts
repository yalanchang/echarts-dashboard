export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET,

    public: {
      appName: 'DataPulse Admin',
      appVersion: '1.0.0',
      apiBase: '/api'
    },
  },

  nitro: {
    preset: 'vercel',  // 指定 Vercel 部署
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      },
    },
  },

  app: {
    head: {
      title: 'DataPulse Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    },
  },

  compatibilityDate: '2024-11-01',
})