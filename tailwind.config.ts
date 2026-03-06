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
        bg0:   'var(--bg0)',
        bg1:   'var(--bg1)',
        bg2:   'var(--bg2)',
        bg3:   'var(--bg3)',
        bline: 'var(--bline)',
        c1:    'var(--c1)',
        c2:    'var(--c2)',
        c3:    'var(--c3)',
        c4:    'var(--c4)',
        c5:    'var(--c5)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config