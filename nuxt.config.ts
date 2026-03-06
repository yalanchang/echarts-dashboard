export default defineNuxtConfig({
  ssr: false, 
  devtools: { enabled: true },
  experimental: {
    appManifest: false,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    dbHost:     process.env.DB_HOST     || '127.0.0.1',
    dbPort:     process.env.DB_PORT     || '3306',
    dbUser:     process.env.DB_USER     || 'root',
    dbPass:     process.env.DB_PASS     || '',
    dbName:     process.env.DB_NAME     || 'admin_db',
    jwtSecret:  process.env.JWT_SECRET  || 'change_me_in_production',

    public: {
      appName:    'DataPulse Admin',
      appVersion: '1.0.0',
    },
  },

  nitro: {
    routeRules: {
      '/api/**': { cors: true },
    },
  },

  app: {
    head: {
      title: 'DataPulse Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2024-11-01',
})