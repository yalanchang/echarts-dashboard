import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        bg0:   '#07080d',
        bg1:   '#0d1017',
        bg2:   '#121620',
        bg3:   '#181d2a',
        bline: '#1e2536',
        c1:    '#3bffa0',
        c2:    '#ff6b6b',
        c3:    '#ffd166',
        c4:    '#74b9ff',
        c5:    '#a29bfe',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config