import { defineNuxtConfig } from 'nuxt/config'
import pugPlugin from 'vite-plugin-pug'

const DOCKILOT_API_URL = process.env.DOCKILOT_API_URL || 'http://localhost:4000'

export default defineNuxtConfig({
  ssr: false,
  telemetry: false,
  pages: true,
  srcDir: 'src',
  debug: !!process.env.DEBUG,
  css: [
    '~/assets/styles/global.sass',
  ],
  components: {
    global: true,
    dirs: [{ path: '~/components', prefix: 'q-custom' }],
  },
  modules: [
    '@nuxt-alt/auth',
    '@nuxt-alt/http',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    '@nuxt/devtools',
    'nuxt-socket-io',
  ],
  appConfig: {
    api: {
      url: DOCKILOT_API_URL,
    },
  },
  http: {
    debug: process.env.NODE_ENV === 'development',
    browserBaseURL: DOCKILOT_API_URL,
    baseURL: DOCKILOT_API_URL,
  },
  dayjs: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    defaultTimezone: 'Paris',
    plugins: ['timezone', 'relativeTime'],
  },
  quasar: {
    iconSet: 'mdi-v7',
    config: {
      dark: 'auto',
      brand: {
        primary: '#0088D1',
        secondary: '#00589B',
        accent: '#9c27b0',
        dark: '#1a1a1a',
        'dark-page': '#121212',
        positive: '#21ba45',
        negative: '#ff3860',
        info: '#31ccec',
        warning: '#f2c037',
      },
    },
    plugins: ['Dialog', 'Loading', 'Notify'],
  },
  io: {
    sockets: [
      // {
      //   name: 'home',
      //   url: `${DOCKILOT_API_URL}/console`,
      //   default: true,
      //   vuex: { /* see section below */ },
      //   namespaces: { /* see section below */ }
      // },
    ]
  },
  vite: {
    define: {
      'process.env.DEBUG': process.env.NODE_ENV === 'development',
    },
    plugins: [
      pugPlugin(<any>{
        pretty: true,
        compilerOptions: {},
      }),
    ],
  },
})
