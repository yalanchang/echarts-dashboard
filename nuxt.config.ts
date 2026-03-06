export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  experimental: {
    appManifest: false,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    dbHost:    process.env.DB_HOST    || '127.0.0.1',
    dbPort:    process.env.DB_PORT    || '3306',
    dbUser:    process.env.DB_USER    || 'root',
    dbPass:    process.env.DB_PASS    || '',
    dbName:    process.env.DB_NAME    || 'admin_db',
    jwtSecret: process.env.JWT_SECRET || 'change_me_in_production',

    public: {
      appName:    'DataPulse Admin',
      appVersion: '1.0.0',
    },
  },

  nitro: {
    routeRules: {
      // API 安全標頭
      '/api/**': {
        cors: false, // 關閉全開的 cors，改用下面精確設定
        headers: {
          'X-Content-Type-Options':    'nosniff', // 防止 MIME 類型混淆攻擊
          'X-Frame-Options':           'DENY', // 防止你的頁面被嵌入 iframe（防 Clickjacking）
          'X-XSS-Protection':          '1; mode=block', // 雖然現代瀏覽器已經不太支持，但仍可作為兼容性考量
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains', // 強制使用 HTTPS
        },
      },
      // 前端頁面安全標頭
      '/**': {
        headers: {
          'X-Frame-Options':           'DENY',// 防止 Clickjacking
          'X-Content-Type-Options':    'nosniff',// 防止 MIME 類型混淆攻擊
          'Referrer-Policy':           'strict-origin-when-cross-origin',// 僅同源請求中發送完整 Referer，跨源請求僅發送來源
          'Permissions-Policy':        'camera=(), microphone=(), geolocation=()',// 禁止頁面使用攝像頭、麥克風和地理位置等敏感功能
          'Content-Security-Policy':   "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;", // 嚴格的內容安全策略，僅允許同源資源和特定外部資源
        },
      },
    },
  },

  // CORS設定
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin':  process.env.ALLOWED_ORIGIN || 'http://localhost:3000', // 僅允許特定來源，避免使用 '*'
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS', // 明確允許的 HTTP 方法
        'Access-Control-Allow-Headers': 'Content-Type,Authorization', // 明確允許的請求頭
      },
    },
  },

  app: {
    head: {
      title: 'DataPulse Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },// 基本 SEO 設定
        // 防止搜尋引擎索引後台
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    },
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2024-11-01',
})