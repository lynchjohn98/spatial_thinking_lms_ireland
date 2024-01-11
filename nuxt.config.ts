// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true, ssr: false },
    // Product page generated on-demand, revalidates in background
    '/register': { ssr: false },
    // Blog post generated on-demand once until next deploy
    '/manual-login': { isr: false },
  },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase', 'nuxt-icon', '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'],
  supabase: {
    redirectOptions: {
      exclude: [
        '/register',
        '/login',
        '/manual-login',
        '/reset',
      ]
    }
  },
  })
